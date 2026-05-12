import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.services import parser
from backend.models.schemas import ResumeParseResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix='/api', tags=['parse'])

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/parse-resume", response_model=ResumeParseResponse)
async def parse_resume_endpoint(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")
        
    content_type = file.content_type or ""
    filename = file.filename.lower()
    
    if not ("pdf" in content_type or "wordprocessingml" in content_type or "officedocument" in content_type or filename.endswith(".pdf") or filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a PDF or DOCX file.")
        
    try:
        # Check file size by reading into memory
        file_bytes = await file.read()
        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")
            
        # Reset file pointer so parser.py can read it again
        await file.seek(0)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking file size: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during file validation.")
        
    try:
        # The parser service handles its own try/except, but we wrap it here for safety
        result = await parser.parse_resume(file)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected failure in parse_resume_endpoint")
        raise HTTPException(status_code=500, detail="Unexpected failure parsing resume.")
