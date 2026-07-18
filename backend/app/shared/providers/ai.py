from abc import abstractmethod
from typing import Any, Optional
from app.shared.providers.base import BaseProvider

class AIProvider(BaseProvider):
    """
    Abstract interface for AI/LLM providers (e.g., Google Gemini).
    Isolates feature modules from the specific SDK implementation.
    """
    
    @abstractmethod
    def generate_content(
        self, 
        prompt: str, 
        image_bytes: Optional[bytes] = None, 
        mime_type: Optional[str] = None, 
        **kwargs: Any
    ) -> str:
        """
        Generates content from the AI model based on the provided prompt and optional image.
        """
        pass
