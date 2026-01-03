# Getting Started Guide

Step-by-step instructions for using this template to build your own AI-powered application.

## Table of Contents

1. [Use This Template](#use-this-template)
2. [Initial Setup Checklist](#initial-setup-checklist)
3. [Customization Walkthrough](#customization-walkthrough)
4. [Example App Types](#example-app-types)
5. [Architecture Decisions](#architecture-decisions)

---

## Use This Template

### Option 1: GitHub Template (Recommended)

1. Click **"Use this template"** button on GitHub
2. Name your new repository
3. Clone your new repo locally
4. Follow the [Initial Setup Checklist](#initial-setup-checklist)

### Option 2: Manual Clone

```bash
# Clone the template
git clone https://github.com/crypticpy/COA_AI_Template.git my-new-app
cd my-new-app

# Remove original git history and start fresh
rm -rf .git
git init
git add -A
git commit -m "Initial commit from COA_AI_Template"

# Create your own repo
gh repo create my-new-app --source=. --push
```

---

## Initial Setup Checklist

Use this checklist when starting a new project from this template:

### 1. Rename Your Application

- [ ] `frontend/index.html` - Update `<title>` tag
- [ ] `frontend/src/components/Header.tsx` - Change app name in header
- [ ] `frontend/src/pages/Login.tsx` - Update login page title
- [ ] `frontend/src/pages/Dashboard.tsx` - Update welcome message
- [ ] `frontend/package.json` - Change `"name"` field
- [ ] `backend/app/__init__.py` - Update module docstring
- [ ] `infrastructure/main.bicep` - Change `baseName` default value
- [ ] `README.md` - Rewrite for your project
- [ ] `CLAUDE.md` - Update AI assistant context

### 2. Configure Authentication

- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Copy project URL and anon key to `frontend/.env`
- [ ] Set up authentication providers in Supabase dashboard
- [ ] (Optional) Configure Row Level Security policies

### 3. Configure Azure OpenAI

- [ ] Create Azure OpenAI resource in Azure Portal
- [ ] Deploy required models (chat, mini, embeddings)
- [ ] Copy endpoint and API key to `backend/.env`
- [ ] Update deployment names if different from defaults

### 4. Customize Branding (Optional)

- [ ] Replace `frontend/public/logo-horizontal.png`
- [ ] Replace `frontend/public/logo-icon.png`
- [ ] Update colors in `frontend/tailwind.config.js`
- [ ] Modify CSS variables in `frontend/src/index.css`

### 5. Set Up Infrastructure

- [ ] Update resource names in `infrastructure/main.bicep`
- [ ] Update ACR name in `scripts/deploy-azure.sh`
- [ ] Update ACR name in `.github/workflows/deploy-azure.yml`
- [ ] Configure GitHub secrets for CI/CD

---

## Customization Walkthrough

### Adding a New Page

1. **Create the page component:**

```tsx
// frontend/src/pages/MyNewPage.tsx
import React from 'react';

const MyNewPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-dark-blue dark:text-white">
        My New Page
      </h1>
      {/* Your content here */}
    </div>
  );
};

export default MyNewPage;
```

2. **Add the route in App.tsx:**

```tsx
// frontend/src/App.tsx
import { lazy } from 'react';

const MyNewPage = lazy(() => import('./pages/MyNewPage'));

// In the Routes section:
<Route
  path="/my-page"
  element={<ProtectedRoute element={<MyNewPage />} loadingMessage="Loading..." />}
/>
```

3. **Add navigation in Header.tsx:**

```tsx
// frontend/src/components/Header.tsx
import { FileText } from 'lucide-react'; // or any icon

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'My Page', href: '/my-page', icon: FileText }, // Add this
];
```

### Adding a New API Endpoint

1. **Define models:**

```python
# backend/app/main.py
from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    text: str
    options: dict = {}

class AnalyzeResponse(BaseModel):
    result: str
    confidence: float
```

2. **Create the endpoint:**

```python
# backend/app/main.py
from app.ai_service import chat_completion_json

@app.post("/api/v1/analyze", response_model=AnalyzeResponse)
async def analyze_text(
    request: AnalyzeRequest,
    user: dict = Depends(require_auth),
):
    """Analyze text using AI."""
    messages = [
        {"role": "system", "content": "Analyze the following text and provide insights."},
        {"role": "user", "content": request.text},
    ]
    
    result = await chat_completion_json(messages)
    return AnalyzeResponse(**result)
```

3. **Call from frontend:**

```typescript
// frontend/src/lib/api.ts
export async function analyzeText(text: string, token: string) {
  return apiRequest<{ result: string; confidence: number }>('/api/v1/analyze', {
    method: 'POST',
    body: { text },
    token,
  });
}
```

### Removing Supabase (Use Different Auth)

If you want to use a different authentication system:

1. **Remove Supabase dependency:**
```bash
cd frontend
npm uninstall @supabase/supabase-js
```

2. **Update App.tsx** - Replace Supabase auth with your provider:
```tsx
// Replace the Supabase client and auth logic with your auth provider
// Keep the AuthContextProvider pattern - just change the implementation
```

3. **Update backend authentication** in `backend/app/main.py`:
```python
# Replace the JWT validation logic with your auth system
async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Your auth validation here
    pass
```

---

## Example App Types

This template can be adapted for many AI-powered applications:

### 1. Document Analyzer

**Use case:** Upload documents, extract insights, summarize content

**Modifications needed:**
- Add file upload component
- Create `/api/v1/documents` endpoints
- Add document processing in `ai_service.py`
- Create Documents page with upload UI

### 2. Chatbot / Q&A System

**Use case:** Interactive chat interface with AI

**Modifications needed:**
- Add chat UI component with message history
- Create `/api/v1/chat` streaming endpoint
- Implement conversation memory
- Add chat page

### 3. Data Dashboard with AI Insights

**Use case:** Visualize data with AI-generated insights

**Modifications needed:**
- Add charting library (recharts, chart.js)
- Create data fetching endpoints
- Add insight generation in `ai_service.py`
- Build dashboard with cards and charts

### 4. Content Generator

**Use case:** Generate reports, emails, or other content

**Modifications needed:**
- Add rich text editor
- Create generation endpoints with templates
- Add export functionality (PDF, Word)
- Create generation wizard UI

### 5. Search & Discovery

**Use case:** Semantic search over documents or data

**Modifications needed:**
- Implement vector storage (pgvector, Pinecone)
- Add embedding generation pipeline
- Create search endpoints
- Build search UI with filters

---

## Architecture Decisions

### When to Use What

| Feature | When to Use | When to Skip |
|---------|-------------|--------------|
| **Supabase Auth** | Need quick auth setup, PostgreSQL database | Have existing auth, different DB needs |
| **Azure Container Apps** | Production deployment, auto-scaling | Local only, different cloud provider |
| **Key Vault** | Production secrets management | Development only |
| **Docker** | Consistent environments, deployment | Local development only |
| **GitHub Actions** | Automated CI/CD | Manual deployments preferred |

### Scaling Considerations

| App Size | Recommendations |
|----------|-----------------|
| **Prototype** | Skip Docker, use local dev servers, no infrastructure |
| **Small Team** | Use Docker Compose, single Container App instance |
| **Production** | Full infrastructure, multiple replicas, Key Vault |
| **Enterprise** | Add VNet integration, private endpoints, WAF |

### AI Model Selection

| Task | Recommended Model | Why |
|------|-------------------|-----|
| Complex analysis | `gpt-4.1` (chat deployment) | Best reasoning |
| Quick tasks | `gpt-4.1-mini` | Faster, cheaper |
| Embeddings | `text-embedding-ada-002` | Good balance |
| Large documents | Consider chunking | Token limits |

---

## Next Steps

1. Complete the [Initial Setup Checklist](#initial-setup-checklist)
2. Review [ENV_SETUP.md](./ENV_SETUP.md) for detailed configuration
3. Check [DEPLOYMENT.md](./DEPLOYMENT.md) when ready to deploy
4. Read [BRANDING.md](./BRANDING.md) for customization options

## Need Help?

- Check existing documentation in `/docs`
- Review code comments (search for `TODO:`)
- Contact the Austin AI/ML team
