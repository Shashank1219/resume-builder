import logging
from fastapi import APIRouter, HTTPException
from backend.services import wordcloud_gen, scorer
from backend.models.schemas import (
    WordCloudRequest,
    WordCloudResponse,
    KeywordScoreRequest,
    KeywordScoreResponse,
    KeywordItem,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix='/api', tags=['scoring'])

@router.post("/word-cloud", response_model=WordCloudResponse)
async def generate_word_cloud(request: WordCloudRequest):
    try:
        jd = (request.job_description or "").strip()
        if not jd:
            raise ValueError("Job description is empty.")
        image_b64, keyword_pairs = wordcloud_gen.generate_image_with_keywords(jd)
        jd_id, _ = scorer.embed_job_description(jd)
        keywords = [KeywordItem(keyword=k, frequency=f) for k, f in keyword_pairs]
        return WordCloudResponse(image=image_b64, jobDescriptionId=jd_id, keywords=keywords)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.exception("Failed to generate word cloud")
        raise HTTPException(
            status_code=500,
            detail=(
                "Word cloud or scoring prep failed. "
                "Install backend deps from resume-builder/backend/requirements.txt "
                "and ensure the API can load sentence-transformers and (optionally) "
                "spaCy model en_core_web_sm. "
                f"Details: {str(e)[:400]}"
            ),
        )

@router.post("/keyword-score", response_model=KeywordScoreResponse)
async def score_resume(request: KeywordScoreRequest):
    try:
        score = scorer.compute_score(
            request.resume_text,
            request.job_description_id,
            request.job_description,
        )
        return KeywordScoreResponse(score=score, jobDescriptionId=request.job_description_id)
    except ValueError as ve:
        logger.warning(f"JD missing in cache: {ve}")
        raise HTTPException(status_code=404, detail="Job description expired. Please resubmit.")
    except Exception as e:
        logger.exception("Failed to compute score")
        raise HTTPException(status_code=500, detail="Unexpected failure computing score.")
