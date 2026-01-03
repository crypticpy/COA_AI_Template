# COA AI Template - Backend

FastAPI backend with Azure OpenAI integration for City of Austin AI applications.

## Quick Start

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
# Edit .env with your Azure OpenAI credentials

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app and endpoints
│   ├── openai_provider.py   # Azure OpenAI client configuration
│   └── ai_service.py        # AI service with retry logic
├── .env.example             # Environment variable template
├── requirements.txt         # Python dependencies
└── README.md
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/health` | GET | Basic health check |
| `/api/v1/health/ai` | GET | Azure OpenAI connectivity check |
| `/api/v1/me` | GET | Current user info (requires auth) |

## Azure OpenAI Setup

1. Create an Azure OpenAI resource in the Azure Portal
2. Deploy models in Azure OpenAI Studio:
   - Chat model (e.g., `gpt-4.1` or `gpt-4o`)
   - Mini chat model (e.g., `gpt-4.1-mini`)
   - Embedding model (`text-embedding-ada-002`)
3. Copy your endpoint and API key to `.env`
4. Set deployment names in `.env`

## Adding New Endpoints

1. Define Pydantic models for request/response
2. Add endpoint to `main.py`
3. Use AI service functions from `ai_service.py`

Example:
```python
from app.ai_service import chat_completion_json

class AnalyzeRequest(BaseModel):
    text: str

@app.post("/api/v1/analyze")
async def analyze(request: AnalyzeRequest, user: dict = Depends(require_auth)):
    messages = [
        {"role": "system", "content": "Analyze the following text..."},
        {"role": "user", "content": request.text},
    ]
    result = await chat_completion_json(messages)
    return result
```

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app
```

## Linting

```bash
# Check code style
ruff check .

# Auto-fix issues
ruff check . --fix
```
