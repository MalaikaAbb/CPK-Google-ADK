"""Backing agent for Workflow Execution.

https://docs.copilotkit.ai/google-adk/shared-state/workflow-execution

Verbatim from the page. The point of the route is which state travels: the UI
sets `question` and reads `answer`, while `resources` is written by the agent
for its own use and never surfaced. There is no filtering mechanism here — the
separation is a convention the UI upholds by simply not reading the slot.
"""

from __future__ import annotations

#region agent
from typing import Dict, List

from ag_ui_adk import AGUIToolset
from google.adk.agents import LlmAgent
from google.adk.tools import ToolContext
from pydantic import BaseModel

from agents.shared_chat import MODEL, stop_on_terminal_text


class AgentState(BaseModel):
    """State for the agent."""
    question: str = ""       # Input: received from frontend
    answer: str = ""         # Output: sent to frontend
    resources: List[str] = []  # Internal: not shared with frontend


def answer_question(tool_context: ToolContext, answer: str) -> Dict[str, str]:
    """Stores the answer to the user's question.

    Args:
        tool_context (ToolContext): The tool context for accessing state.
        answer (str): The answer to store in state.

    Returns:
        Dict[str, str]: A dictionary indicating success status.
    """
    tool_context.state["answer"] = answer
    return {"status": "success", "message": "Answer stored."}


def add_resource(tool_context: ToolContext, resource: str) -> Dict[str, str]:
    """Adds a resource to the internal resources list.

    Args:
        tool_context (ToolContext): The tool context for accessing state.
        resource (str): The resource URL or reference to add.

    Returns:
        Dict[str, str]: A dictionary indicating success status.
    """
    resources = tool_context.state.get("resources", [])
    resources.append(resource)
    tool_context.state["resources"] = resources
    return {"status": "success", "message": "Resource added."}


workflow_execution_agent = LlmAgent(
    name="my_agent",
    model=MODEL,
    instruction="""
    You are a helpful assistant. When answering questions:
    1. Use add_resource to track any sources you reference (internal use)
    2. Use answer_question to provide your final answer to the user

    The question from the user is available in state as 'question'.
    """,
    tools=[answer_question, add_resource, AGUIToolset()],
    after_model_callback=stop_on_terminal_text,
)
#endregion
