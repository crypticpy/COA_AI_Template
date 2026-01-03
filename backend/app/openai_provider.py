"""
Azure OpenAI Provider for COA AI Template

Provides centralized Azure OpenAI client configuration with proper API versioning.

Environment Variables Required:
- AZURE_OPENAI_ENDPOINT: Azure OpenAI endpoint URL
- AZURE_OPENAI_KEY: Azure OpenAI API key
- AZURE_OPENAI_API_VERSION: API version for chat completions
- AZURE_OPENAI_EMBEDDING_API_VERSION: API version for embeddings
- AZURE_OPENAI_DEPLOYMENT_CHAT: Main chat model deployment name
- AZURE_OPENAI_DEPLOYMENT_CHAT_MINI: Fast/cheap chat model deployment name
- AZURE_OPENAI_DEPLOYMENT_EMBEDDING: Embedding model deployment name
"""

import os
import logging
from openai import AzureOpenAI, AsyncAzureOpenAI

logger = logging.getLogger(__name__)


def _get_required_env(name: str) -> str:
    """Get a required environment variable or raise an error."""
    value = os.getenv(name)
    if not value:
        raise ValueError(f"Missing required environment variable: {name}")
    return value


def _get_optional_env(name: str, default: str) -> str:
    """Get an optional environment variable with a default value."""
    return os.getenv(name, default)


class AzureOpenAIConfig:
    """Azure OpenAI configuration container."""

    def __init__(self):
        """Load configuration from environment variables."""
        self.endpoint = _get_required_env("AZURE_OPENAI_ENDPOINT")
        self.api_key = _get_required_env("AZURE_OPENAI_KEY")

        # API versions
        self.chat_api_version = _get_optional_env(
            "AZURE_OPENAI_API_VERSION", "2024-12-01-preview"
        )
        self.embedding_api_version = _get_optional_env(
            "AZURE_OPENAI_EMBEDDING_API_VERSION", "2023-05-15"
        )

        # Deployment names
        self.deployment_chat = _get_optional_env(
            "AZURE_OPENAI_DEPLOYMENT_CHAT", "gpt-4.1"
        )
        self.deployment_chat_mini = _get_optional_env(
            "AZURE_OPENAI_DEPLOYMENT_CHAT_MINI", "gpt-4.1-mini"
        )
        self.deployment_embedding = _get_optional_env(
            "AZURE_OPENAI_DEPLOYMENT_EMBEDDING", "text-embedding-ada-002"
        )

    def log_configuration(self):
        """Log current configuration (without sensitive data)."""
        logger.info("Azure OpenAI Configuration:")
        logger.info(f"  Endpoint: {self.endpoint}")
        logger.info(f"  Chat API Version: {self.chat_api_version}")
        logger.info(f"  Embedding API Version: {self.embedding_api_version}")
        logger.info(f"  Chat Deployment: {self.deployment_chat}")
        logger.info(f"  Chat Mini Deployment: {self.deployment_chat_mini}")
        logger.info(f"  Embedding Deployment: {self.deployment_embedding}")


# Model name to deployment mapping
_MODEL_TO_DEPLOYMENT: dict = {}


def _initialize_model_mapping(config: AzureOpenAIConfig):
    """Initialize model name to deployment name mapping."""
    global _MODEL_TO_DEPLOYMENT
    _MODEL_TO_DEPLOYMENT = {
        "gpt-4o": config.deployment_chat,
        "gpt-4o-mini": config.deployment_chat_mini,
        "gpt-4": config.deployment_chat,
        "text-embedding-ada-002": config.deployment_embedding,
        "text-embedding-3-small": config.deployment_embedding,
    }


def get_deployment_name(model_name: str) -> str:
    """Get Azure deployment name for an OpenAI model name."""
    if model_name in _MODEL_TO_DEPLOYMENT:
        return _MODEL_TO_DEPLOYMENT[model_name]
    if model_name in [_config.deployment_chat, _config.deployment_chat_mini, _config.deployment_embedding]:
        return model_name
    raise ValueError(f"Unknown model name: {model_name}")


def get_chat_deployment() -> str:
    """Get the main chat model deployment name."""
    return _config.deployment_chat


def get_chat_mini_deployment() -> str:
    """Get the fast/cheap chat model deployment name."""
    return _config.deployment_chat_mini


def get_embedding_deployment() -> str:
    """Get the embedding model deployment name."""
    return _config.deployment_embedding


def _create_sync_client(config: AzureOpenAIConfig) -> AzureOpenAI:
    """Create a synchronous Azure OpenAI client."""
    return AzureOpenAI(
        api_key=config.api_key,
        api_version=config.chat_api_version,
        azure_endpoint=config.endpoint,
    )


def _create_async_client(config: AzureOpenAIConfig) -> AsyncAzureOpenAI:
    """Create an asynchronous Azure OpenAI client."""
    return AsyncAzureOpenAI(
        api_key=config.api_key,
        api_version=config.chat_api_version,
        azure_endpoint=config.endpoint,
    )


def _create_embedding_client(config: AzureOpenAIConfig) -> AzureOpenAI:
    """Create a synchronous client for embeddings."""
    return AzureOpenAI(
        api_key=config.api_key,
        api_version=config.embedding_api_version,
        azure_endpoint=config.endpoint,
    )


def _create_async_embedding_client(config: AzureOpenAIConfig) -> AsyncAzureOpenAI:
    """Create an asynchronous client for embeddings."""
    return AsyncAzureOpenAI(
        api_key=config.api_key,
        api_version=config.embedding_api_version,
        azure_endpoint=config.endpoint,
    )


# Initialize configuration and clients
try:
    _config = AzureOpenAIConfig()
    _initialize_model_mapping(_config)

    azure_openai_client = _create_sync_client(_config)
    azure_openai_async_client = _create_async_client(_config)
    azure_openai_embedding_client = _create_embedding_client(_config)
    azure_openai_async_embedding_client = _create_async_embedding_client(_config)

    _config.log_configuration()
    logger.info("Azure OpenAI clients initialized successfully")

except ValueError as e:
    logger.critical(f"Failed to initialize Azure OpenAI: {e}")
    raise


async def validate_azure_connection() -> dict:
    """Validate the Azure OpenAI connection."""
    try:
        response = azure_openai_client.chat.completions.create(
            model=_config.deployment_chat_mini,
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=5,
        )
        chat_ok = response.choices[0].message.content is not None

        embed_response = azure_openai_embedding_client.embeddings.create(
            model=_config.deployment_embedding,
            input="test",
        )
        embedding_ok = len(embed_response.data[0].embedding) > 0

        return {
            "status": "healthy" if (chat_ok and embedding_ok) else "degraded",
            "chat_completion": "ok" if chat_ok else "failed",
            "embeddings": "ok" if embedding_ok else "failed",
            "endpoint": _config.endpoint,
        }
    except Exception as e:
        logger.error(f"Azure OpenAI validation failed: {e}")
        raise


__all__ = [
    "azure_openai_client",
    "azure_openai_async_client",
    "azure_openai_embedding_client",
    "azure_openai_async_embedding_client",
    "get_deployment_name",
    "get_chat_deployment",
    "get_chat_mini_deployment",
    "get_embedding_deployment",
    "validate_azure_connection",
]
