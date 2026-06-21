# VoyageIQ - Backend

This is a production-ready, modular FastAPI backend structure configured with SQLAlchemy 2.0 (asynchronous), JWT Authentication, PostgreSQL database connection, CORS configuration, and custom Agent patterns.

## Project Structure

```text
voyageiq/
├── .env                  # Local environment configurations (ignored by git)
├── .env.example          # Environment configuration template
├── requirements.txt      # Python dependencies
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI entrypoint, middleware, and router aggregator
│   ├── config.py         # Type-safe environment settings using pydantic-settings
│   ├── database/
│   │   ├── __init__.py
│   │   ├── base_class.py # SQLAlchemy DeclarativeBase
│   │   └── session.py    # Database async engine & Session sessionmaker generator
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py       # User database model mapping
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py       # Pydantic schemas for requests and responses (v2)
│   │   └── token.py      # Pydantic schemas for JWT access tokens
│   ├── utils/
│   │   ├── __init__.py
│   │   └── security.py   # JWT encryption & password hashing helpers
│   ├── services/
│   │   ├── __init__.py
│   │   └── auth.py       # Auth logic (authenticate, register, security dependencies)
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py       # Login & Register route endpoints
│   │   └── users.py      # Profile retrieval & update endpoints (protected)
│   └── agents/
│       ├── __init__.py
│       └── base.py       # Abstract Base Agent class for custom AI graphs
```

## File Explanations

1. **`requirements.txt`**: Specifies version-pinned production libraries including `fastapi`, `uvicorn` (server), `sqlalchemy[asyncio]`, `asyncpg` (postgres async driver), and security tools (`python-jose`, `passlib`, `bcrypt`).
2. **`app/main.py`**: Initializes the FastAPI application, maps active CORS origins parsed from configuration, and structures all API routers under the `/api/v1` namespace.
3. **`app/config.py`**: Uses Pydantic to parse and cast configuration variables, handling CORS json lists and database URL formats safely.
4. **`app/database/base_class.py`**: Exports the SQLAlchemy 2.0 DeclarativeBase, automatically generating snake_case/lowercase table names for clean database mapping.
5. **`app/database/session.py`**: Sets up async database connection strings, configures connection pooling health pings, and defines `get_db` generator dependency.
6. **`app/models/user.py`**: The SQLAlchemy Database mapping object for user tables, utilizing typed Mapped parameters.
7. **`app/schemas/user.py`**: Contains Pydantic input validations for user updates and registration, alongside database attributes mapping responses (`UserResponse`).
8. **`app/schemas/token.py`**: Handles structures for JWT access tokens.
9. **`app/utils/security.py`**: Standardizes password hashing/verification (bcrypt wrapper) and JWT signature operations.
10. **`app/services/auth.py`**: Business logic layer that extracts active user entities, performs verification, and provides dependency injectors like `get_current_user`.
11. **`app/routes/auth.py`**: API endpoints exposing login token retrieval and signup registration.
12. **`app/routes/users.py`**: Exposes `/me` and `/` endpoints to fetch active profiles and list users (secured via JWT auth).
13. **`app/agents/base.py`**: Modular template to build custom AI agent graphs (VoyageIQ specific pattern).

---

## Setup and Installation

### 1. Virtual Environment Setup
Ensure Python 3.10+ is installed on your system. Run these commands from the root directory:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and configure your database credentials and secret key:
```bash
cp .env.example .env
```
Generate a strong secret key using:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 3. Run Database Migrations or Start Server
Once PostgreSQL is running, start the FastAPI server:
```bash
uvicorn app.main:app --reload
```
Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser to view the interactive Swagger API documentation.
