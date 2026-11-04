import type { NextRequest } from "next/server";
import { createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

import { AGENT_URL } from "@/lib/agents";
import { buildRuntime } from "@/lib/copilot-runtime";
import { createTranscriptionService } from "@/lib/transcription-service";

// The voice route, per https://docs.copilotkit.ai/google-adk/voice
//
// Three things make it a separate endpoint from /api/copilotkit:
//
//  1. `transcriptionService` only exists on the **v2** runtime. The v1 wrapper
//     (`copilotRuntimeNextJSAppRouterEndpoint`) drops the option, so this uses
//     `createCopilotRuntimeHandler` from @copilotkit/runtime/v2 directly.
//  2. Setting it is what makes the runtime advertise
//     `audioFileTranscriptionEnabled: true` on /info — which is the only
//     reason the chat composer renders a mic button at all. The doc's
//     `createTranscriptionService()` returns `undefined` without
//     `OPENAI_TRANSCRIPTION_API_KEY`, so with no key there is no mic.
//  3. The `[[...slug]]` catch-all lets the v2 runtime own its own sub-routing
//     (/info, /agent/:id/run, /transcribe) under this base path, so `basePath`
//     below must match this file's directory.
//
// The agent hop is one longer here than elsewhere: the browser talks to
// /api/copilotkit-voice, and this runtime forwards `voice-demo` runs to the
// Python server's /voice endpoint.

const voiceDemoAgent = new HttpAgent({ url: `${AGENT_URL}/voice` });

let cachedHandler: ((req: Request) => Promise<Response>) | null = null;

function getHandler(): (req: Request) => Promise<Response> {
  if (cachedHandler) return cachedHandler;

  // Shares `buildRuntime`, so Intelligence and per-user threads work here too;
  // `transcriptionService` is the one option unique to this endpoint.
  const runtime = buildRuntime({
    agents: {
      "voice-demo": voiceDemoAgent,
      default: voiceDemoAgent,
    },
    transcriptionService: createTranscriptionService(),
  });

  cachedHandler = createCopilotRuntimeHandler({
    runtime,
    basePath: "/api/copilotkit-voice",
  });
  return cachedHandler;
}

export const POST = (req: NextRequest) => getHandler()(req);
export const GET = (req: NextRequest) => getHandler()(req);
export const PUT = (req: NextRequest) => getHandler()(req);
export const PATCH = (req: NextRequest) => getHandler()(req);
export const DELETE = (req: NextRequest) => getHandler()(req);
