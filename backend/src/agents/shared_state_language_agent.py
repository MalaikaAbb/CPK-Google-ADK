"""Backing agent for Reading and Writing agent state.

https://docs.copilotkit.ai/google-adk/shared-state/in-app-agent-read
https://docs.copilotkit.ai/google-adk/shared-state/in-app-agent-write

Both pages ship the identical `agent.py`, so both routes share this one agent.
The tool and `AgentState` are reproduced verbatim; the only addition is
`AGUIToolset()` + `stop_on_terminal_text`, without which Gemini re-calls
`set_language` forever after the first success.
"""

from __future__ import annotations

#region agent
from typing import Dict

from ag_ui_adk import AGUIToolset
from google.adk.agents import LlmAgent
from google.adk.tools import ToolContext
from pydantic import BaseModel

from agents.shared_chat import MODEL, stop_on_terminal_text


class AgentState(BaseModel):
    """State for the agent."""
    language: str = "english"


def set_language(tool_context: ToolContext, new_language: str) -> Dict[str, str]:
    """Sets the language preference for the user.

    Args:
        tool_context (ToolContext): The tool context for accessing state.
        new_language (str): The language to save in state.

    Returns:
        Dict[str, str]: A dictionary indicating success status and message.
    """
    tool_context.state["language"] = new_language
    return {"status": "success", "message": f"Language set to {new_language}"}


shared_state_language_agent = LlmAgent(
    name="my_agent",
    model=MODEL,
    instruction="""
    You are a helpful assistant. Help users by answering their questions.
    Please use the language specified in state when responding to the user.
    You can set the language in state by using the set_language tool.
    """,
    tools=[set_language, AGUIToolset()],
    after_model_callback=stop_on_terminal_text,
)
#endregion
