"""Agent behind the Components and surfaces overview route.

https://docs.copilotkit.ai/google-adk/generative-ui/components

The page's "Try it" agent is a CopilotKit `BuiltInAgent` in TanStack factory
mode on OpenAI. This harness runs its own framework's agents, so it is swapped
for an ADK `LlmAgent` (a labelled doc gap). Kept from the snippet: its system
prompt, word for word, and its tools — none of its own; it only passes on the
run's tools (`render_ui`) and the run's context (the render_ui guide).

The ADK equivalents of the snippet's two pass-throughs:

- `tools` → `AGUIToolset()`, which hands the run's client tools to the model.
- `systemPrompts` → `ag_ui_adk` stores context entries in session state, not
  in the prompt, so the instruction provider appends them the way the Agent
  App Context page does for ADK (`render_context`).

`stop_on_terminal_text` is the repo-wide guard every chat agent here uses
(README §9 item 1); it is not on the page.
"""

from __future__ import annotations

from ag_ui_adk import AGUIToolset
from google.adk.agents import LlmAgent
from google.adk.agents.readonly_context import ReadonlyContext

from agents.agent_app_context_agent import render_context
from agents.shared_chat import MODEL, stop_on_terminal_text


#region agent
# The snippet's own system prompt, verbatim.
SYSTEM_PROMPT = "You are a helpful assistant. When a visual answer helps, render it with generative UI."


def build_instruction(ctx: ReadonlyContext) -> str:
    return f"{SYSTEM_PROMPT}\n\n{render_context(ctx.state)}\n"


components_agent = LlmAgent(
    name="ComponentsOverviewAgent",
    model=MODEL,
    instruction=build_instruction,
    tools=[AGUIToolset()],
    after_model_callback=stop_on_terminal_text,
)
#endregion
