import uuid
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load model ONCE at module level
model = SentenceTransformer('all-MiniLM-L6-v2')

# Cache JD embeddings in-memory
_jd_cache: dict[str, np.ndarray] = {}

def embed_job_description(jd_text: str) -> tuple[str, np.ndarray]:
    """
    Generate embedding for a Job Description, cache it by UUID, and return both.
    """
    embedding = model.encode([jd_text])[0]
    jd_id = str(uuid.uuid4())
    _jd_cache[jd_id] = embedding
    return jd_id, embedding

def compute_score(resume_text: str, job_description_id: str) -> float:
    """
    Compute semantic similarity between a resume and a cached job description.
    Returns a score normalized between 0.0 and 100.0, rounded to 1 decimal place.
    """
    if job_description_id not in _jd_cache:
        raise ValueError(f"Job description ID {job_description_id} not found in cache.")
    
    jd_embedding = _jd_cache[job_description_id]
    resume_embedding = model.encode([resume_text])[0]
    
    # Reshape arrays for sklearn's cosine_similarity
    jd_emb_2d = jd_embedding.reshape(1, -1)
    res_emb_2d = resume_embedding.reshape(1, -1)
    
    similarity = cosine_similarity(jd_emb_2d, res_emb_2d)[0][0]
    
    # Normalize similarity (typically ranges from -1 to 1 for cosine similarity)
    # Clip at 0 and scale to 100
    score = float(max(0.0, similarity) * 100.0)
    return round(score, 1)
