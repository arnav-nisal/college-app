# College App

Monorepo containing the mobile application frontend and the backend API service.

---

## 📁 Repository Structure

```
College_app/
├── backend/            # FastAPI backend service (Python + uv)
│   ├── main.py         # Application entry point
│   ├── pyproject.toml  # Python project dependencies
│   └── .env.example    # Backend environment variable template
├── frontend/           # Mobile application (React Native + Expo Router)
│   ├── src/
│   │   └── app/        # Expo Router file-based screens and layout
│   ├── package.json    # Frontend dependencies
│   └── .env.example    # Frontend environment variable template
├── .gitignore          # Repository-wide ignore rules (secrets, dependencies, logs)
└── README.md
```

---

## 🔒 Security & Sensitive Data Guidelines

To ensure secrets, credentials, and environment tokens are never committed:
- **Never commit `.env` files**: Keep secrets in `.env` or `.env.local` locally. Use `.env.example` as a template for team members without real values.
- **Never commit private keys, keystores, or credentials**: Files like `*.pem`, `*.jks`, `google-services.json`, `GoogleService-Info.plist`, or service account keys are ignored by `.gitignore`.
- If an API key or credential is ever accidentally exposed, revoke and rotate it immediately.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+) & **npm**
- **Python** (3.13+) or [**uv**](https://docs.astral.sh/uv/) for Python package management

---

### 2. Backend Setup (`/backend`)

1. Change directory to the backend:
   ```bash
   cd backend
   ```
2. Create your local environment configuration:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies using `uv` (or standard venv/pip):
   ```bash
   uv sync
   ```
4. Start the FastAPI development server:
   ```bash
   uv run fastapi dev main.py --port 8000
   ```
   The backend API will be available at `http://localhost:8000` with documentation at `http://localhost:8000/docs`.

---

### 3. Frontend Setup (`/frontend`)

1. Change directory to the frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your local environment configuration:
   ```bash
   cp .env.example .env.local
   ```
4. Start the Expo development server:
   ```bash
   npx expo start
   ```
   You can run the app using:
   - **`a`** - Android emulator
   - **`i`** - iOS simulator
   - **`w`** - Web browser
   - Scan the QR code with **Expo Go** on your physical device.

---

## 🔄 Git Sync

This repository is configured to sync with:
```
https://github.com/arnav-nisal/college-app.git
```
Branch: `main`
