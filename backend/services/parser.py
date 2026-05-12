import io
import re
import logging
from typing import Optional, Dict, Any, List

from fastapi import UploadFile, HTTPException
import docx
import pdfplumber
"""review required"""
from backend.models.schemas import (
    ResumeParseResponse,
    PersonalInfoResponse,
    SkillCategoryResponse,
    WorkEntryResponse,
    EducationEntryResponse,
    ProjectEntryResponse,
    LanguageEntryResponse,
    CertEntryResponse,
    generate_uuid
)

logger = logging.getLogger(__name__)

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
    warnings = []
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
        doc = docx.Document(io.BytesIO(file_bytes))
    except Exception as e:
        warnings.append(f"Could not load docx: {str(e)}")
        return response

    current_section = "HEADER"
    header_lines = []

    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue

        if para.style.name.startswith("Heading 2"):
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
                response.skills.append(SkillCategoryResponse(
                    categoryName=cat.strip(),
                    skills=skills.strip()
                ))
            else:
                warnings.append(f"Could not parse skill line: {text}")
        elif current_section == "EXPERIENCE":
            if para.style.name.startswith("List Paragraph") or text.startswith("-") or text.startswith("•"):
                if response.experience:
                    response.experience[-1].bullet_points.append(text.lstrip("-• \t"))
                else:
                    warnings.append(f"Experience bullet point found without a job: {text}")
            elif "\t" in text:
                parts = text.split("\t")
                job_title = parts[0].strip()
                company_date = parts[-1].strip()
                response.experience.append(WorkEntryResponse(
                    jobTitle=job_title,
                    companyName=company_date, # Fallback
                    bulletPoints=[]
                ))
            else:
                if response.experience and not response.experience[-1].location:
                    response.experience[-1].location = text
                else:
                    response.experience.append(WorkEntryResponse(
                        jobTitle=text,
                        bulletPoints=[]
                    ))
        elif current_section == "EDUCATION":
            response.education.append(EducationEntryResponse(
                degreeType=text
            ))
        elif current_section == "PROJECTS":
            if ":" in text:
                title, synopsis = text.split(":", 1)
                response.projects.append(ProjectEntryResponse(
                    projectTitle=title.strip(),
                    synopsis=synopsis.strip()
                ))
        elif current_section == "LANGUAGES":
            if ":" in text:
                lang, prof = text.split(":", 1)
                response.languages.append(LanguageEntryResponse(
                    language=lang.strip(),
                    proficiencyLabel=prof.strip()
                ))
        elif current_section == "CERTIFICATIONS":
            response.certifications.append(CertEntryResponse(
                certName=text
            ))

    # Parse header lines
    if len(header_lines) >= 1:
        response.personal_info.full_name = header_lines[0]
    if len(header_lines) >= 2:
        parts = header_lines[1].split("•")
        if len(parts) >= 1:
            response.personal_info.linkedin_url = parts[0].strip()
        if len(parts) >= 2:
            response.personal_info.phone = parts[1].strip()
    if len(header_lines) >= 3:
        parts = header_lines[2].split("•")
        if len(parts) >= 1:
            response.personal_info.city = parts[0].strip()
        if len(parts) >= 2:
            response.personal_info.email = parts[1].strip()

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
