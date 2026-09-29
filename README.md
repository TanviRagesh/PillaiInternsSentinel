# SENTINEL: Competitor Content Intelligence Platform

SENTINEL is a high-performance, real-time competitor content intelligence platform. It is designed to automatically monitor competitor blogs and websites, detect new content publications within minutes, and use AI to enrich and summarize the intelligence.

The system is built as a "Cyber Operations Dashboard", focusing on speed, reliability at scale, and actionable intelligence with strict < 5-minute detection SLAs.

## 🚀 Live Demo

**https://pillai-interns-sentinel.vercel.app/** 


Backend hosted at :
 *https://sentinel-backend-w88d.onrender.com*
---

## 🏗️ Architecture

SENTINEL is built with a modern, decoupled architecture:

*   **Frontend**: Next.js (React), Tailwind CSS, Framer Motion (for the Cyber Ops aesthetic).
*   **Backend**: Python, FastAPI, SQLModel (SQLAlchemy + Pydantic).
*   **Real-time Engine**: Server-Sent Events (SSE) for pushing live metrics without page refreshes.
*   **Background Workers**: APScheduler for decoupled, asynchronous web scraping and source polling.
*   **Database**: SQLite (Local Dev) / PostgreSQL (Production).

---

## 💻 How to Run Locally

To run SENTINEL on your local machine, you will need to start both the Frontend and the Backend servers.

### 1. Start the Backend (FastAPI + Workers)

The backend powers the database, the API endpoints, and the background monitoring engine.

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Activate the Python virtual environment:
   * **Windows:** `.\venv\Scripts\activate`
   * **Mac/Linux:** `source venv/bin/activate`
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(If `requirements.txt` is missing, install manually: `pip install fastapi uvicorn sqlmodel apscheduler sse-starlette feedparser beautifulsoup4 requests`)*
4. Run the Uvicorn server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend will now be running on `http://127.0.0.1:8000`.*

### 2. Start the Frontend (Next.js)

The frontend is the visual Command Center.

1. Open a **new, separate terminal** and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will now be running on `http://localhost:3000`.*

### 3. Access the Dashboard

Open your web browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🎯 Key Features

*   **Command Center:** Real-time visibility into active monitoring sources and system health.
*   **Automated Source Discovery:** When you add a competitor URL, SENTINEL automatically probes for `robots.txt`, `RSS/Atom` feeds, and `sitemap.xml` to recommend the best scraping strategy.
*   **Detections Feed:** A live feed of discovered articles with AI-enriched summaries and latency tracking.
*   **Scale Lab (Simulation):** An interactive 100-site concurrency visualization proving the architecture's fault tolerance (one broken target won't crash the worker pool).
*   **Demo Lab:** A dedicated presentation environment to trigger a test publication and watch the 3-step detection sequence in real-time.
