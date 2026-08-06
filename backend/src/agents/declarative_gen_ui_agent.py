"""Agent backing the A2UI Dynamic-Schema route.

https://docs.copilotkit.ai/google-adk/generative-ui/a2ui/dynamic-schema

Nothing framework-specific happens here, which is the point of the page: the
frontend passes `a2ui={{ catalog }}` to the provider, and that alone enables
A2UI and auto-injects the `generate_a2ui` tool. The runtime serialises the
catalog into the agent's context so the model knows which components it may
emit, and a secondary LLM designs the surface. The agent itself just needs
`AGUIToolset()` and an instruction telling it to reach for the tool.

(The page's "I opted out of auto-inject" section shows the manual path, but its
sample imports `ag_ui_langgraph.get_a2ui_tools`. The ADK equivalent is
`ag_ui_adk.get_a2ui_tool`; this repo takes the auto-inject path instead.)
"""

from __future__ import annotations

#region agent
from ag_ui_adk import AGUIToolset
from google.adk.agents import LlmAgent

from agents.shared_chat import MODEL, stop_on_terminal_text

_INSTRUCTION = (
    "You answer with generated interfaces, not prose. When the user asks for "
    "a dashboard, a breakdown, a comparison, or a summary of anything with "
    "structure, call the A2UI tool to design and render a surface for it — "
    "cards, metrics, tables and charts as the data warrants. Invent "
    "plausible figures where you have none; this is a demonstration surface. "
    "After the surface renders, add at most one short sentence."
)

declarative_gen_ui_agent = LlmAgent(
    name="DeclarativeGenUiAgent",
    model=MODEL,
    instruction=_INSTRUCTION,
    tools=[AGUIToolset()],
    after_model_callback=stop_on_terminal_text,
)
#endregion
