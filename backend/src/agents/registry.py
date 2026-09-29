"""The single list of agents this server exposes.

One entry per doc route that needs a backend. The key is both the AG-UI agent
id the frontend addresses and the FastAPI path the agent is mounted at, so
`agentId="tool-rendering"` in a React component resolves to
`http://localhost:8000/tool-rendering` with nothing in between to keep in sync.

Ids follow the doc pages' own demo ids wherever a page names one (`my_agent`,
`agentic_chat`, `frontend_tools`, `prebuilt-sidebar`, …), which is why the
casing is inconsistent — that inconsistency is the docs'.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterable, Optional

from ag_ui_adk.config import PredictStateMapping
from google.adk.agents import LlmAgent

from agents import chat_agents
from agents.a2ui_fixed_agent import a2ui_fixed_agent
from agents.agent_config_agent import agent_config_agent
from agents.declarative_gen_ui_agent import declarative_gen_ui_agent
from agents.agent_app_context_agent import colleagues_agent
from agents.hitl_in_chat_agent import hitl_in_chat_agent
from agents.predictive_state_updates_agent import predictive_state_updates_agent
from agents.quickstart_agent import agent as quickstart_agent
from agents.readonly_state_agent_context_agent import (
    readonly_state_agent_context_agent,
)
from agents.shared_state_language_agent import shared_state_language_agent
from agents.shared_state_read_write_agent import shared_state_read_write_agent
from agents.shared_state_streaming_agent import (
    SHARED_STATE_STREAMING_PREDICT_STATE,
    shared_state_streaming_agent,
)
from agents.subagents_agent import subagents_root_agent
from agents.tool_rendering_agent import tool_rendering_agent
from agents.workflow_execution_agent import workflow_execution_agent


@dataclass(frozen=True)
class RegisteredAgent:
    """An agent plus the per-agent `ADKAgent` options it needs."""

    agent: LlmAgent
    doc: str
    #: Only State Streaming uses this — it maps a streaming tool argument
    #: into a shared-state key so the UI updates before the tool returns.
    predict_state: Optional[Iterable[PredictStateMapping]] = field(default=None)


#region registry
REGISTRY: dict[str, RegisteredAgent] = {
    # Getting started
    "my_agent": RegisteredAgent(quickstart_agent, "/google-adk/quickstart"),

    # Prebuilt components — same agent shape, one per surface so each route
    # gets its own conversation.
    "agentic_chat": RegisteredAgent(
        chat_agents.agentic_chat_agent, "/google-adk/prebuilt-components/chat"
    ),
    "prebuilt-sidebar": RegisteredAgent(
        chat_agents.prebuilt_sidebar_agent,
        "/google-adk/prebuilt-components/sidebar",
    ),
    "prebuilt-popup": RegisteredAgent(
        chat_agents.prebuilt_popup_agent, "/google-adk/prebuilt-components/popup"
    ),
    "chat-controls": RegisteredAgent(
        chat_agents.chat_controls_agent,
        "/google-adk/prebuilt-components/chat-controls",
    ),

    # Custom look and feel
    "chat-customization-css": RegisteredAgent(
        chat_agents.chat_customization_css_agent,
        "/google-adk/custom-look-and-feel/css",
    ),
    "chat-slots": RegisteredAgent(
        chat_agents.chat_slots_agent, "/google-adk/custom-look-and-feel/slots"
    ),
    "headless-simple": RegisteredAgent(
        chat_agents.headless_simple_agent,
        "/google-adk/custom-look-and-feel/headless-ui",
    ),
    "headless-complete": RegisteredAgent(
        chat_agents.headless_complete_agent,
        "/google-adk/custom-look-and-feel/headless-ui",
    ),
    "reasoning-default": RegisteredAgent(
        chat_agents.reasoning_default_agent,
        "/google-adk/custom-look-and-feel/reasoning-messages",
    ),
    "reasoning-custom": RegisteredAgent(
        chat_agents.reasoning_custom_agent, "/google-adk/generative-ui/reasoning"
    ),

    # Input modalities
    "multimodal": RegisteredAgent(
        chat_agents.multimodal_agent, "/google-adk/multimodal-attachments"
    ),
    # Mounted at /voice; the voice runtime route forwards `voice-demo` here.
    "voice": RegisteredAgent(chat_agents.voice_agent, "/google-adk/voice"),

    # Generative UI
    "tool-rendering": RegisteredAgent(
        tool_rendering_agent, "/google-adk/generative-ui/tool-rendering"
    ),
    "gen-ui-tool-based": RegisteredAgent(
        chat_agents.gen_ui_tool_based_agent,
        "/google-adk/generative-ui/tool-based",
    ),
    "a2ui-fixed-schema": RegisteredAgent(
        a2ui_fixed_agent, "/google-adk/generative-ui/a2ui/fixed-schema"
    ),
    "declarative-gen-ui": RegisteredAgent(
        declarative_gen_ui_agent,
        "/google-adk/generative-ui/a2ui/dynamic-schema",
    ),
    # Open Generative UI. Ids are the URL paths the page's runtime points at
    # (`${AGENT_URL}/open_gen_ui`); the runtime names them `open-gen-ui`.
    "open_gen_ui": RegisteredAgent(
        chat_agents.open_gen_ui_agent,
        "/google-adk/generative-ui/open-generative-ui",
    ),
    "open_gen_ui_advanced": RegisteredAgent(
        chat_agents.open_gen_ui_advanced_agent,
        "/google-adk/generative-ui/open-generative-ui",
    ),
    "byoc_json_render": RegisteredAgent(
        chat_agents.byoc_json_render_agent,
        "/google-adk/generative-ui/json-render",
    ),
    "byoc_hashbrown": RegisteredAgent(
        chat_agents.byoc_hashbrown_agent, "/google-adk/generative-ui/hashbrown"
    ),

    # App control
    "frontend_tools": RegisteredAgent(
        chat_agents.frontend_tools_agent, "/google-adk/frontend-tools"
    ),
    "hitl-in-chat": RegisteredAgent(
        hitl_in_chat_agent, "/google-adk/human-in-the-loop"
    ),
    "governed-actions": RegisteredAgent(
        chat_agents.governed_actions_agent,
        "/google-adk/human-in-the-loop/governed-actions",
    ),
    "programmatic-control": RegisteredAgent(
        chat_agents.programmatic_control_agent, "/google-adk/programmatic-control"
    ),

    # Shared state
    "shared-state-read-write": RegisteredAgent(
        shared_state_read_write_agent, "/google-adk/shared-state"
    ),
    "shared-state-streaming": RegisteredAgent(
        shared_state_streaming_agent,
        "/google-adk/shared-state/streaming",
        predict_state=SHARED_STATE_STREAMING_PREDICT_STATE,
    ),
    "readonly-state-agent-context": RegisteredAgent(
        readonly_state_agent_context_agent,
        "/google-adk/shared-state/agent-readonly",
    ),
    # The read/write pages both call this agent `my_agent`; renamed here so it
    # does not collide with the Quickstart's agent of the same name.
    "shared-state-language": RegisteredAgent(
        shared_state_language_agent,
        "/google-adk/shared-state/in-app-agent-read",
    ),
    "predictive-state-updates": RegisteredAgent(
        predictive_state_updates_agent,
        "/google-adk/shared-state/predictive-state-updates",
    ),
    "workflow-execution": RegisteredAgent(
        workflow_execution_agent, "/google-adk/shared-state/workflow-execution"
    ),

    # Multi-agent
    "subagents": RegisteredAgent(
        subagents_root_agent, "/google-adk/multi-agent/subagents"
    ),

    # Agent config
    "agent-config": RegisteredAgent(agent_config_agent, "/google-adk/agent-config"),
    "agent-app-context": RegisteredAgent(
        colleagues_agent, "/google-adk/agent-app-context"
    ),
}
#endregion
