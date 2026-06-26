from fastapi import APIRouter
from models.incident_report import RAGQueryRequest
from agents.incident_rag_agent import query_incident_corpus

router = APIRouter(tags=["rag"])

@router.post("/query")
async def execute_rag_query(req: RAGQueryRequest):
    res = await query_incident_corpus(req.query, top_k=req.top_k)
    return res.model_dump()
