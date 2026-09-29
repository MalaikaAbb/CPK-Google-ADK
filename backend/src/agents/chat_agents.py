"""Plain chat agents for the routes whose subject is entirely frontend.

Prebuilt components, CSS, slots, headless UI, chat controls, multimodal
attachments, voice, frontend tools, components-as-tools and programmatic
control all teach something about the React side. Their backend is the same
`AGUIToolset()` agent the Human-in-the-Loop page shows; only the instruction
changes, so that the model behaves sensibly for what each page asks of it.
"""

from __future__ import annotations

from agents.shared_chat import build_simple_chat_agent, build_thinking_chat_agent

_GENERIC = "Be helpful and fun! Keep replies short unless asked for detail."

#region chat-agents
agentic_chat_agent = build_simple_chat_agent(
    name="AgenticChatAgent",
    instruction=_GENERIC,
)

prebuilt_sidebar_agent = build_simple_chat_agent(
    name="PrebuiltSidebarAgent",
    instruction=_GENERIC,
)

prebuilt_popup_agent = build_simple_chat_agent(
    name="PrebuiltPopupAgent",
    instruction=_GENERIC,
)

chat_controls_agent = build_simple_chat_agent(
    name="ChatControlsAgent",
    instruction=_GENERIC,
)

chat_customization_css_agent = build_simple_chat_agent(
    name="ChatCustomizationCssAgent",
    instruction=_GENERIC,
)

chat_slots_agent = build_simple_chat_agent(
    name="ChatSlotsAgent",
    instruction=_GENERIC,
)

headless_simple_agent = build_simple_chat_agent(
    name="HeadlessSimpleAgent",
    instruction=_GENERIC,
)

headless_complete_agent = build_simple_chat_agent(
    name="HeadlessCompleteAgent",
    instruction=_GENERIC,
)

programmatic_control_agent = build_simple_chat_agent(
    name="ProgrammaticControlAgent",
    instruction=_GENERIC,
)

# Frontend tools: the handler lives in the browser, so the agent must be told
# the tool exists as a real capability rather than something to describe.
frontend_tools_agent = build_simple_chat_agent(
    name="FrontendToolsAgent",
    instruction=(
        "You can change the page background by calling the `change_background` "
        "tool, which runs in the user's browser. When the user asks for a "
        "different look, call it with a CSS background value — prefer "
        "gradients — then say one short sentence about what you picked."
    ),
)

# Components as tools: `useComponent` registers `render_bar_chart` on the
# frontend, so from the model's side it is just another tool.
gen_ui_tool_based_agent = build_simple_chat_agent(
    name="GenUiToolBasedAgent",
    instruction=(
        "When the user asks for a chart, a comparison, or any numbers worth "
        "seeing side by side, call `render_bar_chart` with a title and the "
        "labelled values. The chart renders itself in the chat — do not "
        "repeat the numbers as a list afterwards."
    ),
)

# Multimodal: Gemini is vision-capable, so attachments arrive as real content
# parts rather than as filenames.
multimodal_agent = build_simple_chat_agent(
    name="MultimodalAgent",
    instruction=(
        "Users can attach images, PDFs, audio and video. Describe what you "
        "actually see or read in an attachment, and say so plainly if a file "
        "arrives in a form you cannot interpret."
    ),
)

# Voice: the transcript arrives as an ordinary user message, so the only
# adjustment is tone — spoken questions want spoken-length answers.
voice_agent = build_simple_chat_agent(
    name="VoiceAgent",
    instruction=(
        "Your replies are often read aloud or spoken to. Answer in one or two "
        "short sentences, in plain prose, with no markdown or lists."
    ),
)
#endregion


#region reasoning-agents
# The two Reasoning pages need a model that actually emits thinking tokens.
_REASONING_INSTRUCTION = (
    "Think step by step before answering. Prefer questions that need real "
    "working — comparisons, estimates, multi-step arithmetic — and show that "
    "working in your reasoning, then give a short final answer."
)

reasoning_default_agent = build_thinking_chat_agent(
    name="ReasoningDefaultAgent",
    instruction=_REASONING_INSTRUCTION,
)

reasoning_custom_agent = build_thinking_chat_agent(
    name="ReasoningCustomAgent",
    instruction=_REASONING_INSTRUCTION,
)
#endregion


#region doc-gap-agents
# Pages that publish no agent at all. Each gets the same generic shape as the
# frontend-only routes above, and no instruction beyond `_GENERIC`: writing a
# page-specific prompt would be supplying the half the doc left out.

# Governed Action Approval UI — the page is frontend-only. The model learns
# about `approve_governed_action` purely from the tool description the
# frontend registers.
governed_actions_agent = build_simple_chat_agent(
    name="GovernedActionsAgent",
    instruction=_GENERIC,
)

# Open Generative UI — the page's runtime points at `/open_gen_ui` and
# `/open_gen_ui_advanced` but never shows either agent. `generateSandboxedUi`
# reaches the model as a frontend tool, through `AGUIToolset()`.
open_gen_ui_agent = build_simple_chat_agent(
    name="OpenGenUiAgent",
    instruction=_GENERIC,
)

open_gen_ui_advanced_agent = build_simple_chat_agent(
    name="OpenGenUiAdvancedAgent",
    instruction=_GENERIC,
)
#endregion


#region byoc-agents
# JSON Render and Hashbrown. Neither page shows an agent or a prompt; both
# only show the JSON the agent should reply with. These instructions are
# harness-authored and ask for exactly those shapes, component names and props
# taken from the pages' catalogs. They are the one piece of substance on these
# routes that did not come from the docs.

_BYOC_DATA_NOTE = (
    "There is no real data source: use plausible illustrative sales numbers. "
    "Reply with the JSON object only — no prose, no code fences."
)

byoc_json_render_agent = build_simple_chat_agent(
    name="ByocJsonRenderAgent",
    instruction=(
        "You draw dashboards by replying with a single JSON object of the form "
        '{"root": "<id>", "elements": {"<id>": {"type": ..., "props": {...}, '
        '"children": ["<id>", ...]}}}. `root` is the id of the top-level '
        "element; every id in `children` must be a key in `elements`.\n"
        "Element types:\n"
        "- Stack: no props; lays out its children.\n"
        "- MetricCard: props {title: string, value: number, delta?: number}.\n"
        "- BarChart: props {data: [{label: string, value: number}]}.\n"
        "- PieChart: props {data: [{label: string, value: number}]}.\n"
        "Use a Stack as the root when there is more than one element. "
        + _BYOC_DATA_NOTE
    ),
)

byoc_hashbrown_agent = build_simple_chat_agent(
    name="ByocHashbrownAgent",
    instruction=(
        "You draw dashboards by replying with a single JSON object. Each node "
        'has a "type" and its props as sibling keys; a Stack node holds a '
        '"children" array of nodes. Example: {"type": "Stack", "children": '
        '[{"type": "MetricCard", "title": "Total revenue", "value": 184302}, '
        '{"type": "BarChart", "data": [{"label": "North", "value": 52000}]}]}.\n'
        "Node types:\n"
        "- Stack: children only.\n"
        "- MetricCard: title (string), value (number), delta (number, optional).\n"
        "- BarChart: data, a list of {label: string, value: number}.\n"
        "- PieChart: data, a list of {label: string, value: number}.\n"
        + _BYOC_DATA_NOTE
    ),
)
#endregion
