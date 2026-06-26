import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine, Base
from rag.vector_store import rag_store
from core.sensor_simulator import sensor_simulator
from agents.orchestrator_graph import compiled_graph

from api import sensors, alerts, permits, rag, emergency, simulation, ws

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    print("Database tables verified.")
    
    rag_store.init_store()
    print("Incident RAG vector store loaded.")
    
    async def graph_callback(state_update):
        try:
            # Trigger LangGraph supervisor graph
            res = await compiled_graph.ainvoke(state_update)
            return res
        except Exception as e:
            print(f"Graph execution warning: {e}")
            
    sim_task = asyncio.create_task(sensor_simulator.start_loop(graph_callback))
    print("Real-time IoT simulation loop active.")
    
    yield
    
    # Shutdown
    sensor_simulator.running = False
    sim_task.cancel()

app = FastAPI(
    title="SENTINEL AI — Industrial Safety Intelligence Platform",
    description="Zero-Harm Operations Compound Risk Intelligence Platform (ET AI Hackathon 2026)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sensors.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(permits.router, prefix="/api")
app.include_router(rag.router, prefix="/api")
app.include_router(emergency.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")
app.include_router(ws.router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "uptime": "nominal",
        "simulation_mode": sensor_simulator.mode
    }
