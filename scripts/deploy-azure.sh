#!/bin/bash
# ============================================================================
# COA AI Template - Azure Deployment Script
# ============================================================================
# Usage: ./scripts/deploy-azure.sh [environment]
# Arguments: environment - dev, staging, or production (default: dev)
# ============================================================================

set -e
set -o pipefail

# Configuration
ENVIRONMENT="${1:-dev}"

# Validate environment
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo "Error: Environment must be 'dev', 'staging', or 'production'"
    exit 1
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# TODO: Update these for your application
ACR_NAME="coaaiappacr"
IMAGE_NAME="coa-ai-app"
RESOURCE_GROUP="rg-coa-ai-${ENVIRONMENT}"

# Image tag
if git rev-parse --git-dir > /dev/null 2>&1; then
    GIT_SHA=$(git rev-parse --short HEAD)
    IMAGE_TAG="${ENVIRONMENT}-${GIT_SHA}"
else
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    IMAGE_TAG="${ENVIRONMENT}-${TIMESTAMP}"
fi

FULL_IMAGE_NAME="${ACR_NAME}.azurecr.io/${IMAGE_NAME}:${IMAGE_TAG}"

print_header() {
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================================${NC}"
}

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

# Preflight checks
print_header "Preflight Checks"

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed"
    exit 1
fi
print_success "Docker is installed"

if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running"
    exit 1
fi
print_success "Docker is running"

if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed"
    exit 1
fi
print_success "Azure CLI is installed"

if ! az account show > /dev/null 2>&1; then
    print_error "Not logged in to Azure. Run: az login"
    exit 1
fi
print_success "Authenticated to Azure"

# Confirmation
print_header "Deployment Configuration"
echo "Environment:    $ENVIRONMENT"
echo "Resource Group: $RESOURCE_GROUP"
echo "Image Tag:      $IMAGE_TAG"
echo "Full Image:     $FULL_IMAGE_NAME"
echo ""

read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled"
    exit 0
fi

# Build
print_header "Building Docker Image"
docker buildx build \
    --platform linux/amd64 \
    -t "${FULL_IMAGE_NAME}" \
    -f docker/Dockerfile \
    .
print_success "Docker image built"

# Push to ACR
print_header "Pushing to Azure Container Registry"
az acr login --name "${ACR_NAME}"
docker push "${FULL_IMAGE_NAME}"
print_success "Image pushed to ACR"

# Deploy
print_header "Deploying to Azure Container Apps"
CONTAINER_APP_NAME="ca-coa-ai-${ENVIRONMENT}"
az containerapp update \
    --name "${CONTAINER_APP_NAME}" \
    --resource-group "${RESOURCE_GROUP}" \
    --image "${FULL_IMAGE_NAME}"
print_success "Container app updated"

# Get URL
APP_URL=$(az containerapp show \
    --name "${CONTAINER_APP_NAME}" \
    --resource-group "${RESOURCE_GROUP}" \
    --query properties.configuration.ingress.fqdn \
    --output tsv)

print_header "Deployment Complete"
echo -e "${GREEN}✓ Successfully deployed!${NC}"
echo ""
echo "Application URL: https://${APP_URL}"
echo ""
print_success "Done!"
