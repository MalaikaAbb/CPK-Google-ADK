# Components as Tools

> Let your agent render rich React components directly in the chat by calling them as tools.


<!-- interactive demo: gen-ui-tool-based -->


## What is this?

Tool-based Generative UI is the simplest form of Generative UI: you register
a React component with `useComponent`, and CopilotKit exposes it to the
agent as a tool. When the agent calls the tool, CopilotKit renders your
component inline in the chat, passing the tool's arguments straight through
as typed props.

Unlike [tool rendering](/google-adk/generative-ui/tool-rendering), which wraps a
real backend tool in a custom UI, tool-based GenUI is the component. There
is no handler, no user interaction, no server-side execution. The agent
decides when to show it, populates the data, and CopilotKit paints it.

## When should I use this?

Use `useComponent` when you want to:

- Display rich UI (cards, charts, tables, dashboards) inline in the chat
- Show structured data the agent has derived from its reasoning
- Render previews, status indicators, or visual summaries
- Let the agent present information beyond plain text

For components that need user interaction, see
[Human-in-the-loop](/google-adk/human-in-the-loop). For operational transparency
around a real backend tool, see [Tool rendering](/google-adk/generative-ui/tool-rendering).

## How it works in code

<Steps>
  <Step>
    ### Install the ADK + AG-UI bridge

    ```bash
    pip install ag-ui-adk
    ```

  </Step>
  <Step>
    ### Add `AGUIToolset()` to your agent

    `AGUIToolset()` is the tool that exposes CopilotKit's frontend-tool
    channel to the model — drop it into your `LlmAgent`'s `tools=` list and
    frontend tools become available on every turn. Pair it with
    `stop_on_terminal_text` as the `after_model_callback` so CopilotKit's UI
    knows when the agent has finished its turn.

    
~~~~python title="hitl_in_chat_agent.py"
from google.adk.agents import LlmAgent
from ag_ui_adk import AGUIToolset

from agents.shared_chat import get_model, stop_on_terminal_text

# CopilotKit wires into ADK via the `AGUIToolset()` tool: pass it in the
# `tools=` list of your `LlmAgent` to expose CopilotKit's frontend-tool
# channel to the model. `stop_on_terminal_text` is a small ADK callback
# that lets CopilotKit's UI know when the agent has finished its turn.
_INSTRUCTION = (
    "You are a planning assistant. When the user asks you to plan something, "
    "always call generate_task_steps with the proposed list of steps (each "
    "with description + status='enabled'). The frontend will render the "
    "steps inline and the user will confirm or reject — your job is to plan "
    "and call the tool, then summarise the user's decision once they "
    "respond."
)

hitl_in_chat_agent = LlmAgent(
    name="HitlInChatAgent",
    model=get_model(),
    instruction=_INSTRUCTION,
    tools=[AGUIToolset()],
    after_model_callback=stop_on_terminal_text,
)
~~~~


  </Step>
</Steps>

`useComponent` takes a name, a Zod schema for its props, and the component
to render. The runtime registers it as a frontend tool so the agent can
discover it, and Zod validates the LLM's arguments before they reach your
component.

```typescript
// src/app/demos/gen-ui-tool-based/page.tsx
  useComponent({
    name: "render_bar_chart",
    description: "Display a bar chart with labeled numeric values.",
    parameters: barChartPropsSchema,
    render: BarChart,
  });
```

The component itself is ordinary React: it reads only its props and can
stream in as the agent fills the payload. The example above uses
[Recharts](https://recharts.org) for the bar chart; it doesn't know
anything about CopilotKit.

<Callout type="info">
  The `name` you pass to `useComponent` is what the agent sees as the tool
  name. Make it a verb like `render_bar_chart` or `show_weather` so the LLM
  reliably picks it when the user asks for that visualization.
</Callout>

<IntegrationGrid path="generative-ui/tool-based" />
