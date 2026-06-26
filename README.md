# SENTINEL AI — Industrial Safety Intelligence Platform

**ET AI Hackathon 2026 | Problem Statement 1: Zero-Harm Operations**

SENTINEL AI is a production-grade, AI-powered Industrial Safety Intelligence platform designed to prevent industrial fatalities by correlating disconnected IoT sensors, SCADA streams, Permit-to-Work (PTW) logs, and shift changeover schedules into a unified real-time compound risk layer.

---

## 🚀 Key Differentiators

- **Compound Risk Detection Engine**: Detects deadly multi-factor risk conditions (e.g., Confined Space entry + Gas accumulation + Shift changeover) before any single sensor breaches its isolated alarm threshold.
- **Digital Permit Intelligence**: AI evaluation of Permit-to-Work requests against live zone parameters and adjacent zone simultaneous operations. Cites OISD, Factory Act, and DGMS regulations.
- **Incident Pattern RAG**: Local ChromaDB vector store with sentence-transformers embedding 10 historical Indian industrial incident reports and regulatory standards for instant citation.
- **Emergency Orchestrator**: Automated 10-second response coordination drafting DGFASLI Form 18 preliminary incident reports and preserving sensor evidence.
- **Interactive Live Demo Mode**: Built-in interactive toggle to demonstrate real-time AI reasoning and risk buildup for live judges.

---

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite, Tailwind CSS v3, Zustand, D3.js, Recharts, Framer Motion
- **Backend**: FastAPI (Python 3.11), LangGraph 0.2.x multi-agent supervisor workflow, Google Gemini 2.0 Flash
- **Database & RAG**: SQLite (SQLAlchemy ORM), ChromaDB local vector store, `sentence-transformers` (`all-MiniLM-L6-v2`)
- **Real-Time Push**: Python `asyncio` WebSockets

---

## 🏁 Quickstart (Docker Compose)

1. Copy `.env.example` to `.env` and insert your `GEMINI_API_KEY`:
   ```bash
   cp .env.example .env
   ```
2. Start the entire platform with a single command:
   ```bash
   docker-compose up --build
   ```
3. Open the command center:
   - Frontend Command Center: `http://localhost:3000`
   - Backend API Docs (Swagger): `http://localhost:8000/docs`

---

## 📋 5-Minute Demo Script

1. **Minute 1 (Dashboard)**: Observe normal operations across 12 live IoT sensors across 6 zones of *Pradhan Integrated Steel Works*.
2. **Minute 2 (Pre-Incident Simulation)**: Click the floating **"Demo Mode"** toggle button to switch to `PRE_INCIDENT` mode. Watch H2S and CO levels rise gradually in Coke Oven Battery #1.
3. **Minute 3 (Plant Safety Map)**: Navigate to `/map` to view the D3 SVG heatmap dynamic zone hazard gradient and gas cloud overlay.
4. **Minute 4 (Permit Intelligence)**: Navigate to `/permits` and attempt to submit a Confined Space entry permit. Watch the AI Agent return an instant **DENY** citing *OISD-STD-105 Clause 6.3*.
5. **Minute 5 (Emergency & RAG)**: Watch the Emergency Orchestrator auto-trigger at >0.85 risk score. Navigate to `/intelligence` and ask *"What caused the Vizag Steel explosion?"* for verified RAG citations.
