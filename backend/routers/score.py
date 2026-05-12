import logging
from fastapi import APIRouter, HTTPException
from backend.services import wordcloud_gen, scorer
from backend.models.schemas import (
    WordCloudRequest,
    WordCloudResponse,
    KeywordScoreRequest,
    KeywordScoreResponse
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix='/api', tags=['scoring'])

@router.post("/word-cloud", response_model=WordCloudResponse)
async def generate_word_cloud(request: WordCloudRequest):
    try:
        # 1. Extract keywords for word cloud
        keywords = wordcloud_gen.extract_keywords(request.job_description)
        # 2. Embed and cache JD, retrieve UUID
        jd_id, _ = scorer.embed_job_description(request.job_description)
        return WordCloudResponse(keywords=keywords, jobDescriptionId=jd_id)
    except Exception as e:
        logger.exception("Failed to generate word cloud")
        raise HTTPException(status_code=500, detail="Unexpected failure generating word cloud.")

@router.post("/keyword-score", response_model=KeywordScoreResponse)
async def score_resume(request: KeywordScoreRequest):
    try:
        score = scorer.compute_score(request.resume_text, request.job_description_id)
        return KeywordScoreResponse(score=score, jobDescriptionId=request.job_description_id)
    except ValueError as ve:
        logger.warning(f"JD missing in cache: {ve}")
        raise HTTPException(status_code=404, detail="Job description expired. Please resubmit.")
    except Exception as e:
        logger.exception("Failed to compute score")
        raise HTTPException(status_code=500, detail="Unexpected failure computing score.")
