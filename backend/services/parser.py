import io
import re
import logging
from typing import Optional, Dict, Any, List

from fastapi import UploadFile, HTTPException
import docx
import pdfplumber
from backend.models.schemas import (
    ResumeParseResponse,
    PersonalInfoResponse,
    SkillCategoryResponse,
    WorkEntryResponse,
    EducationEntryResponse,
    ProjectEntryResponse,
    LanguageEntryResponse,
    CertEntryResponse,
)

logger = logging.getLogger(__name__)

_DATE_RANGE_HINT = re.compile(
    r"(present|\d{4}\s*[-–]\s*\d{4}|\d{4}\s*[-–]\s*present|\bjan\b|\bfeb\b|\bmar\b|\bapr\b|\bmay\b|\bjun\b|\bjul\b|\baug\b|\bsep\b|\boct\b|\bnov\b|\bdec\b)",
    re.I,
)


def _split_pipe_segments(line: str) -> list[str]:
    normalized = line.replace("•", "|")
    return [p.strip() for p in normalized.split("|") if p.strip()]


def _looks_like_experience_meta_line(text: str) -> bool:
    """Location | start - end (or Present)."""
    if "|" not in text:
        return False
    _, right = text.split("|", 1)
    return bool(_DATE_RANGE_HINT.search(right))


def _parse_experience_date_range(segment: str) -> tuple[str, str, bool]:
    s = segment.strip()
    low = s.lower()
    is_current = "present" in low
    sep = " - " if " - " in s else (" – " if " – " in s else None)
    if sep:
        left, right = s.split(sep, 1)
        return left.strip(), right.strip(), is_current
    if "-" in s or "–" in s:
        ch = "-" if "-" in s else "–"
        parts = re.split(r"[-–]", s, 1)
        if len(parts) == 2:
            return parts[0].strip(), parts[1].strip(), is_current
    return s, "", is_current


def _split_education_years(segment: str) -> tuple[str, str]:
    s = segment.strip()
    sep = " - " if " - " in s else (" – " if " – " in s else None)
    if sep:
        a, b = s.split(sep, 1)
        return a.strip(), b.strip()
    if re.fullmatch(r"\d{4}\s*[-–]\s*\d{4}", s):
        a, b = re.split(r"[-–]", s, 1)
        return a.strip(), b.strip()
    return s, ""


def _split_degree_and_field(degree_line: str) -> tuple[str, str]:
    s = degree_line.strip()
    low = s.lower()
    if " in " in low:
        idx = low.rfind(" in ")
        return s[:idx].strip(), s[idx + 4 :].strip()
    return s, ""


def _is_list_or_bullet(para, text: str) -> bool:
    style = (para.style.name or "").lower()
    if "list" in style:
        return True
    return text.lstrip().startswith(("•", "-", "*", "–", "·"))


def _apply_header_lines(response: ResumeParseResponse, header_lines: list[str]) -> None:
    if not header_lines or not response.personal_info:
        return
    pi = response.personal_info
    pi.full_name = header_lines[0]
    if len(header_lines) >= 2:
        parts = _split_pipe_segments(header_lines[1])
        if len(parts) >= 1:
            pi.linkedin_url = parts[0]
        if len(parts) == 2:
            pi.phone = parts[1]
        elif len(parts) >= 3:
            pi.portfolio_url = parts[1]
            pi.phone = parts[2]
    if len(header_lines) >= 3:
        parts = _split_pipe_segments(header_lines[2])
        if len(parts) >= 1:
            pi.city = parts[0]
        if len(parts) >= 2:
            pi.email = parts[1]
        if len(parts) >= 3:
            pi.country = parts[2]

async def parse_resume(file: UploadFile) -> ResumeParseResponse:
    """Detect file type and route to appropriate parser."""
    try:
        file_bytes = await file.read()
        filename = file.filename or ""
        content_type = file.content_type or ""

        if "pdf" in content_type or filename.lower().endswith(".pdf"):
            return parse_pdf(file_bytes)
        elif "wordprocessingml" in content_type or filename.lower().endswith(".docx") or "officedocument" in content_type:
            return parse_docx(file_bytes)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF or DOCX file.")
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to parse resume.")
        return ResumeParseResponse(parseWarnings=[f"Unhandled error: {str(e)}"])


def parse_docx(file_bytes: bytes) -> ResumeParseResponse:
    warnings: list[str] = []
    response = ResumeParseResponse(
        personalInfo=PersonalInfoResponse(),
        profile={"summaryText": ""},
        skills=[],
        experience=[],
        education=[],
        projects=[],
        languages=[],
        certifications=[],
        parseWarnings=warnings,
    )

    try:
        doc = docx.Document(io.BytesIO(file_bytes))
    except Exception as e:
        warnings.append(f"Could not load docx: {str(e)}")
        return response

    current_section = "HEADER"
    header_lines: list[str] = []

    exp_expect_meta = False
    edu_line1: Optional[Dict[str, str]] = None
    proj_pending: Optional[Dict[str, str]] = None

    def flush_project() -> None:
        nonlocal proj_pending
        if not proj_pending:
            return
        response.projects.append(
            ProjectEntryResponse(
                projectTitle=proj_pending.get("title", ""),
                date=proj_pending.get("date", ""),
                synopsis=proj_pending.get("synopsis", ""),
            )
        )
        proj_pending = None

    def flush_education() -> None:
        nonlocal edu_line1
        if edu_line1:
            warnings.append(
                "Education section ended with an incomplete entry (missing degree/location line after institution row)."
            )
            edu_line1 = None

    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue

        if para.style.name.startswith("Heading 2"):
            flush_project()
            flush_education()
            exp_expect_meta = False

            header_name = text.lower()
            if "profile" in header_name:
                current_section = "PROFILE"
            elif "skills" in header_name:
                current_section = "SKILLS"
            elif "experience" in header_name:
                current_section = "EXPERIENCE"
            elif "education" in header_name:
                current_section = "EDUCATION"
            elif "projects" in header_name:
                current_section = "PROJECTS"
            elif "languages" in header_name:
                current_section = "LANGUAGES"
            elif "certification" in header_name:
                current_section = "CERTIFICATIONS"
            else:
                current_section = "UNKNOWN"
            continue

        if current_section == "HEADER":
            header_lines.append(text)
        elif current_section == "PROFILE":
            if not response.profile:
                response.profile = {"summaryText": text}
            else:
                response.profile["summaryText"] += " " + text
        elif current_section == "SKILLS":
            if ":" in text:
                cat, skills = text.split(":", 1)
                response.skills.append(
                    SkillCategoryResponse(categoryName=cat.strip(), skills=skills.strip())
                )
            else:
                warnings.append(f"Could not parse skill line: {text}")
        elif current_section == "EXPERIENCE":
            if _is_list_or_bullet(para, text):
                if response.experience:
                    exp = response.experience[-1]
                    bullets = exp.bullet_points
                    if bullets is None:
                        exp.bullet_points = []
                        bullets = exp.bullet_points
                    bullets.append(text.lstrip("-•· \t"))
                else:
                    warnings.append(f"Experience bullet point found without a job: {text}")
                exp_expect_meta = False
                continue

            if "|" in text and _looks_like_experience_meta_line(text) and response.experience:
                parts = [p.strip() for p in text.split("|")]
                loc = parts[0] if parts else ""
                date_seg = parts[-1] if len(parts) >= 2 else ""
                exp = response.experience[-1]
                exp.location = loc
                sd, ed, cur = _parse_experience_date_range(date_seg)
                exp.start_date = sd
                exp.end_date = ed
                exp.is_current = cur
                exp_expect_meta = False
                continue

            if "|" in text:
                title, company = text.split("|", 1)
                response.experience.append(
                    WorkEntryResponse(
                        jobTitle=title.strip(),
                        companyName=company.strip(),
                        bulletPoints=[],
                        startDate="",
                        endDate="",
                        isCurrent=False,
                        location="",
                    )
                )
                exp_expect_meta = True
                continue

            if response.experience and exp_expect_meta:
                exp = response.experience[-1]
                if not exp.location:
                    exp.location = text
                    exp_expect_meta = False
                    continue

            response.experience.append(
                WorkEntryResponse(
                    jobTitle=text,
                    companyName="",
                    bulletPoints=[],
                    startDate="",
                    endDate="",
                    isCurrent=False,
                    location="",
                )
            )
            exp_expect_meta = True

        elif current_section == "EDUCATION":
            right = text.split("|")[-1].strip() if "|" in text else ""
            if "|" in text and re.search(r"\d{4}", right):
                if edu_line1 is not None:
                    flush_education()
                inst, yrs = text.split("|", 1)
                edu_line1 = {"institution": inst.strip(), "years": yrs.strip()}
            elif edu_line1 is not None:
                degree_line = text
                location = ""
                if "|" in degree_line:
                    deg_part, loc_part = degree_line.rsplit("|", 1)
                    degree_line = deg_part.strip()
                    location = loc_part.strip()
                deg_type, field = _split_degree_and_field(degree_line)
                sy, ey = _split_education_years(edu_line1["years"])
                response.education.append(
                    EducationEntryResponse(
                        degreeType=deg_type,
                        fieldOfStudy=field,
                        institution=edu_line1["institution"],
                        location=location,
                        startYear=sy,
                        endYear=ey,
                    )
                )
                edu_line1 = None
            else:
                warnings.append(f"Unexpected education line (expected two-line block): {text}")

        elif current_section == "PROJECTS":
            if "|" in text and not _is_list_or_bullet(para, text):
                flush_project()
                title, date = text.split("|", 1)
                proj_pending = {"title": title.strip(), "date": date.strip(), "synopsis": ""}
            elif proj_pending is not None:
                prev = proj_pending.get("synopsis", "")
                proj_pending["synopsis"] = (prev + " " + text).strip() if prev else text
            else:
                if ":" in text:
                    title, synopsis = text.split(":", 1)
                    response.projects.append(
                        ProjectEntryResponse(
                            projectTitle=title.strip(),
                            synopsis=synopsis.strip(),
                            date="",
                        )
                    )
                else:
                    warnings.append(f"Could not parse project line: {text}")

        elif current_section == "LANGUAGES":
            if ":" in text:
                lang, rest = text.split(":", 1)
                rest = rest.strip()
                cefr = ""
                m = re.search(r"\(([A-Z0-9]{1,4})\)\s*$", rest)
                if m:
                    cefr = m.group(1)
                    rest = rest[: m.start()].strip()
                response.languages.append(
                    LanguageEntryResponse(
                        language=lang.strip(),
                        proficiencyLabel=rest,
                        cefrLevel=cefr,
                    )
                )
            else:
                warnings.append(f"Could not parse language line: {text}")

        elif current_section == "CERTIFICATIONS":
            cert_line = text
            date = ""
            if "|" in text:
                left, date = text.rsplit("|", 1)
                cert_line = left.strip()
                date = date.strip()
            m = re.match(r"^(.+?)\s*\(([^)]+)\)\s*$", cert_line)
            if m:
                name, issuer = m.group(1).strip(), m.group(2).strip()
            else:
                name, issuer = cert_line.strip(), ""
            response.certifications.append(
                CertEntryResponse(certName=name, issuer=issuer, date=date)
            )

    flush_project()
    flush_education()
    _apply_header_lines(response, header_lines)

    return response

def parse_pdf(file_bytes: bytes) -> ResumeParseResponse:
    warnings = ["PDF parsing is less accurate than DOCX parsing."]
    response = ResumeParseResponse(
        personalInfo=PersonalInfoResponse(),
        profile={"summaryText": ""},
        skills=[],
        experience=[],
        education=[],
        projects=[],
        languages=[],
        certifications=[],
        parseWarnings=warnings
    )

    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
    except Exception as e:
        warnings.append(f"Could not load pdf: {str(e)}")
        return response

    current_section = "HEADER"
    header_lines = []

    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue

        lower_line = line.lower()
        if lower_line in ["profile", "skills & technologies", "work experience", "education", "projects & extra", "languages", "certification", "certifications"]:
            if "profile" in lower_line:
                current_section = "PROFILE"
            elif "skills" in lower_line:
                current_section = "SKILLS"
            elif "experience" in lower_line:
                current_section = "EXPERIENCE"
            elif "education" in lower_line:
                current_section = "EDUCATION"
            elif "projects" in lower_line:
                current_section = "PROJECTS"
            elif "languages" in lower_line:
                current_section = "LANGUAGES"
            elif "certification" in lower_line:
                current_section = "CERTIFICATIONS"
            continue

        if current_section == "HEADER":
            header_lines.append(line)
        elif current_section == "PROFILE":
            if not response.profile:
                response.profile = {"summaryText": line}
            else:
                response.profile["summaryText"] += " " + line
        elif current_section == "SKILLS":
            if ":" in line:
                cat, skills = line.split(":", 1)
                response.skills.append(SkillCategoryResponse(categoryName=cat.strip(), skills=skills.strip()))
        elif current_section == "EXPERIENCE":
            if line.startswith("-") or line.startswith("•"):
                if response.experience:
                    response.experience[-1].bullet_points.append(line.lstrip("-• \t"))
            else:
                response.experience.append(WorkEntryResponse(jobTitle=line, bulletPoints=[]))
        elif current_section == "EDUCATION":
            response.education.append(EducationEntryResponse(degreeType=line))
        elif current_section == "PROJECTS":
            if ":" in line:
                title, synopsis = line.split(":", 1)
                response.projects.append(ProjectEntryResponse(projectTitle=title.strip(), synopsis=synopsis.strip()))
        elif current_section == "LANGUAGES":
            if ":" in line:
                lang, prof = line.split(":", 1)
                response.languages.append(LanguageEntryResponse(language=lang.strip(), proficiencyLabel=prof.strip()))
        elif current_section == "CERTIFICATIONS":
            response.certifications.append(CertEntryResponse(certName=line))

    if len(header_lines) >= 1:
        response.personal_info.full_name = header_lines[0]

    return response
