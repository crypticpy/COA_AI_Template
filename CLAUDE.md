# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

COA AI Template is a starter kit for building AI-powered applications for the City of Austin. It includes a React frontend, FastAPI backend, and Azure infrastructure-as-code.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: FastAPI (Python 3.11+) with Pydantic
- **AI**: Azure OpenAI (GPT-4, embeddings)
- **Auth**: Supabase Auth (JWT-based)
- **Infrastructure**: Azure Container Apps + Bicep

## Development Commands

### Frontend
```bash
cd frontend
npm install
npm run dev          # Development server (port 5173)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest
```

### Backend
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
pytest               # Run tests
ruff check .         # Lint
```

## Architecture

### Frontend (`frontend/src/`)
- `App.tsx` - Main app with routing and auth
- `components/` - Reusable UI components
- `components/ui/` - Base UI components (LoadingButton, Tooltip)
- `pages/` - Route components
- `hooks/` - React hooks (useAuthContext)
- `lib/` - Utilities and API client

### Backend (`backend/app/`)
- `main.py` - FastAPI app with endpoints
- `openai_provider.py` - Azure OpenAI client configuration
- `ai_service.py` - AI operations with retry logic

### Infrastructure (`infrastructure/`)
- `main.bicep` - Main deployment template
- `modules/` - Bicep modules for Azure resources

## Key Patterns

### Authentication
- Supabase JWT tokens in Authorization header
- Protected routes use `ProtectedRoute` component
- Backend validates tokens with `require_auth` dependency

### AI Operations
- Use `ai_service.py` functions with built-in retry
- `chat_completion()` for text generation
- `generate_embedding()` for embeddings
- `chat_completion_json()` for structured output

### Styling
- TailwindCSS with COA brand colors (`brand-blue`, `brand-green`, etc.)
- Dark mode support via CSS variables
- Component classes: `.card-hover`, `.glass-header`, `.btn-primary`

## Environment Variables

### Frontend (.env)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=http://localhost:8000
```

### Backend (.env)
```
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_KEY=
AZURE_OPENAI_DEPLOYMENT_CHAT=gpt-4.1
```

## Customization Points

Look for `TODO:` comments in the codebase for customization points:
- App name and branding
- Navigation items
- API endpoints
- AI prompts and schemas
- Infrastructure resource names
