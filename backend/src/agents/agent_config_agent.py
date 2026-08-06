"""Backing agent for Agent Config.

https://docs.copilotkit.ai/google-adk/agent-config

The page shows the `LlmAgent(...)` literal for ADK, then prints the
config-reading half as a LangGraph node (`read_config_value` + a
`my_agent_node` that walks `state["copilotkit"]["context"]` in reverse and
rebuilds the system prompt). `read_config_value` is reproduced verbatim below;
`_inject_config` is the same walk, expressed as the ADK
`before_model_callback` the ADK snippet names.

Two departures, both in README §9: the entries live under
`CONTEXT_STATE_KEY` (`_ag_ui_context`) rather than `state["copilotkit"]`, and
`build_system_prompt` is referenced by the page but never defined.
"""

from __future__ import annotations

#region read-config
import json

from typing import Optional

from ag_ui_adk import CONTEXT_STATE_KEY, AGUIToolset
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.llm_request import LlmRequest
from google.adk.models.llm_response import LlmResponse

from agents.shared_chat import MODEL, stop_on_terminal_text

CONFIG_KEYS = ("tone", "expertise", "responseLength")


def read_config_value(entry):
    value = entry.get("value")
    if isinstance(value, str):
        try:
            value = json.loads(value)
        except json.JSONDecodeError:
            return None
    if not isinstance(value, dict):
        return None
    if any(key in value for key in CONFIG_KEYS):
        return value
    return None
#endregion


#region build-system-prompt
def build_system_prompt(tone: str, expertise: str, response_length: str) -> str:
    """Turn the three typed config fields into one instruction block.

    The doc calls this function on every turn but never defines it. What
    matters is only that each field lands in the prompt as a directive the
    model can act on — the wording below is this repo's.
    """
    return (
        "The user has tuned how you should answer. Follow all three settings:\n"
        f"  - Tone: write in a {tone} register.\n"
        f"  - Expertise: the reader is {expertise}; pitch your explanations "
        "and vocabulary accordingly.\n"
        f"  - Length: keep responses {response_length}."
    )
#endregion


#region inject-config
def _inject_config(
    callback_context: CallbackContext, llm_request: LlmRequest
) -> Optional[LlmResponse]:
    """Read the latest typed config and rebuild the system prompt for this turn.

    Reversed, so the most recently published config wins when the UI has
    re-registered the context entry mid-conversation.
    """
    context_entries = callback_context.state.get(CONTEXT_STATE_KEY) or []
    cfg = next(
        (
            value
            for entry in reversed(context_entries)
            if isinstance(entry, dict)
            and (value := read_config_value(entry)) is not None
        ),
        {},
    )
    tone = cfg.get("tone", "professional")
    expertise = cfg.get("expertise", "intermediate")
    response_length = cfg.get("responseLength", "concise")
    llm_request.append_instructions(
        [build_system_prompt(tone, expertise, response_length)]
    )
    return None
#endregion


#region agent
_INSTRUCTION = (
    "You are a general-purpose assistant. Answer whatever the user asks. The "
    "app supplies tone, expertise and length settings on every turn — those "
    "override your own instincts about how to write."
)

agent_config_agent = LlmAgent(
    name="AgentConfigAgent",
    model=MODEL,
    instruction=_INSTRUCTION,
    tools=[AGUIToolset()],
    before_model_callback=_inject_config,
    after_model_callback=stop_on_terminal_text,
)
#endregion
