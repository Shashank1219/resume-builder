import spacy
from collections import Counter
from backend.models.schemas import WordCloudKeyword

# Load spaCy ONCE at module level
nlp = spacy.load('en_core_web_sm')

# Custom stop list provided in requirements
CUSTOM_STOP_WORDS = {
    'experience', 'role', 'team', 'company', 'responsibilities', 
    'requirements', 'qualifications', 'candidate', 'position', 
    'ability', 'work', 'job', 'year', 'years', 'including', 
    'knowledge', 'skills', 'strong', 'working', 'will'
}

# Simple heuristic matching for tech categories
TECH_PATTERNS = {
    'python', 'sql', 'aws', 'docker', 'api', 'data', 'cloud', 
    'react', 'kubernetes', 'java', 'javascript', 'typescript', 
    'node', 'c++', 'c#', 'linux', 'azure', 'gcp', 'git', 'ci/cd',
    'machine learning', 'ai', 'ml', 'go', 'ruby', 'php', 'html', 'css',
    'framework', 'software', 'engineering', 'backend', 'frontend', 'db'
}

def extract_keywords(jd_text: str) -> list[WordCloudKeyword]:
    """
    Process a Job Description text through spaCy to extract, filter, 
    categorize, and rank the top 40 keywords for a word cloud.
    """
    doc = nlp(jd_text)
    
    raw_keywords = []
    
    # 1. Extract named entities (ORG, PRODUCT)
    for ent in doc.ents:
        if ent.label_ in ('ORG', 'PRODUCT'):
            raw_keywords.append(ent.text.lower())
            
    # 2. Extract noun chunks
    for chunk in doc.noun_chunks:
        raw_keywords.append(chunk.root.text.lower())
        
    # 3. Extract NOUN/PROPN tokens
    for token in doc:
        if token.pos_ in ('NOUN', 'PROPN'):
            raw_keywords.append(token.text.lower())
            
    # 4. Filter, Lowercase, and Count
    cleaned_keywords = []
    for kw in raw_keywords:
        kw = kw.strip('.,;:-()[]{}!?"\' \n\t')
        
        # Filter out: len < 2, custom stop list, and standard spaCy stop words
        if len(kw) < 2:
            continue
        if kw in CUSTOM_STOP_WORDS or kw in nlp.Defaults.stop_words:
            continue
            
        cleaned_keywords.append(kw)
        
    counts = Counter(cleaned_keywords)
    
    # 5. Sort by value desc, limit to top 40
    top_40 = counts.most_common(40)
    
    results = []
    for word, count in top_40:
        # Categorize: if matches tech patterns -> 'technical', else 'soft_skill'
        is_tech = any(tech in word.split() for tech in TECH_PATTERNS)
        category = 'technical' if is_tech else 'soft_skill'
        
        results.append(WordCloudKeyword(
            text=word,
            value=float(count),
            category=category
        ))
        
    return results
