import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/voice" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Speech into the composer. The user speaks, the runtime transcribes,
          and the transcript is submitted like any typed message. What makes it
          interesting is that <code>&lt;CopilotChat&gt;</code> takes no voice
          props at all — it grows a mic button because the runtime it is pointed
          at advertises <code>audioFileTranscriptionEnabled: true</code> on{" "}
          <code>/info</code>. The feature is configured entirely on the server.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Click 🎙 Try a sample audio, then send",
              "Click the mic in the composer and speak (needs OPENAI_TRANSCRIPTION_API_KEY)",
            ]}
            expect="The sample button drops a question into the composer and the agent answers in one or two spoken-length sentences. With a key set, the mic records, transcribes, and auto-sends. Without a key there is no mic, and that is the intended state."
            fail="No mic button even though OPENAI_TRANSCRIPTION_API_KEY is set (restart after setting it), or basePath does not match the route directory."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="This is the one route that is not Google">
        <p>
          Gemini answers the chat, but transcription goes through OpenAI
          Whisper, so <code>GOOGLE_API_KEY</code> alone will not make the mic
          work. Set <code>OPENAI_TRANSCRIPTION_API_KEY</code> in{" "}
          <code>frontend/.env.local</code> to enable it. Without one,{" "}
          <code>createTranscriptionService()</code> returns{" "}
          <code>undefined</code>, the runtime reports transcription as
          disabled, and the mic is hidden. The route still runs, because the
          sample-audio button bypasses <code>/transcribe</code> entirely.
        </p>
      </Callout>

      <Panel
        title="The runtime"
        description="Three things force this onto its own endpoint rather than the app-wide one."
      >
        <SourceCode file="frontend/src/app/api/copilotkit-voice/[[...slug]]/route.ts" />
      </Panel>

      <Panel
        title="The transcription service"
        description="Built only when its own credential is set."
      >
        <SourceCode file="frontend/src/lib/transcription-service.ts" />
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/voice/demo-chat/page.tsx" },
            { file: "frontend/src/app/voice/sample-audio-button.tsx" },
          ]}
        />
      </Panel>

      <Panel title="Custom transcription backends">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <code>TranscriptionService</code> from{" "}
          <code>@copilotkit/runtime/v2</code> is an abstract class — subclass it
          for AssemblyAI, Deepgram, a self-hosted Whisper, anything.{" "}
          <code>TranscriptionServiceOpenAI</code> from{" "}
          <code>@copilotkit/voice</code> is the reference implementation, and
          this route builds it directly from the doc&apos;s factory.{" "}
          <code>transcribeFile</code> must return a plain string and let
          provider errors through unchanged, because the runtime classifies
          failures from them.
        </p>
      </Panel>

      <Callout tone="info" title="One extra hop on ADK">
        <p>
          Agent runs take one more step here than in a TypeScript integration.
          This route registers <code>voice-demo</code> as an{" "}
          <code>HttpAgent</code> pointed at{" "}
          <code>{"${AGENT_URL}"}/voice</code>, so the browser talks to{" "}
          <code>/api/copilotkit-voice</code> and the Next runtime forwards the
          run to the Python server&apos;s <code>/voice</code> endpoint.
        </p>
      </Callout>
    </>
  );
}
