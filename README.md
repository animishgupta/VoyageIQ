# VoyageIQ 🌍✈️

VoyageIQ is an AI-powered travel planner and route intelligence platform that helps you discover destinations, optimize routes, and generate complete travel itineraries using deep neural matching engines.

## 🗂️ Project Structure

This is a monorepo containing both the frontend user interface and the backend AI services.

- **/frontend**: A Next.js application built with React, Tailwind CSS, and Framer Motion. It handles the interactive user dashboard, onboarding flow, and dynamic travel recommendations.
- **/backend**: A Python-based backend that handles AI agent workflows (LangGraph), budget calculations, route mapping, and data processing.

## 🚀 Getting Started

### Prerequisites
- **Node.js** (for running the frontend)
- **Python 3.10+** (for running the backend)

### Frontend Setup
1. Navigate into the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at http://localhost:3000*

### Backend Setup
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

## 🛠️ Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, TypeScript
- **Backend:** Python, FastAPI, LangGraph
- **Features:** AI Route Intelligence, Dynamic Budget Calculators, Crowd Prediction
