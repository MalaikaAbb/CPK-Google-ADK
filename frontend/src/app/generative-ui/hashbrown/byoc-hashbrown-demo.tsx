// Verbatim from the page's page.tsx block.
import {
  CopilotKit,
  CopilotChat,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import { HashBrownAssistantMessage } from "./hashbrown-renderer";

export default function ByocHashbrownDemo() {
  useConfigureSuggestions({
    suggestions: [
      { title: "Sales overview", message: "Show me a sales dashboard." },
      { title: "Region split", message: "Break down sales by region." },
    ],
    available: "always",
  });

  return (
    <CopilotKit runtimeUrl="/api/copilotkit-byoc-hashbrown" agent="byoc_hashbrown">
      <CopilotChat
        // @ts-expect-error harness: doc bug — CopilotKit 1.73.3, 1.74.0 and 1.75.0 type this slot as typeof CopilotChatAssistantMessage, which a plain component does not satisfy
        messageView={{ assistantMessage: HashBrownAssistantMessage }}
      />
    </CopilotKit>
  );
}
