"""The Quickstart agent, exactly as the doc's bring-your-own path writes it.

https://docs.copilotkit.ai/google-adk/quickstart?agent=bring-your-own

This is the only agent here with no `AGUIToolset()` and no
`after_model_callback` — the Quickstart's `main.py` has neither, and the point
of this route is to run the doc's snippet unmodified. Every other route needs
the frontend-tool channel, so every other agent adds them.
"""

from __future__ import annotations

#region agent
from google.adk.agents import LlmAgent

agent = LlmAgent(
    name="assistant",
    model="gemini-2.5-flash",
    instruction="Be helpful and fun!"
)
#endregion
