"""Backing agent for Predictive state updates.

https://docs.copilotkit.ai/google-adk/shared-state/predictive-state-updates

Verbatim from the page's tool-based emission variant. The agent breaks a task
into steps and reports progress through `step_progress`, which writes the
running list into `state["observed_steps"]` — so the UI sees the work
accumulate instead of a spinner.
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
    observed_steps: List[str] = []


def step_progress(tool_context: ToolContext, steps: List[str]) -> Dict[str, str]:
    """Reports the current progress steps.

    Args:
        tool_context (ToolContext): The tool context for accessing state.
        steps (List[str]): The list of steps completed so far.

    Returns:
        Dict[str, str]: A dictionary indicating the progress was received.
    """
    tool_context.state["observed_steps"] = steps
    return {"status": "success", "message": "Progress received."}


predictive_state_updates_agent = LlmAgent(
    name="my_agent",
    model=MODEL,
    instruction="""
    You are a task performer. When given a task, break it down into steps
    and report your progress using the step_progress tool after completing each step.
    """,
    tools=[step_progress, AGUIToolset()],
    after_model_callback=stop_on_terminal_text,
)
#endregion
