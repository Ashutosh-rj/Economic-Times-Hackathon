import os
from typing import List, Dict, Any
from rag.document_loader import load_all_incident_documents, chunk_text
from config import settings

class IncidentVectorStore:
    def __init__(self):
        self.collection = None
        self.embedder = None
        self.in_memory_chunks: List[Dict[str, Any]] = []

    def init_store(self):
        docs = load_all_incident_documents("./rag/incident_corpus")
        if not docs:
            docs = load_all_incident_documents("./backend/rag/incident_corpus")

        # Prepare chunks
        chunk_list = []
        chunk_id = 0
        for d in docs:
            src = d["source"]
            txt = d["content"]
            subchunks = chunk_text(txt, chunk_size=100, overlap=15)
            for sc in subchunks:
                chunk_list.append({
                    "id": f"doc_{chunk_id}",
                    "source": src,
                    "text": sc
                })
                chunk_id += 1

        self.in_memory_chunks = chunk_list

        try:
            import chromadb
            from sentence_transformers import SentenceTransformer
            
            client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
            self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
            self.collection = client.get_or_create_collection(name="sentinel_incident_corpus")
            
            if self.collection.count() == 0 and chunk_list:
                texts = [c["text"] for c in chunk_list]
                ids = [c["id"] for c in chunk_list]
                metadatas = [{"source": c["source"]} for c in chunk_list]
                embeddings = self.embedder.encode(texts).tolist()
                self.collection.add(
                    documents=texts,
                    embeddings=embeddings,
                    metadatas=metadatas,
                    ids=ids
                )
        except Exception as e:
            print(f"Notice: ChromaDB/SentenceTransformers fallback enabled ({e}). Using in-memory BM25/keyword retrieval.")

    def query(self, query_text: str, top_k: int = 5) -> List[Dict[str, Any]]:
        if self.collection and self.embedder:
            try:
                q_emb = self.embedder.encode(query_text).tolist()
                res = self.collection.query(
                    query_embeddings=[q_emb],
                    n_results=min(top_k, self.collection.count()),
                    include=["documents", "metadatas", "distances"]
                )
                results = []
                docs = res["documents"][0]
                metas = res["metadatas"][0]
                dists = res["distances"][0]
                for doc_t, meta, dist in zip(docs, metas, dists):
                    results.append({
                        "text": doc_t,
                        "source": meta["source"],
                        "relevance": round(max(0.1, 1.0 - dist), 2)
                    })
                return results
            except Exception as e:
                print(f"Query vector error: {e}")

        # Fallback keyword scoring
        query_words = set(query_text.lower().split())
        scored = []
        for ch in self.in_memory_chunks:
            txt_lower = ch["text"].lower()
            score = sum(1.0 for w in query_words if w in txt_lower)
            if "vizag" in query_text.lower() and "vizag" in ch["source"].lower():
                score += 5.0
            elif "oisd" in query_text.lower() and "oisd" in ch["source"].lower():
                score += 4.0
            elif "factory" in query_text.lower() and "factory" in ch["source"].lower():
                score += 4.0
            scored.append((score, ch))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        top = scored[:top_k]
        results = []
        for s, ch in top:
            rel = min(0.98, max(0.45, (s * 0.15) + 0.35))
            results.append({
                "text": ch["text"],
                "source": ch["source"],
                "relevance": round(rel, 2)
            })
        return results

rag_store = IncidentVectorStore()
