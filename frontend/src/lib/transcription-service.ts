// The doc's transcription factory, verbatim:
// https://docs.copilotkit.ai/google-adk/voice
//
// Returns `undefined` when `OPENAI_TRANSCRIPTION_API_KEY` is unset, so the
// runtime reports transcription as disabled, the composer hides its mic, and a
// direct POST to /transcribe gets the documented 503.
//
// `openai` must resolve to the same 5.x copy `@copilotkit/voice` uses: the
// `OpenAI` class has `#private` members, so an instance from another copy fails
// type-checking. This repo pins `openai@^5`, and npm dedupes it.
import { TranscriptionServiceOpenAI } from "@copilotkit/voice";
import { OpenAI } from "openai";

const OPENAI_TRANSCRIPTION_URL = "https://api.openai.com/v1";

export function createTranscriptionService(
  env: NodeJS.ProcessEnv = process.env,
): TranscriptionServiceOpenAI | undefined {
  const apiKey = env.OPENAI_TRANSCRIPTION_API_KEY;
  if (!apiKey) return undefined;

  return new TranscriptionServiceOpenAI({
    openai: new OpenAI({
      apiKey,
      baseURL: env.OPENAI_TRANSCRIPTION_BASE_URL ?? OPENAI_TRANSCRIPTION_URL,
    }),
  });
}
