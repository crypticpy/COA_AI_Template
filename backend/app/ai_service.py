"""
AI Service for COA AI Template

Provides base patterns for AI operations with retry logic and error handling.

TODO: Customize prompts and schemas for your application.
"""

import json
import logging
import asyncio
from typing import List, Dict, Any, Optional
from functools import wraps
import openai

from app.openai_provider import (
    azure_openai_async_client,
    get_chat_deployment,
    get_chat_mini_deployment,
    get_embedding_deployment,
    azure_openai_async_embedding_client,
)

logger = logging.getLogger(__name__)

# Retry configuration
MAX_RETRIES = 3
INITIAL_BACKOFF = 1.0
BACKOFF_MULTIPLIER = 2.0
REQUEST_TIMEOUT = 60


def with_retry(max_retries: int = MAX_RETRIES):
    """
    Decorator for retrying async functions with exponential backoff.
    Handles OpenAI API errors and rate limits.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            last_exception = None
            backoff = INITIAL_BACKOFF

            for attempt in range(max_retries):
                try:
                    return await func(*args, **kwargs)
                except openai.RateLimitError as e:
                    last_exception = e
                    wait_time = backoff * (BACKOFF_MULTIPLIER ** attempt)
                    logger.warning(
                        f"Rate limited on {func.__name__}, retrying in {wait_time}s "
                        f"(attempt {attempt + 1}/{max_retries})"
                    )
                    await asyncio.sleep(wait_time)
                except openai.APITimeoutError as e:
                    last_exception = e
                    wait_time = backoff * (BACKOFF_MULTIPLIER ** attempt)
                    logger.warning(
                        f"Timeout on {func.__name__}, retrying in {wait_time}s "
                        f"(attempt {attempt + 1}/{max_retries})"
                    )
                    await asyncio.sleep(wait_time)
                except openai.APIConnectionError as e:
                    last_exception = e
                    wait_time = backoff * (BACKOFF_MULTIPLIER ** attempt)
                    logger.warning(
                        f"Connection error on {func.__name__}, retrying in {wait_time}s "
                        f"(attempt {attempt + 1}/{max_retries})"
                    )
                    await asyncio.sleep(wait_time)
                except openai.APIStatusError as e:
                    if 400 <= e.status_code < 500:
                        logger.error(f"API error on {func.__name__}: {e.status_code} - {e.message}")
                        raise
                    last_exception = e
                    wait_time = backoff * (BACKOFF_MULTIPLIER ** attempt)
                    logger.warning(
                        f"API error on {func.__name__}, retrying in {wait_time}s "
                        f"(attempt {attempt + 1}/{max_retries})"
                    )
                    await asyncio.sleep(wait_time)

            logger.error(f"All {max_retries} retries exhausted for {func.__name__}")
            raise last_exception

        return wrapper
    return decorator


@with_retry()
async def generate_embedding(text: str) -> List[float]:
    """
    Generate an embedding vector for text using Azure OpenAI.
    
    Args:
        text: The text to embed
        
    Returns:
        List of floats representing the embedding vector
    """
    response = await azure_openai_async_embedding_client.embeddings.create(
        model=get_embedding_deployment(),
        input=text,
    )
    return response.data[0].embedding


@with_retry()
async def generate_embeddings_batch(texts: List[str]) -> List[List[float]]:
    """
    Generate embeddings for multiple texts in a single API call.
    
    Args:
        texts: List of texts to embed
        
    Returns:
        List of embedding vectors
    """
    response = await azure_openai_async_embedding_client.embeddings.create(
        model=get_embedding_deployment(),
        input=texts,
    )
    return [item.embedding for item in response.data]


@with_retry()
async def chat_completion(
    messages: List[Dict[str, str]],
    model: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 1000,
    response_format: Optional[Dict[str, str]] = None,
) -> str:
    """
    Generate a chat completion using Azure OpenAI.
    
    Args:
        messages: List of message dicts with 'role' and 'content'
        model: Model deployment to use (defaults to main chat model)
        temperature: Sampling temperature (0-2)
        max_tokens: Maximum tokens in response
        response_format: Optional response format (e.g., {"type": "json_object"})
        
    Returns:
        The assistant's response content
    """
    deployment = model or get_chat_deployment()
    
    kwargs = {
        "model": deployment,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    
    if response_format:
        kwargs["response_format"] = response_format
    
    response = await azure_openai_async_client.chat.completions.create(**kwargs)
    return response.choices[0].message.content or ""


@with_retry()
async def chat_completion_json(
    messages: List[Dict[str, str]],
    model: Optional[str] = None,
    temperature: float = 0.3,
    max_tokens: int = 2000,
) -> Dict[str, Any]:
    """
    Generate a chat completion that returns JSON.
    
    Args:
        messages: List of message dicts with 'role' and 'content'
        model: Model deployment to use
        temperature: Sampling temperature (lower for more deterministic JSON)
        max_tokens: Maximum tokens in response
        
    Returns:
        Parsed JSON response as a dictionary
    """
    content = await chat_completion(
        messages=messages,
        model=model,
        temperature=temperature,
        max_tokens=max_tokens,
        response_format={"type": "json_object"},
    )
    
    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON response: {e}")
        logger.error(f"Raw content: {content}")
        raise ValueError(f"Invalid JSON response from model: {e}")


async def quick_analysis(
    text: str,
    prompt: str,
    model: Optional[str] = None,
) -> str:
    """
    Perform a quick analysis of text using the fast model.
    
    Args:
        text: The text to analyze
        prompt: Instructions for analysis
        model: Model to use (defaults to mini model)
        
    Returns:
        Analysis result
    """
    deployment = model or get_chat_mini_deployment()
    
    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": text},
    ]
    
    return await chat_completion(
        messages=messages,
        model=deployment,
        temperature=0.3,
        max_tokens=500,
    )


# TODO: Add your application-specific AI functions here
# Example:
#
# async def analyze_document(document: str) -> Dict[str, Any]:
#     """Analyze a document and extract key information."""
#     system_prompt = """
#     Analyze the following document and extract:
#     - Main topics
#     - Key entities
#     - Summary
#     Return as JSON.
#     """
#     
#     messages = [
#         {"role": "system", "content": system_prompt},
#         {"role": "user", "content": document},
#     ]
#     
#     return await chat_completion_json(messages)
