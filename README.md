# COA AI Template

City of Austin AI Application Template - A complete starter kit for building AI-powered applications with Azure OpenAI.

## Features

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: FastAPI (Python) with Azure OpenAI integration
- **Design System**: City of Austin brand colors and styling
- **Infrastructure**: Azure Bicep templates for Container Apps
- **CI/CD**: GitHub Actions deployment pipeline
- **Docker**: Multi-stage builds for production

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker Desktop
- Azure CLI (for deployment)
- Azure OpenAI access

### 1. Clone and Setup

```bash
# Clone the template
git clone <your-repo-url>
cd COA_AI_Template

# Frontend setup
cd frontend
cp .env.example .env
npm install
npm run dev

# Backend setup (in another terminal)
cd backend
cp .env.example .env
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Configure Environment

Edit the `.env` files with your credentials:

**Frontend** (`frontend/.env`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000
```

**Backend** (`backend/.env`):
```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_CHAT=gpt-4.1
```

### 3. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Project Structure

```
COA_AI_Template/
├── frontend/           # React + Vite frontend
├── backend/            # FastAPI backend
├── infrastructure/     # Azure Bicep templates
├── docker/             # Docker configurations
├── scripts/            # Deployment scripts
├── .github/workflows/  # CI/CD pipelines
├── branding/           # COA logo assets
└── docs/               # Documentation
```

## Customization

### 1. Update Application Name

Search for `TODO` comments and update:
- `frontend/index.html` - Page title
- `frontend/src/components/Header.tsx` - App name in header
- `frontend/src/pages/Login.tsx` - Login page branding
- `infrastructure/main.bicep` - `baseName` parameter

### 2. Add New Pages

1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Add navigation item in `frontend/src/components/Header.tsx`

### 3. Add API Endpoints

1. Define Pydantic models in `backend/app/main.py`
2. Add endpoint functions
3. Use AI service functions from `backend/app/ai_service.py`

### 4. Customize Colors

Edit `frontend/tailwind.config.js` to modify the brand color palette.

## Deployment

### Azure Container Apps

1. **Create Azure resources**:
```bash
az group create --name rg-my-app-dev --location eastus

az deployment group create \
  --resource-group rg-my-app-dev \
  --template-file infrastructure/main.bicep \
  --parameters baseName=my-app environment=dev
```

2. **Configure secrets**:
```bash
az keyvault secret set \
  --vault-name kv-my-app-dev \
  --name azure-openai-api-key \
  --value "your-key"
```

3. **Deploy application**:
```bash
./scripts/deploy-azure.sh dev
```

See `docs/DEPLOYMENT.md` for detailed instructions.

## Development

### Frontend Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # Run ESLint
npm run test      # Run tests
```

### Backend Commands

```bash
uvicorn app.main:app --reload  # Dev server
pytest                          # Run tests
ruff check .                    # Lint code
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| UI Components | Radix UI, Lucide Icons |
| Backend | FastAPI, Pydantic |
| AI | Azure OpenAI (GPT-4, Embeddings) |
| Auth | Supabase |
| Infrastructure | Azure Container Apps, Bicep |
| CI/CD | GitHub Actions |

## License

Internal City of Austin use only.

## Support

Contact the Austin AI/ML team for support.
