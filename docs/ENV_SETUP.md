# Environment Setup Guide

Complete guide to configuring environment variables for the COA AI Template.

## Frontend Configuration

Create `frontend/.env` from the template:

```bash
cp frontend/.env.example frontend/.env
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | `eyJhbGc...` |
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create one)
3. Go to Settings > API
4. Copy the "Project URL" → `VITE_SUPABASE_URL`
5. Copy the "anon public" key → `VITE_SUPABASE_ANON_KEY`

## Backend Configuration

Create `backend/.env` from the template:

```bash
cp backend/.env.example backend/.env
```

### Azure OpenAI Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint | `https://xxx.openai.azure.com` |
| `AZURE_OPENAI_KEY` | Azure OpenAI API key | `abc123...` |
| `AZURE_OPENAI_API_VERSION` | API version | `2024-12-01-preview` |
| `AZURE_OPENAI_DEPLOYMENT_CHAT` | Chat model deployment | `gpt-4.1` |
| `AZURE_OPENAI_DEPLOYMENT_CHAT_MINI` | Mini model deployment | `gpt-4.1-mini` |
| `AZURE_OPENAI_DEPLOYMENT_EMBEDDING` | Embedding deployment | `text-embedding-ada-002` |

### Getting Azure OpenAI Credentials

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Azure OpenAI resource
3. Go to "Keys and Endpoint"
4. Copy "Endpoint" → `AZURE_OPENAI_ENDPOINT`
5. Copy "Key 1" or "Key 2" → `AZURE_OPENAI_KEY`

### Creating Deployments

In Azure OpenAI Studio:

1. Go to Deployments
2. Create deployment for each model:
   - **Chat**: `gpt-4o` or `gpt-4` → name it `gpt-4.1`
   - **Mini**: `gpt-4o-mini` → name it `gpt-4.1-mini`
   - **Embedding**: `text-embedding-ada-002`

### Supabase Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Same as frontend |
| `SUPABASE_KEY` | Same as frontend anon key |
| `SUPABASE_SERVICE_KEY` | Service role key (for admin operations) |

### Application Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ENVIRONMENT` | Environment name | `development` |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `8000` |
| `CORS_ORIGINS` | Allowed origins | `http://localhost:5173` |

## Production Configuration

For production, use Azure Key Vault instead of `.env` files:

```bash
# Add secrets to Key Vault
az keyvault secret set \
  --vault-name your-vault \
  --name azure-openai-api-key \
  --value "your-key"

az keyvault secret set \
  --vault-name your-vault \
  --name azure-openai-endpoint \
  --value "https://your-resource.openai.azure.com"
```

The Bicep templates automatically configure the Container App to pull secrets from Key Vault.

## Verifying Configuration

### Frontend

```bash
cd frontend
npm run dev
# Open http://localhost:5173
# Check browser console for errors
```

### Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Test health endpoint
curl http://localhost:8000/api/v1/health

# Test AI connectivity
curl http://localhost:8000/api/v1/health/ai
```

## Common Issues

### "Missing environment variable"

Ensure all required variables are set in your `.env` file.

### "Invalid endpoint" for Azure OpenAI

- Endpoint should NOT have trailing slash
- Should be `https://xxx.openai.azure.com` format

### "Deployment not found"

- Check deployment names match exactly
- Ensure deployments are in "Succeeded" state in Azure OpenAI Studio

### CORS errors

- Add your frontend URL to `CORS_ORIGINS`
- For local dev: `http://localhost:5173`
