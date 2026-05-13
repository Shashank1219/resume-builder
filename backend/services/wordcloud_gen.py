import base64
import io
import logging
import re
from collections import Counter

from wordcloud import WordCloud

logger = logging.getLogger(__name__)

# Lazy spaCy: optional — if missing or model not installed, we fall back to simple token counts.
_NOT_LOADED = object()
_nlp_instance: object = _NOT_LOADED

CUSTOM_STOP_WORDS = {
    "experience",
    "role",
    "team",
    "company",
    "responsibilities",
    "requirements",
    "qualifications",
    "candidate",
    "position",
    "ability",
    "work",
    "job",
    "year",
    "years",
    "including",
    "knowledge",
    "skills",
    "strong",
    "working",
    "will",
    "looking",
    "seeking",
    "opportunity",
    "environment",
    "based",
    "remote",
    "full",
    "time",
    "part",
    "the",
    "and",
    "for",
    "with",
    "this",
    "that",
    "from",
    "have",
    "has",
    "are",
    "our",
    "you",
    "your",
    "all",
    "any",
    "can",
    "may",
    "not",
    "but",
    "was",
    "were",
    "been",
    "being",
    "their",
    "they",
    "who",
    "what",
    "which",
    "while",
    "where",
    "when",
    "into",
    "onto",
    "also",
    "such",
    "other",
    "than",
    "then",
    "them",
    "these",
    "those",
    "each",
    "both",
    "some",
    "very",
    "more",
    "most",
    "many",
    "much",
    "well",
    "must",
    "should",
    "could",
    "would",
}


def _get_nlp():
    """Return loaded spaCy pipeline or None if spaCy / en_core_web_sm is unavailable."""
    global _nlp_instance
    if _nlp_instance is not _NOT_LOADED:
        return None if _nlp_instance is False else _nlp_instance
    try:
        import spacy

        nlp = spacy.load("en_core_web_sm")
        _nlp_instance = nlp
        logger.info("wordcloud: loaded spaCy model en_core_web_sm")
        return nlp
    except Exception as e:
        _nlp_instance = False
        logger.warning(
            "wordcloud: spaCy unavailable (%s). Using simple token extraction. "
            "For better keywords install: pip install spacy && python -m spacy download en_core_web_sm",
            e,
        )
        return None


def _clean_token(kw: str) -> str:
    return kw.strip(".,;:-()[]{}!?'\" \n\t").lower()


def _wordcloud_safe_keyword(kw: str) -> str:
    """
    WordCloud + Pillow cannot render frequency keys that contain embedded newlines
    (raises ValueError: anchor not supported for multiline text). Collapse all
    whitespace to a single space and trim punctuation edges.
    """
    if not kw:
        return ""
    t = str(kw).replace("\u00a0", " ").replace("\r", " ").replace("\n", " ")
    t = re.sub(r"\s+", " ", t, flags=re.UNICODE).strip()
    t = t.strip(".,;:-()[]{}!?'\"")
    return t.lower()


def _sanitize_frequency_keys(freq: dict[str, int]) -> dict[str, int]:
    """Merge counts under newline-normalized, single-line labels safe for WordCloud."""
    out: dict[str, int] = {}
    for raw_key, count in freq.items():
        key = _wordcloud_safe_keyword(raw_key)
        if len(key) < 2:
            continue
        out[key] = out.get(key, 0) + int(count)
    return out


def _collect_simple_terms(jd_text: str) -> list[str]:
    """Frequency-based tokens when spaCy is not installed (no linguistic labels)."""
    # Words / tech tokens: letters, digits inside (e.g. C++, .NET), hyphens
    raw = re.findall(r"[A-Za-z][A-Za-z0-9+.#@-]{1,}", jd_text)
    terms: list[str] = []
    for w in raw:
        t = _clean_token(w)
        if len(t) < 2:
            continue
        if t in CUSTOM_STOP_WORDS:
            continue
        terms.append(t)
    return terms


def _collect_weighted_terms(jd_text: str) -> list[str]:
    """Extract nouns, entities, and short phrases; entities doubled when spaCy is available."""
    nlp = _get_nlp()
    if nlp is None:
        return _collect_simple_terms(jd_text)

    doc = nlp(jd_text)
    terms: list[str] = []

    valuable_ent_labels = (
        "ORG",
        "PRODUCT",
        "GPE",
        "EVENT",
        "WORK_OF_ART",
        "NORP",
        "LANGUAGE",
        "FAC",
        "LOC",
    )
    stop = nlp.Defaults.stop_words
    for ent in doc.ents:
        if ent.label_ in valuable_ent_labels:
            t = _clean_token(ent.text)
            if 2 <= len(t) <= 80 and t not in CUSTOM_STOP_WORDS and t not in stop:
                terms.append(t)
                terms.append(t)

    for chunk in doc.noun_chunks:
        raw = chunk.text.strip()
        if len(raw) < 3 or len(chunk) > 6:
            continue
        t = _clean_token(raw)
        if len(t) < 3:
            continue
        if t in CUSTOM_STOP_WORDS or t in stop:
            continue
        terms.append(t)

    for token in doc:
        if token.is_stop or token.is_punct or not token.is_alpha:
            continue
        if token.pos_ in ("NOUN", "PROPN") and len(token.text) > 2:
            t = _clean_token(token.text)
            if t in CUSTOM_STOP_WORDS or t in stop:
                continue
            terms.append(t)

    return terms


def build_keyword_frequencies(jd_text: str) -> dict[str, int]:
    terms = _collect_weighted_terms(jd_text)
    nlp = _get_nlp()
    cleaned: list[str] = []
    for kw in terms:
        kw = _wordcloud_safe_keyword(_clean_token(kw))
        if len(kw) < 2:
            continue
        if nlp is not None and kw in nlp.Defaults.stop_words:
            continue
        if kw in CUSTOM_STOP_WORDS:
            continue
        cleaned.append(kw)

    counts = Counter(cleaned)
    if not counts:
        return {"keywords": 1}
    merged = _sanitize_frequency_keys(dict(counts.most_common(80)))
    if not merged:
        return {"keywords": 1}
    return dict(sorted(merged.items(), key=lambda x: -x[1])[:60])


def generate_image_with_keywords(jd_text: str) -> tuple[str, list[tuple[str, int]]]:
    """
    Build frequency-weighted word cloud (PNG base64) plus a sorted keyword list for the UI.
    Frequencies in the image match the keyword list (same Counter).
    """
    if not (jd_text or "").strip():
        raise ValueError("Job description is empty.")

    frequencies = build_keyword_frequencies(jd_text)
    if not frequencies:
        frequencies = {"keywords": 1}
    sorted_keywords = sorted(frequencies.items(), key=lambda x: (-x[1], x[0]))[:40]

    wc = WordCloud(
        width=800,
        height=380,
        background_color="white",
        colormap="Blues",
        max_words=50,
        prefer_horizontal=0.85,
        margin=4,
        min_font_size=10,
    ).generate_from_frequencies(frequencies)

    buf = io.BytesIO()
    wc.to_image().save(buf, format="PNG")
    buf.seek(0)
    image_b64 = base64.b64encode(buf.read()).decode("utf-8")
    return image_b64, sorted_keywords


def generate_image(jd_text: str) -> str:
    img, _ = generate_image_with_keywords(jd_text)
    return img
