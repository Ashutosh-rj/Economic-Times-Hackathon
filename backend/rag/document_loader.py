import os
from typing import List, Dict

def load_all_incident_documents(corpus_dir: str = "./rag/incident_corpus") -> List[Dict[str, str]]:
    docs = []
    if not os.path.exists(corpus_dir):
        # Fallback if running from root
        corpus_dir = "./backend/rag/incident_corpus"
        if not os.path.exists(corpus_dir):
            return docs

    for fname in os.listdir(corpus_dir):
        if fname.endswith(".txt"):
            fpath = os.path.join(corpus_dir, fname)
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
            docs.append({
                "source": fname,
                "content": content
            })
    return docs

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    words = text.split()
    chunks = []
    if not words:
        return chunks
    i = 0
    while i < len(words):
        chunk_words = words[i : i + chunk_size]
        chunks.append(" ".join(chunk_words))
        i += (chunk_size - overlap)
    return chunks
