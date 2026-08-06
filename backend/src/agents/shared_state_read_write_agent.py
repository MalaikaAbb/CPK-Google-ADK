"""Backing agent for the Shared State overview.

https://docs.copilotkit.ai/google-adk/shared-state

The page shows the `LlmAgent(...)` literal but not the two things it names.
Both are written here to the shape the page describes in prose:

  * `set_notes` — the agent-authored write side. "The agent writes here via
    its `set_notes` tool. The UI re-renders from shared state."
  * `_inject_preferences` — the UI-authored read side. "A before-model
    callback reads UI-authored preferences out of session state."

The page also names the state slots the frontend renders: `notes` (a list) and
`preferences`, which the UI writes with `agent.setState`.
"""

from __future__ import annotations

from typing import Dict, List

from ag_ui_adk import AGUIToolset
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.llm_request import LlmRequest
from google.adk.models.llm_response import LlmResponse
from google.adk.tools import ToolContext
from typing import Optional

from agents.shared_chat import MODEL, stop_on_terminal_text

#region set-notes
def set_notes(tool_context: ToolContext, notes: List[str]) -> Dict[str, str]:
    """Replaces the shared scratch pad with the given list of observations.

    Args:
        tool_context (ToolContext): The tool context for accessing state.
        notes (List[str]): The full list of notes to store. Pass every note
            you want kept — this replaces the list rather than appending.

    Returns:
        Dict[str, str]: A dictionary indicating success status.
    """
    tool_context.state["notes"] = notes
    return {"status": "success", "message": f"Stored {len(notes)} notes."}
#endregion


#region inject-preferences
def _inject_preferences(
    callback_context: CallbackContext, llm_request: LlmRequest
) -> Optional[LlmResponse]:
    """Prepend the UI-authored preferences to the system prompt each turn.

    The frontend writes `preferences` through `agent.setState`, which lands in
    ADK session state. Reading it here — rather than letting the model discover
    it in a message — is what makes the UI's writes visibly steer the model.
    """
    preferences = callback_context.state.get("preferences")
    if not isinstance(preferences, dict) or not preferences:
        return None

    lines = "\n".join(f"  - {key}: {value}" for key, value in preferences.items())
    llm_request.append_instructions(
        [f"The user set these preferences in the app UI. Honour them:\n{lines}"]
    )
    return None
#endregion


#region agent
_INSTRUCTION = (
    "You are a note-taking companion. As you talk to the user, keep a short "
    "scratch pad of things worth remembering about them by calling "
    "`set_notes` with the complete list. Call it whenever you learn something "
    "new, and otherwise just answer normally."
)

shared_state_read_write_agent = LlmAgent(
    name="SharedStateReadWriteAgent",
    model=MODEL,
    instruction=_INSTRUCTION,
    tools=[set_notes, AGUIToolset()],
    before_model_callback=_inject_preferences,
    after_model_callback=stop_on_terminal_text,
)
#endregion
