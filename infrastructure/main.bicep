// ============================================================================
// COA AI Template - Azure Infrastructure
// ============================================================================
// Main Bicep deployment template for Azure Container Apps
//
// Resources deployed:
// - Azure Container Registry (ACR)
// - Container Apps Environment
// - Container App
// - Key Vault (optional)
// - Log Analytics Workspace
//
// Usage:
//   az deployment group create \
//     --resource-group YOUR_RESOURCE_GROUP \
//     --template-file main.bicep \
//     --parameters baseName=your-app environment=dev
// ============================================================================

@description('Environment name (dev, staging, prod)')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Base name for all resources - TODO: Change this for your application')
@minLength(3)
@maxLength(20)
param baseName string = 'coa-ai-app'

@description('Container image tag to deploy')
param imageTag string = 'latest'

@description('Enable Key Vault integration')
param enableKeyVault bool = true

@description('Azure OpenAI endpoint URL')
@secure()
param azureOpenAIEndpoint string = ''

@description('Azure OpenAI API key')
@secure()
param azureOpenAIApiKey string = ''

@description('Azure OpenAI API version')
param azureOpenAIApiVersion string = '2024-12-01-preview'

@description('Azure OpenAI chat deployment name')
param azureOpenAIChatDeployment string = 'gpt-4.1'

@description('Tags to apply to all resources')
param tags object = {
  project: baseName
  environment: environment
  managedBy: 'bicep'
}

@description('CORS allowed origins')
param corsAllowedOrigins array = []

@description('External ingress (public access)')
param externalIngress bool = true

// ============================================================================
// Variables
// ============================================================================

var acrName = replace('acr${baseName}${environment}', '-', '')
var envSuffix = environment == 'staging' ? 'stg' : environment == 'prod' ? 'prd' : 'dev'
var keyVaultName = 'kv-${take(baseName, 15)}-${envSuffix}'
var containerAppEnvName = 'cae-${baseName}-${environment}'
var containerAppName = 'ca-${baseName}-${environment}'
var logAnalyticsName = 'log-${baseName}-${environment}'

// ============================================================================
// Log Analytics Workspace
// ============================================================================

module logAnalytics 'modules/log-analytics.bicep' = {
  name: 'logAnalytics'
  params: {
    name: logAnalyticsName
    location: location
    tags: tags
  }
}

// ============================================================================
// Container Registry
// ============================================================================

module acr 'modules/container-registry.bicep' = {
  name: 'containerRegistry'
  params: {
    name: acrName
    location: location
    tags: tags
    sku: environment == 'prod' ? 'Standard' : 'Basic'
  }
}

// ============================================================================
// Key Vault (Optional)
// ============================================================================

module keyVault 'modules/key-vault.bicep' = if (enableKeyVault) {
  name: 'keyVault'
  params: {
    name: keyVaultName
    location: location
    tags: tags
  }
}

// ============================================================================
// Container Apps Environment
// ============================================================================

module containerAppEnv 'modules/container-app-environment.bicep' = {
  name: 'containerAppEnvironment'
  params: {
    name: containerAppEnvName
    location: location
    tags: tags
    logAnalyticsWorkspaceId: logAnalytics.outputs.workspaceId
    logAnalyticsWorkspaceKey: logAnalytics.outputs.workspaceKey
  }
}

// ============================================================================
// Container App
// ============================================================================

module containerApp 'modules/container-app.bicep' = {
  name: 'containerApp'
  params: {
    name: containerAppName
    location: location
    tags: tags
    containerAppEnvironmentId: containerAppEnv.outputs.environmentId
    containerRegistryName: acr.outputs.registryName
    containerRegistryLoginServer: acr.outputs.loginServer
    imageTag: imageTag
    keyVaultUri: enableKeyVault ? keyVault.outputs.vaultUri : ''
    externalIngress: externalIngress

    environmentVariables: [
      {
        name: 'NODE_ENV'
        value: 'production'
      }
      {
        name: 'AZURE_OPENAI_API_VERSION'
        value: azureOpenAIApiVersion
      }
      {
        name: 'AZURE_OPENAI_DEPLOYMENT_CHAT'
        value: azureOpenAIChatDeployment
      }
    ]

    secrets: enableKeyVault ? [
      {
        name: 'azure-openai-api-key'
        keyVaultUrl: '${keyVault.outputs.vaultUri}secrets/azure-openai-api-key'
        identity: 'system'
      }
      {
        name: 'azure-openai-endpoint'
        keyVaultUrl: '${keyVault.outputs.vaultUri}secrets/azure-openai-endpoint'
        identity: 'system'
      }
    ] : [
      {
        name: 'azure-openai-api-key'
        value: azureOpenAIApiKey
      }
      {
        name: 'azure-openai-endpoint'
        value: azureOpenAIEndpoint
      }
    ]

    secretEnvironmentVariables: [
      {
        name: 'AZURE_OPENAI_KEY'
        secretRef: 'azure-openai-api-key'
      }
      {
        name: 'AZURE_OPENAI_ENDPOINT'
        secretRef: 'azure-openai-endpoint'
      }
    ]

    corsAllowedOrigins: corsAllowedOrigins
  }
}

// ============================================================================
// Outputs
// ============================================================================

output resourceGroupName string = resourceGroup().name
output containerRegistryName string = acr.outputs.registryName
output containerRegistryLoginServer string = acr.outputs.loginServer
output containerAppName string = containerAppName
output containerAppFqdn string = containerApp.outputs.fqdn
output containerAppUrl string = 'https://${containerApp.outputs.fqdn}'
output keyVaultUri string = enableKeyVault ? keyVault.outputs.vaultUri : ''
