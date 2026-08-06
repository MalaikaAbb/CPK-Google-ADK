"use client";

import {
  UseAgentUpdate,
  useAgent,
  useCopilotKit,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "workflow-execution";

// Only the slots the UI participates in. `resources` is deliberately absent:
// the agent writes it for its own use and the UI never reads it.
type AgentState = {
  question: string;
  answer: string;
};

/**
 * State split by purpose, driven without a chat component.
 *
 * question — the UI sets it
 * answer   — the UI reads it
 * resources — internal to the agent; nothing here touches it
 *
 * Worth being precise about: there is no filtering mechanism enforcing that
 * split. `resources` is on the wire like everything else. The separation is a
 * convention this UI upholds by simply not reading the slot.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/shared-state/workflow-execution"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <YourMainContent />
    </DemoFrame>
  );
}

function YourMainContent() {
  const [inputQuestion, setInputQuestion] = useState(
    "What's the capital of France?",
  );
  const [isLoading, setIsLoading] = useState(false);

  const { agent } = useAgent({
    agentId: AGENT_ID,
    updates: [UseAgentUpdate.OnStateChanged, UseAgentUpdate.OnRunStatusChanged],
  });
  const { copilotkit } = useCopilotKit();

  const state = agent.state as Partial<AgentState> | undefined;

  const askQuestion = async (newQuestion: string) => {
    setIsLoading(true);

    // Update the state with the new question, and clear the previous answer
    // so a stale one is never shown next to a fresh question.
    agent.setState({ ...agent.state, question: newQuestion, answer: "" });

    try {
      agent.addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: newQuestion,
      });
      await copilotkit.runAgent({ agent });
    } catch (error) {
      console.error("Error running agent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-full overflow-y-auto p-10">
      <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Q&A Assistant</h1>
      
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Enter your question..."
          style={{ 
            padding: "0.5rem", 
            width: "300px", 
            marginRight: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
        <button 
          onClick={() => askQuestion(inputQuestion)}
          disabled={isLoading || !inputQuestion.trim()}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: isLoading ? "#ccc" : "#0070f3",
            color: "white",
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Thinking..." : "Ask Question"}
        </button>
      </div>
      <div style={{ marginTop: "1.5rem" }}>
        <p><strong>Question:</strong> {agent.state?.question || "(none yet)"}</p>
        <p><strong>Answer:</strong> {agent.state?.answer || (isLoading ? "Thinking..." : "Waiting for question...")}</p>
      </div>
    </div>
    </main>
  );
}
