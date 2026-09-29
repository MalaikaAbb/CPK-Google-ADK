/**
 * Doc code that does not run in this repo, kept byte-exact from
 * https://docs.copilotkit.ai/google-adk/agent-app-context
 * and rendered as text on the route page. Not imported by any demo.
 */

export const TOOLS_SNIPPET = "from ag_ui_adk import CONTEXT_STATE_KEY\nfrom google.adk.tools import ToolContext\n\ndef find_colleague(tool_context: ToolContext, name: str) -> dict:\n    \"\"\"Look up one colleague among the ones the page sent.\"\"\"\n    entries = tool_context.state.get(CONTEXT_STATE_KEY) or [] # [!code highlight]\n    # ... read the entry whose `description` matches the one you registered\n    return {\"found\": False}\n";
