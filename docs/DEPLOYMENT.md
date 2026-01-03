# Deployment Guide

Complete instructions for deploying the COA AI Template to Azure.

## Prerequisites

- Azure subscription
- Azure CLI installed and authenticated
- Docker Desktop
- GitHub repository (for CI/CD)

## Deployment Options

| Method | Best For | Complexity |
|--------|----------|------------|
| Docker Compose | Local testing | Low |
| Manual Script | One-off deployments | Medium |
| GitHub Actions | Production CI/CD | Medium |

## 1. Local Docker Testing

```bash
# Start services
docker-compose -f docker/docker-compose.yml up --build

# Access at http://localhost:3000
```

## 2. Azure Infrastructure Setup

### Create Resource Group

```bash
az group create \
  --name rg-coa-ai-dev \
  --location eastus
```

### Deploy Infrastructure

```bash
cd infrastructure

az deployment group create \
  --resource-group rg-coa-ai-dev \
  --template-file main.bicep \
  --parameters \
    baseName=my-app \
    environment=dev \
    externalIngress=true
```

### Configure Secrets

```bash
# Get Key Vault name from deployment outputs
VAULT_NAME="kv-my-app-dev"

# Add Azure OpenAI credentials
az keyvault secret set \
  --vault-name $VAULT_NAME \
  --name azure-openai-api-key \
  --value "your-api-key"

az keyvault secret set \
  --vault-name $VAULT_NAME \
  --name azure-openai-endpoint \
  --value "https://your-resource.openai.azure.com"
```

## 3. Build and Deploy Application

### Manual Deployment

```bash
# Build image for Azure (x86_64)
docker buildx build \
  --platform linux/amd64 \
  -t myacr.azurecr.io/coa-ai-app:v1.0.0 \
  -f docker/Dockerfile \
  .

# Login to ACR
az acr login --name myacr

# Push image
docker push myacr.azurecr.io/coa-ai-app:v1.0.0

# Update Container App
az containerapp update \
  --name ca-my-app-dev \
  --resource-group rg-coa-ai-dev \
  --image myacr.azurecr.io/coa-ai-app:v1.0.0
```

### Using Deploy Script

```bash
./scripts/deploy-azure.sh dev
```

## 4. GitHub Actions CI/CD

### Setup Secrets

Add these secrets to your GitHub repository:

| Secret | Description |
|--------|-------------|
| `AZURE_CREDENTIALS` | Service principal JSON |
| `AZURE_RESOURCE_GROUP_DEV` | Dev resource group name |
| `AZURE_RESOURCE_GROUP_PRODUCTION` | Prod resource group name |

### Create Service Principal

```bash
az ad sp create-for-rbac \
  --name "github-actions-coa-ai" \
  --role contributor \
  --scopes /subscriptions/YOUR_SUBSCRIPTION_ID \
  --sdk-auth
```

Copy the JSON output to `AZURE_CREDENTIALS` secret.

### Trigger Deployment

- Push to `develop` → Deploy to dev
- Push to `main` → Deploy to production
- Manual trigger via GitHub Actions UI

## 5. Verify Deployment

```bash
# Get application URL
APP_URL=$(az containerapp show \
  --name ca-my-app-dev \
  --resource-group rg-coa-ai-dev \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

# Health check
curl https://$APP_URL/api/v1/health

# AI health check
curl https://$APP_URL/api/v1/health/ai
```

## Troubleshooting

### Container App Not Starting

```bash
# View logs
az containerapp logs show \
  --name ca-my-app-dev \
  --resource-group rg-coa-ai-dev \
  --follow
```

### Image Pull Errors

Ensure the Container App has ACR pull permissions:
```bash
az role assignment create \
  --assignee <container-app-principal-id> \
  --role acrpull \
  --scope <acr-resource-id>
```

### Key Vault Access Errors

Ensure Container App has Key Vault Secrets User role:
```bash
az role assignment create \
  --assignee <container-app-principal-id> \
  --role "Key Vault Secrets User" \
  --scope <key-vault-resource-id>
```

## Resource Costs

Estimated monthly costs (dev environment):
- Container Apps (Consumption): ~$5-20
- Container Registry (Basic): ~$5
- Key Vault: ~$1
- Log Analytics: ~$2-10

Production costs will vary based on traffic and scaling configuration.
