# COA AI Template - Azure Infrastructure

Azure Bicep templates for deploying the COA AI application to Azure Container Apps.

## Resources Created

- **Azure Container Registry (ACR)** - Private Docker image registry
- **Container Apps Environment** - Managed environment for containerized apps
- **Container App** - The application itself with auto-scaling
- **Key Vault** - Secure secrets management (optional)
- **Log Analytics Workspace** - Centralized logging and monitoring

## Prerequisites

1. Azure CLI installed and authenticated (`az login`)
2. An Azure subscription with the following resource providers registered:
   - Microsoft.ContainerRegistry
   - Microsoft.App
   - Microsoft.KeyVault
   - Microsoft.OperationalInsights

## Quick Start

```bash
# Login to Azure
az login

# Create a resource group
az group create --name rg-coa-ai-dev --location eastus

# Deploy infrastructure
az deployment group create \
  --resource-group rg-coa-ai-dev \
  --template-file main.bicep \
  --parameters baseName=my-app environment=dev
```

## Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `baseName` | Base name for all resources | `coa-ai-app` |
| `environment` | Environment (dev/staging/prod) | `dev` |
| `location` | Azure region | Resource group location |
| `imageTag` | Container image tag | `latest` |
| `enableKeyVault` | Enable Key Vault | `true` |
| `externalIngress` | Public access | `true` |

## Resource Naming

Resources follow this naming convention:

| Resource | Pattern | Example |
|----------|---------|---------|
| Container Registry | `acr{baseName}{environment}` | `acrmyappdev` |
| Key Vault | `kv-{baseName}-{env}` | `kv-my-app-dev` |
| Container App Environment | `cae-{baseName}-{environment}` | `cae-my-app-dev` |
| Container App | `ca-{baseName}-{environment}` | `ca-my-app-dev` |
| Log Analytics | `log-{baseName}-{environment}` | `log-my-app-dev` |

## Configuring Secrets

After deployment, add secrets to Key Vault:

```bash
# Get Key Vault name from deployment output
VAULT_NAME="kv-my-app-dev"

# Add Azure OpenAI secrets
az keyvault secret set \
  --vault-name $VAULT_NAME \
  --name azure-openai-api-key \
  --value "your-api-key"

az keyvault secret set \
  --vault-name $VAULT_NAME \
  --name azure-openai-endpoint \
  --value "https://your-resource.openai.azure.com"
```

## Building and Deploying the Application

See the deployment scripts in the `scripts/` directory.

```bash
# Build and push image
./scripts/deploy-azure.sh dev
```

## Outputs

After deployment, you'll receive:

- `containerAppUrl` - Public URL for your application
- `containerRegistryLoginServer` - ACR login server for pushing images
- `keyVaultUri` - Key Vault URI for managing secrets
