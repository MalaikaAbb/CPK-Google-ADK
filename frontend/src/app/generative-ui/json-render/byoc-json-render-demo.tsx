// Verbatim from the page's page.tsx block.
import {
  CopilotKit,
  CopilotChat,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import { JsonRenderAssistantMessage } from "./json-render-renderer";

export default function ByocJsonRenderDemo() {
  useConfigureSuggestions({
    suggestions: [
      { title: "Sales dashboard", message: "Show me a sales dashboard." },
      { title: "Region breakdown", message: "Break down sales by region." },
    ],
    available: "always",
  });

  return (
    <CopilotKit runtimeUrl="/api/copilotkit-byoc-json-render" agent="byoc_json_render">
      <CopilotChat
        // @ts-expect-error harness: doc bug — CopilotKit 1.73.3 and 1.74.0 type this slot as typeof CopilotChatAssistantMessage, which a plain component does not satisfy
        messageView={{ assistantMessage: JsonRenderAssistantMessage }}
      />
    </CopilotKit>
  );
}
