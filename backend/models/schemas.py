import uuid
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, Field

def generate_uuid() -> str:
    """Generate a UUID string for default IDs."""
    return str(uuid.uuid4())

class PersonalInfoResponse(BaseModel):
    """Personal and contact details shown in the resume header."""
    model_config = ConfigDict(populate_by_name=True)

    full_name: Optional[str] = Field(default=None, alias="fullName")
    linkedin_url: Optional[str] = Field(default=None, alias="linkedinUrl")
    portfolio_url: Optional[str] = Field(default=None, alias="portfolioUrl")
    phone: Optional[str] = Field(default=None, alias="phone")
    city: Optional[str] = Field(default=None, alias="city")
    country: Optional[str] = Field(default=None, alias="country")
    email: Optional[str] = Field(default=None, alias="email")

class SkillCategoryResponse(BaseModel):
    """One skills grouping under Skills & Technologies."""
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(default_factory=generate_uuid, alias="id")
    category_name: Optional[str] = Field(default=None, alias="categoryName")
    skills: Optional[str] = Field(default=None, alias="skills")

class WorkEntryResponse(BaseModel):
    """A single employment row with role, company, dates, location, and bullet accomplishments."""
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(default_factory=generate_uuid, alias="id")
    job_title: Optional[str] = Field(default=None, alias="jobTitle")
    company_name: Optional[str] = Field(default=None, alias="companyName")
    start_date: Optional[str] = Field(default=None, alias="startDate")
    end_date: Optional[str] = Field(default=None, alias="endDate")
    is_current: Optional[bool] = Field(default=None, alias="isCurrent")
    location: Optional[str] = Field(default=None, alias="location")
    bullet_points: Optional[list[str]] = Field(default=None, alias="bulletPoints")

class EducationEntryResponse(BaseModel):
    """One education line (degree, field, school, place, and year range)."""
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(default_factory=generate_uuid, alias="id")
    degree_type: Optional[str] = Field(default=None, alias="degreeType")
    field_of_study: Optional[str] = Field(default=None, alias="fieldOfStudy")
    institution: Optional[str] = Field(default=None, alias="institution")
    location: Optional[str] = Field(default=None, alias="location")
    start_year: Optional[str] = Field(default=None, alias="startYear")
    end_year: Optional[str] = Field(default=None, alias="endYear")

class ProjectEntryResponse(BaseModel):
    """Optional projects / extra section entry."""
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(default_factory=generate_uuid, alias="id")
    project_title: Optional[str] = Field(default=None, alias="projectTitle")
    synopsis: Optional[str] = Field(default=None, alias="synopsis")
    date: Optional[str] = Field(default=None, alias="date")

class LanguageEntryResponse(BaseModel):
    """One spoken language line with a proficiency label and optional CEFR level."""
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(default_factory=generate_uuid, alias="id")
    language: Optional[str] = Field(default=None, alias="language")
    proficiency_label: Optional[str] = Field(default=None, alias="proficiencyLabel")
    cefr_level: Optional[str] = Field(default=None, alias="cefrLevel")

class CertEntryResponse(BaseModel):
    """A certification row."""
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(default_factory=generate_uuid, alias="id")
    cert_name: Optional[str] = Field(default=None, alias="certName")
    issuer: Optional[str] = Field(default=None, alias="issuer")
    date: Optional[str] = Field(default=None, alias="date")

class ResumeParseResponse(BaseModel):
    """Root response object for parsing a resume document."""
    model_config = ConfigDict(populate_by_name=True)

    personal_info: Optional[PersonalInfoResponse] = Field(default=None, alias="personalInfo")
    profile: Optional[Dict[str, Any]] = Field(default=None, alias="profile")
    skills: list[SkillCategoryResponse] = Field(default_factory=list, alias="skills")
    experience: list[WorkEntryResponse] = Field(default_factory=list, alias="experience")
    education: list[EducationEntryResponse] = Field(default_factory=list, alias="education")
    projects: list[ProjectEntryResponse] = Field(default_factory=list, alias="projects")
    languages: list[LanguageEntryResponse] = Field(default_factory=list, alias="languages")
    certifications: list[CertEntryResponse] = Field(default_factory=list, alias="certifications")
    parse_warnings: list[str] = Field(default_factory=list, alias="parseWarnings")

class KeywordScoreRequest(BaseModel):
    """Request model for scoring a resume against a job description."""
    model_config = ConfigDict(populate_by_name=True)

    resume_text: str = Field(..., alias="resumeText")
    job_description_id: str = Field(..., alias="jobDescriptionId")
    job_description: Optional[str] = Field(
        None,
        alias="jobDescription",
        description="Current JD text for keyword overlap and cache rehydration.",
    )

class KeywordScoreResponse(BaseModel):
    """Response model for keyword scoring."""
    model_config = ConfigDict(populate_by_name=True)

    score: float = Field(..., alias="score")
    job_description_id: str = Field(..., alias="jobDescriptionId")

class WordCloudRequest(BaseModel):
    """Request model for generating word cloud keywords from a job description."""
    model_config = ConfigDict(populate_by_name=True)

    job_description: str = Field(..., alias="jobDescription")


class KeywordItem(BaseModel):
    """One weighted keyword from the job description (frequency matches word cloud sizing)."""
    model_config = ConfigDict(populate_by_name=True)

    keyword: str
    frequency: int


class WordCloudResponse(BaseModel):
    """Word cloud PNG plus ranked keywords (same frequencies used for cloud font sizes)."""
    model_config = ConfigDict(populate_by_name=True)

    image: str = Field(..., alias="image")
    job_description_id: str = Field(..., alias="jobDescriptionId")
    keywords: list[KeywordItem] = Field(default_factory=list, alias="keywords")
