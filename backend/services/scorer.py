import re
import uuid
from typing import Optional

import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from backend.services import wordcloud_gen

# Load model ONCE at module level
model = SentenceTransformer('all-MiniLM-L6-v2')

# Cache JD embeddings in-memory (same process as word-cloud / scoring).
_jd_cache: dict[str, np.ndarray] = {}
_jd_text_cache: dict[str, str] = {}


def _term_in_resume(term: str, resume_lower: str) -> bool:
    """Match JD keyword tokens without substring false positives (e.g. 'go' in 'google')."""
    t = (term or "").strip().lower()
    if len(t) < 2:
        return False
    if " " in t:
        return t in resume_lower
    return re.search(r"(?<![a-z0-9])" + re.escape(t) + r"(?![a-z0-9])", resume_lower) is not None


def _keyword_alignment_score(resume_text: str, jd_text: str) -> float:
    """
    0–100: weighted share of JD keyword mass (same weighting as word cloud) present in resume.
    """
    jd_text = (jd_text or "").strip()
    if not jd_text:
        return 0.0
    freqs = wordcloud_gen.build_keyword_frequencies(jd_text)
    if not freqs:
        return 0.0
    resume_lower = (resume_text or "").lower()
    total_weight = float(sum(freqs.values()))
    matched = 0.0
    for term, weight in freqs.items():
        if _term_in_resume(term, resume_lower):
            matched += float(weight)
    return 100.0 * min(1.0, matched / max(total_weight, 1.0))


def embed_job_description(jd_text: str) -> tuple[str, np.ndarray]:
    """
    Generate embedding for a Job Description, cache it by UUID, and return both.
    """
    jd_text = (jd_text or "").strip()
    embedding = model.encode([jd_text])[0]
    jd_id = str(uuid.uuid4())
    _jd_cache[jd_id] = embedding
    _jd_text_cache[jd_id] = jd_text
    return jd_id, embedding


def compute_score(
    resume_text: str,
    job_description_id: str,
    job_description: Optional[str] = None,
) -> float:
    """
    Hybrid match score: dense semantic similarity plus lexical alignment with JD keywords.

    Pure embedding similarity barely moves when a few JD terms are added to a long resume,
    and rounding can hide the change. Keyword overlap uses the same term weighting as the
    word cloud so adding high-frequency JD words to the resume increases the score predictably.

    Optional ``job_description`` rehydrates cache after server restart and refreshes the JD
    embedding when the client text differs from the cached snapshot.
    """
    incoming = (job_description or "").strip()
    cached_text = _jd_text_cache.get(job_description_id, "")

    if job_description_id not in _jd_cache:
        if not incoming:
            raise ValueError(f"Job description ID {job_description_id} not found in cache.")
        embedding = model.encode([incoming])[0]
        _jd_cache[job_description_id] = embedding
        _jd_text_cache[job_description_id] = incoming
    elif incoming and incoming != cached_text:
        embedding = model.encode([incoming])[0]
        _jd_cache[job_description_id] = embedding
        _jd_text_cache[job_description_id] = incoming

    jd_embedding = _jd_cache[job_description_id]
    jd_text = _jd_text_cache.get(job_description_id) or incoming

    resume_embedding = model.encode([resume_text])[0]
    jd_emb_2d = jd_embedding.reshape(1, -1)
    res_emb_2d = resume_embedding.reshape(1, -1)
    similarity = float(cosine_similarity(jd_emb_2d, res_emb_2d)[0][0])
    semantic = max(0.0, similarity) * 100.0

    if jd_text.strip():
        keyword = _keyword_alignment_score(resume_text, jd_text)
        combined = 0.5 * semantic + 0.5 * keyword
    else:
        combined = semantic

    return round(min(100.0, combined), 1)
