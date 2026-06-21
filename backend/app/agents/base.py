from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseAgent(ABC):
    """
    Abstract Base Class for defining AI Agents within VoyageIQ.
    All agents should inherit from this class and implement the run method.
    """
    def __init__(self, name: str, config: Dict[str, Any] = None):
        self.name = name
        self.config = config or {}

    @abstractmethod
    async def run(self, prompt: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Execute the agent's logic.
        
        Args:
            prompt: User request or dynamic instruction.
            context: Execution context, DB sessions, session states, etc.
            
        Returns:
            Dict containing the execution result (e.g. output, status, next steps).
        """
        pass
