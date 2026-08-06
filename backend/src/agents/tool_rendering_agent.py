"""Backing agent for the Tool Rendering route.

https://docs.copilotkit.ai/google-adk/generative-ui/tool-rendering

The page wires four renderers on the frontend (`get_weather`,
`search_flights`, plus a catch-all that picks up `get_stock_price` and
`roll_dice`) but only ever shows one backend tool: `get_weather`. That tool is
reproduced verbatim below and is the only one this repo exposes, so the named
renderer has something real to draw and the catch-all stays unexercised.
"""

from __future__ import annotations

from ag_ui_adk import AGUIToolset
from google.adk.agents import LlmAgent

from agents.shared_chat import MODEL, stop_on_terminal_text

#region get-weather
from google.adk.tools import ToolContext


def get_weather(tool_context: ToolContext, location: str) -> dict:
    """Get the current weather for a given location."""
    return {
        "city": location,
        "temperature": 68,
        "humidity": 55,
        "wind_speed": 10,
        "conditions": "Sunny",
    }
#endregion


#region agent
_INSTRUCTION = (
    "You report the weather. When the user asks about conditions anywhere, "
    "call `get_weather` with the location. The result is already drawn as a "
    "card in the chat, so do not restate the numbers — reply with one short "
    "sentence and stop."
)

tool_rendering_agent = LlmAgent(
    name="ToolRenderingAgent",
    model=MODEL,
    instruction=_INSTRUCTION,
    tools=[get_weather, AGUIToolset()],
    after_model_callback=stop_on_terminal_text,
)
#endregion
