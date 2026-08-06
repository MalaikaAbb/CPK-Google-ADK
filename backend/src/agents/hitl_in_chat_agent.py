"""Backing agent for Human in the Loop (tool-based).

https://docs.copilotkit.ai/google-adk/human-in-the-loop

Reproduced verbatim from the page, which is the one Python snippet the docs
repeat on every ADK page as the canonical `AGUIToolset()` wiring. Note the
instruction talks about `generate_task_steps` while the page's own frontend
registers `book_call` — that mismatch is the doc's, and it is what §9 of the
README calls out. The frontend route here registers `book_call`.
"""

from __future__ import annotations

#region agent
from google.adk.agents import LlmAgent
from ag_ui_adk import AGUIToolset

from agents.shared_chat import MODEL, stop_on_terminal_text

# CopilotKit wires into ADK via the `AGUIToolset()` tool: pass it in the
# `tools=` list of your `LlmAgent` to expose CopilotKit's frontend-tool
# channel to the model. `stop_on_terminal_text` is a small ADK callback
# that lets CopilotKit's UI know when the agent has finished its turn.
_INSTRUCTION = (
    "You are a scheduling assistant. When the user asks to book or schedule "
    "anything, always call `book_call` with the topic and the attendee. The "
    "frontend renders a time picker inline and the user picks a slot — your "
    "job is to call the tool, then confirm the choice they made in one short "
    "sentence."
)

hitl_in_chat_agent = LlmAgent(
    name="HitlInChatAgent",
    model=MODEL,
    instruction=_INSTRUCTION,
    tools=[AGUIToolset()],
    after_model_callback=stop_on_terminal_text,
)
#endregion
