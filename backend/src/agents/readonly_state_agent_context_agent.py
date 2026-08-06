"""Backing agent for Agent Read-Only Context.

https://docs.copilotkit.ai/google-adk/shared-state/agent-readonly

The page shows the `LlmAgent(...)` literal and describes `_inject_context` in
prose — "use a `before_model_callback` to inject those read-only values into
the system instruction" — but never prints it. Written here to that shape.

One correction to the page: it says the entries arrive under
`state["copilotkit"]["context"]`. In `ag-ui-adk` 0.7.0 they arrive under
`state["_ag_ui_context"]`, which the package exports as `CONTEXT_STATE_KEY`
and which is what this file reads. See README §9.
"""

from __future__ import annotations

from typing import Any, List, Optional

from ag_ui_adk import CONTEXT_STATE_KEY, AGUIToolset
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.llm_request import LlmRequest
from google.adk.models.llm_response import LlmResponse

from agents.shared_chat import MODEL, stop_on_terminal_text


#region read-context
def read_context_entries(state: Any) -> List[dict]:
    """Return the `useAgentContext` entries the runtime put in session state.

    Each entry is `{"description": str, "value": Any}` — the same pair the
    frontend passed to `useAgentContext`. The description matters as much as
    the value: it is the label that tells the model what the value is for.
    """
    entries = state.get(CONTEXT_STATE_KEY) or []
    return [e for e in entries if isinstance(e, dict) and "value" in e]
#endregion


#region inject-context
def _inject_context(
    callback_context: CallbackContext, llm_request: LlmRequest
) -> Optional[LlmResponse]:
    """Fold the UI's read-only context into the system prompt on every turn."""
    entries = read_context_entries(callback_context.state)
    if not entries:
        return None

    lines = "\n".join(
        f"  - {entry.get('description') or 'context'}: {entry['value']}"
        for entry in entries
    )
    llm_request.append_instructions(
        [
            "Here is what the app currently knows about the user and their "
            "session. Treat it as read-only — you have no tool to change any "
            "of it:\n" + lines
        ]
    )
    return None
#endregion


#region agent
_INSTRUCTION = (
    "You are an in-app assistant. The application tells you who the user is, "
    "what timezone they are in, and what they have been doing. Answer "
    "questions about that context directly and specifically. If the user asks "
    "you to change any of it, explain that those values belong to the app and "
    "you can only read them."
)

readonly_state_agent_context_agent = LlmAgent(
    name="ReadonlyStateAgentContextAgent",
    model=MODEL,
    instruction=_INSTRUCTION,
    tools=[AGUIToolset()],
    before_model_callback=_inject_context,
    after_model_callback=stop_on_terminal_text,
)
#endregion
