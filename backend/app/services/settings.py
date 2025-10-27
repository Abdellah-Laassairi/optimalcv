"""Settings management for AI model configuration."""

import json
import os
from pathlib import Path
from typing import Any, Optional

from loguru import logger
from pydantic import BaseModel


class AISettings(BaseModel):
    """AI model configuration settings."""

    provider: str = "openrouter"  # openrouter, openai, anthropic, etc.
    model: str = "openai/gpt-4o-mini"  # Model identifier
    api_key: str = ""
    base_url: Optional[str] = None
    temperature: float = 0.4
    max_tokens: Optional[int] = 4000


# Default settings
_current_settings: AISettings = AISettings()

# Settings file path
SETTINGS_FILE = Path(__file__).parent.parent / "settings.json"


def get_settings() -> AISettings:
    """Get current AI settings."""
    logger.info(f"Getting settings: provider={_current_settings.provider}, model={_current_settings.model}")
    return _current_settings.copy()


def update_settings(settings: dict[str, Any]) -> AISettings:
    """Update AI settings."""
    global _current_settings

    logger.info(f"Updating settings with: {', '.join(k for k in settings.keys() if k != 'api_key')}")

    # Merge with existing settings
    current_dict = _current_settings.dict()
    current_dict.update(settings)

    # Create new settings object
    _current_settings = AISettings(**current_dict)

    logger.info(f"Settings updated: provider={_current_settings.provider}, model={_current_settings.model}")

    # Save to file
    save_settings()

    return _current_settings.copy()


def save_settings():
    """Save settings to file."""
    try:
        logger.info(f"Saving settings to: {SETTINGS_FILE}")
        with open(SETTINGS_FILE, "w") as f:
            json.dump(_current_settings.dict(), f, indent=2)
        logger.info("Settings saved successfully")
    except Exception as e:
        logger.error(f"Could not save settings: {e}")


def load_settings():
    """Load settings from file."""
    global _current_settings

    if SETTINGS_FILE.exists():
        logger.info(f"Loading settings from {SETTINGS_FILE}")
        try:
            with open(SETTINGS_FILE) as f:
                data = json.load(f)
                _current_settings = AISettings(**data)
            logger.info(f"Settings loaded: provider={_current_settings.provider}, model={_current_settings.model}")
        except Exception as e:
            logger.error(f"Could not load settings: {e}")
    else:
        logger.info("No settings file found, using defaults")

    # Use environment variables as fallback only if no API key is saved
    if not _current_settings.api_key:
        # Check for provider-specific environment variables
        provider_env_vars = {
            "openrouter": "OPENROUTER_API_KEY",
            "openai": "OPENAI_API_KEY",
            "anthropic": "ANTHROPIC_API_KEY",
        }

        env_var = provider_env_vars.get(_current_settings.provider)
        if env_var and os.getenv(env_var):
            logger.info(f"Using API key from {env_var} environment variable")
            _current_settings.api_key = os.getenv(env_var)

    # Override model if environment variable is present
    if os.getenv("AI_MODEL"):
        logger.info(f"Using model from AI_MODEL environment variable: {os.getenv('AI_MODEL')}")
        _current_settings.model = os.getenv("AI_MODEL")


# Load settings on import
load_settings()


def get_provider_models() -> dict[str, list]:
    """Get available models for each provider."""
    return {
        "openrouter": [
            {"id": "openai/gpt-4o", "name": "GPT-4o (OpenAI)"},
            {"id": "openai/gpt-4o-mini", "name": "GPT-4o Mini (OpenAI)"},
            {"id": "anthropic/claude-3.5-sonnet", "name": "Claude 3.5 Sonnet (Anthropic)"},
            {"id": "anthropic/claude-3-opus", "name": "Claude 3 Opus (Anthropic)"},
            {"id": "google/gemini-pro-1.5", "name": "Gemini Pro 1.5 (Google)"},
            {"id": "meta-llama/llama-3.1-70b-instruct", "name": "Llama 3.1 70B (Meta)"},
            {"id": "mistralai/mistral-large", "name": "Mistral Large (Mistral AI)"},
        ],
        "openai": [
            {"id": "gpt-4o", "name": "GPT-4o"},
            {"id": "gpt-4o-mini", "name": "GPT-4o Mini"},
            {"id": "gpt-4-turbo", "name": "GPT-4 Turbo"},
        ],
        "anthropic": [
            {"id": "claude-3-5-sonnet-20241022", "name": "Claude 3.5 Sonnet"},
            {"id": "claude-3-opus-20240229", "name": "Claude 3 Opus"},
        ],
    }


def get_provider_config(provider: str) -> dict[str, Any]:
    """Get provider-specific configuration."""
    configs = {
        "openrouter": {
            "base_url": "https://openrouter.ai/api/v1",
            "requires_api_key": True,
            "api_key_env": "YOUR_OPENROUTER_API_KEY",  # pragma: allowlist secret
            "docs_url": "https://openrouter.ai/docs",
        },
        "openai": {
            "base_url": "https://api.openai.com/v1",
            "requires_api_key": True,
            "api_key_env": "YOUR_OPENAI_API_KEY",  # pragma: allowlist secret
            "docs_url": "https://platform.openai.com/docs",
        },
        "anthropic": {
            "base_url": "https://api.anthropic.com/v1",
            "requires_api_key": True,
            "api_key_env": "YOUR_ANTHROPIC_API_KEY",  # pragma: allowlist secret
            "docs_url": "https://docs.anthropic.com",
        },
    }
    return configs.get(provider, {})
