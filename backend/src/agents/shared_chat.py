"""The one callback every agent in this package shares.

`stop_on_terminal_text` is supplied verbatim by the CopilotKit showcase — it is
not exported by `ag-ui-adk` and does not appear on any doc page, but every doc
snippet imports it, so without it none of the agents below can be written as
the docs write them. See README §9.

Deliberately *not* here: a `get_model()` helper. The doc snippets import one,
but the Quickstart is the only page that names a model, so every agent in this
package inlines that page's `gemini-2.5-flash` directly instead.
"""

from __future__ import annotations

import logging
from typing import Optional

from ag_ui_adk import AGUIToolset
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.llm_response import LlmResponse
from google.genai import types

logger = logging.getLogger(__name__)

#region model
# https://docs.copilotkit.ai/google-adk/quickstart?agent=bring-your-own names
# exactly one model. Every agent here uses it.
MODEL = "gemini-2.5-flash"
#endregion


#region stop-on-terminal-text
# def stop_on_terminal_text(
#     callback_context: CallbackContext, llm_response: LlmResponse
# ) -> Optional[LlmResponse]:
#     """Terminate the ADK agentic loop on a final text-only model turn.

#     Lifted from the (orphaned) `simple_after_model_modifier` in
#     `agents/main.py`, with the SalesPipelineAgent name-gate removed so it
#     applies to every registered agent. Guards:

#     1. Skip partial streaming events — never end on a mid-stream chunk
#        (belt-and-suspenders with `ADK_DISABLE_PROGRESSIVE_SSE_STREAMING=1`
#        in `entrypoint.sh`).
#     2. Only terminate when the final non-partial response contains TEXT
#        and NO pending function_call — mixed text+function_call responses
#        (a known Gemini Flash quirk) must NOT terminate.
#     3. `_invocation_context` is an ADK private attribute; if it disappears
#        in a future ADK release, log-and-degrade rather than crash the
#        callback (which would stall the request).

#     Without this guard, Gemini calls the same tool indefinitely after a
#     successful tool result because no native termination condition fires.
#     """
#     content = llm_response.content
#     if not content or not content.parts:
#         if llm_response.error_message:
#             logger.warning(
#                 "stop_on_terminal_text: Gemini returned error_message for agent=%s: %s",
#                 callback_context.agent_name,
#                 llm_response.error_message,
#             )
#         return None

#     if getattr(llm_response, "partial", False):
#         return None

#     # Under thinking mode (`include_thoughts=True`), Gemini emits a turn
#     # as TWO separate non-partial chunks:
#     #   1. text-only chunk: thought + reply text, `finish_reason=None`
#     #   2. function_call-only chunk: `finish_reason=FUNCTION_CALL`
#     # The callback fires on both. Without the finish_reason guard below,
#     # chunk 1's text-without-function-call shape causes premature
#     # termination — the function call in chunk 2 still streams but the
#     # agentic loop is already marked `end_invocation=True`, so the
#     # post-tool-result re-invocation that would chain to the next tool
#     # never happens (tool-rendering-reasoning-chain AAPL→MSFT regression).
#     # Only terminate when Gemini signals the turn is genuinely done with
#     # `finish_reason=STOP` (no further chunks coming). FUNCTION_CALL and
#     # None mean "more chunks are inbound" — defer.
#     finish_reason = getattr(llm_response, "finish_reason", None)
#     finish_reason_name = (
#         getattr(finish_reason, "name", None) if finish_reason is not None else None
#     )
#     if finish_reason_name != "STOP" and finish_reason != "STOP":
#         return None

#     has_text = any(getattr(part, "text", None) for part in content.parts)
#     has_function_call = any(
#         getattr(part, "function_call", None) for part in content.parts
#     )
#     if content.role != "model" or not has_text or has_function_call:
#         return None

#     invocation_context = getattr(callback_context, "_invocation_context", None)
#     if invocation_context is None:
#         logger.debug(
#             "stop_on_terminal_text: callback_context has no "
#             "_invocation_context attribute; skipping end_invocation."
#         )
#         return None

#     try:
#         invocation_context.end_invocation = True
#     except AttributeError:
#         logger.debug(
#             "stop_on_terminal_text: _invocation_context lacks "
#             "end_invocation; ADK private-API shape may have drifted."
#         )
#     return None

def stop_on_terminal_text(
    callback_context: CallbackContext, llm_response: LlmResponse
) -> None:
    content = llm_response.content
    if llm_response.partial or not content or content.role != "model":
        return
    finish_reason = llm_response.finish_reason
    if getattr(finish_reason, "name", finish_reason) != "STOP":
        return
    parts = content.parts or []
    if not any(part.text for part in parts) or any(part.function_call for part in parts):
        return
    # ADK's invocation context is private; tolerate SDK changes.
    invocation = getattr(callback_context, "_invocation_context", None)
    if invocation is not None:
        try:
            invocation.end_invocation = True
        except AttributeError:
            pass

#endregion


#region builders
def build_simple_chat_agent(*, name: str, instruction: str) -> LlmAgent:
    """The exact `LlmAgent` shape every doc page shows, as a one-liner.

    A dozen routes here differ only on the frontend — prebuilt components,
    slots, CSS, headless UI, frontend tools, programmatic control. They all
    want the same backend: `AGUIToolset()` in `tools=` so CopilotKit's
    frontend-tool channel is open, and `stop_on_terminal_text` to end the turn.
    Writing that literal twelve times would just be twelve chances to drift.
    """
    return LlmAgent(
        name=name,
        model=MODEL,
        instruction=instruction,
        tools=[AGUIToolset()],
        after_model_callback=stop_on_terminal_text,
    )


def build_thinking_chat_agent(*, name: str, instruction: str) -> LlmAgent:
    """Same, plus Gemini thinking so the reasoning routes have something to show.

    The two Reasoning doc pages describe the `REASONING_MESSAGE_*` events the
    chat renders but never show an ADK agent that emits any. This is the
    missing half: `include_thoughts=True` makes Gemini return `thought` parts,
    which ADK forwards over AG-UI as reasoning chunks. `thinking_budget=-1`
    lets the model decide how long to think.
    """
    return LlmAgent(
        name=name,
        model=MODEL,
        instruction=instruction,
        tools=[AGUIToolset()],
        generate_content_config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(
                include_thoughts=True,
                thinking_budget=-1,
            ),
        ),
        after_model_callback=stop_on_terminal_text,
    )
#endregion
