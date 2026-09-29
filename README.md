# CopilotKit + Google ADK Test Suite

A navigable, working test harness for the CopilotKit Google ADK integration — each doc page is a route that actually runs the thing it describes.

| | |
|---|---|
| **Doc sync date** | Machine-maintained — `doc-snapshot/manifest.json` → `syncedAt`, rewritten on every sync |
| **CopilotKit packages** | `@copilotkit/react-core` 1.66.2 · `@copilotkit/runtime` 1.66.2 · `@copilotkit/a2ui-renderer` 1.66.2 · `@copilotkit/voice` 1.66.2 |
| **AG-UI packages** | `@ag-ui/client` 0.0.57 · `ag-ui-adk` 0.7.0 |
| **ADK packages** | `google-adk` 2.6.2 · `google-genai` 2.16.0 |
| **Frontend** | Next.js 16.3.0 (App Router) · React 19.2 · TypeScript · Tailwind 4 |
| **Backend** | Python 3.10+ · FastAPI 0.141 · Uvicorn 0.52 |
| **Build status** | No CI. `tsc` ❌ · `next build` ❌ — both red by design: `/shared-state/predictive-state-updates` ships the doc's non-compiling sample verbatim (§8, §9 item 9). Every other route typechecks and lints ✅; agent server boots with all 28 agents mounted ✅ |

---

## 2. Overview

[Google's Agent Development Kit](https://google.github.io/adk-docs/) is a Python framework for building agents. The `ag-ui-adk` bridge exposes an ADK `LlmAgent` over the [AG-UI protocol](https://ag-ui.com), which is what lets a React app drive it with streaming, tool calls, shared state and generative UI.

This repo covers a **scoped set of 35 doc pages** (§8). Each route implements what its page teaches and shows the exact source that makes it work, read off disk at render time.

**Everything comes from the documentation.** Where a page defined an agent, tool or callback, it is reproduced. Where a page *named* something it never printed, §9 lists exactly what was filled in and why — that list is short and complete.

Tracks: **<https://docs.copilotkit.ai/google-adk>**

---

## 3. Architecture

```
Browser (React 19)
  │  @copilotkit/react-core/v2 — CopilotKitProvider, CopilotChat, hooks
  │  GET/POST/PATCH/DELETE /api/copilotkit/**
  ▼
Next.js 16 App Router  ·  localhost:3000
  │  Copilot Runtime (@copilotkit/runtime)
  │  agents: one HttpAgent per registered id
  │  POST http://localhost:8000/<agent-id>
  ▼
FastAPI + ag-ui-adk  ·  localhost:8000          ← Python, a genuinely separate process
  │  ADKAgent wrapping a google.adk LlmAgent, mounted once per agent
  ▼
Gemini  (gemini-2.5-flash)
```

**The backend is Python, so there really are two processes.** This is the main structural difference from the TypeScript integrations (Mastra, LangGraph TS), where the agent can be imported into the Next process. Here it cannot, and the split is visible in every route: an `HttpAgent` on one side, `add_adk_fastapi_endpoint` on the other.

### Three runtime endpoints

Most routes use one. Two doc pages need configuration the main endpoint cannot carry:

| Endpoint | Why it exists |
|---|---|
| `/api/copilotkit/[[...slug]]` | All 28 agents. Sets `a2ui: { injectA2UITool: false, agents: ["a2ui-fixed-schema"] }` — that agent owns its own `display_flight` tool and must not also be handed `generate_a2ui`. |
| `/api/copilotkit-voice/[[...slug]]` | `transcriptionService` exists only on the **v2** runtime; the v1 wrapper drops it. The catch-all lets the v2 handler own its sub-routing (`/info`, `/transcribe`, `/agent/:id/run`). |
| `/api/copilotkit-declarative-gen-ui/[[...slug]]` | Needs A2UI tool injection **on**, which the main runtime turns off. |

All three are the **v2** runtime and share `frontend/src/lib/copilot-runtime.ts`, so CopilotKit Intelligence and per-user threads are configured once. Each is a catch-all route (`[[...slug]]`) because the handler serves a subtree — `/info`, agent runs, and thread list/rename/delete — and exports four verbs, not one: `GET` serves `/info` and the thread list, `POST` runs agents, `PATCH`/`DELETE` rename, archive and delete threads.

### CopilotKit Intelligence

Two credentials that do different jobs and fail differently:

| Variable | What it does | Without it |
|---|---|---|
| `INTELLIGENCE_API_KEY` | Puts the runtime in Intelligence mode — threads persist, thread endpoints return real rows. Server-side only. | Runtime falls back to SSE with an in-memory runner. Chat still works everywhere; the Rich Threads routes have nothing to list. |
| `COPILOTKIT_LICENSE_TOKEN` *or* `NEXT_PUBLIC_COPILOTKIT_PUBLIC_LICENSE_KEY` | Advertises a licence. `/info` reports `licenseStatus` from it, and client-side feature UIs read that field. | `<CopilotThreadsDrawer>` renders its locked Upgrade view **even when threads work perfectly**. |

`identifyUser` is required alongside `intelligence` — threads are per-user, so without it every visitor shares one history. The harness sends a fixed demo identity from the provider as `x-user-id` / `x-user-name`; override with `NEXT_PUBLIC_DEMO_USER_ID` to watch two thread lists diverge.

### The 28 agents

One per route rather than one shared agent, because several routes need different tools, different callbacks, or a conversation that does not bleed into the next route's. Registered in `backend/src/agents/registry.py`, where the key is both the AG-UI agent id and the FastAPI path it is mounted at.

| Group | Agents |
|---|---|
| Quickstart | `my_agent` |
| Prebuilt components | `agentic_chat` · `prebuilt-sidebar` · `prebuilt-popup` · `chat-controls` |
| Look and feel | `chat-customization-css` · `chat-slots` · `headless-simple` · `headless-complete` |
| Reasoning (thinking enabled) | `reasoning-default` · `reasoning-custom` |
| Input modalities | `multimodal` · `voice` |
| Generative UI | `tool-rendering` · `gen-ui-tool-based` · `a2ui-fixed-schema` · `declarative-gen-ui` |
| App control | `frontend_tools` · `hitl-in-chat` · `programmatic-control` |
| Shared state | `shared-state-read-write` · `shared-state-streaming` · `readonly-state-agent-context` · `shared-state-language` · `predictive-state-updates` · `workflow-execution` |
| Multi-agent | `subagents` |
| Agent config | `agent-config` |

Ids follow each doc page's own demo id where it names one (`my_agent`, `agentic_chat`, `frontend_tools`, `prebuilt-sidebar`), which is why the casing is inconsistent — that inconsistency is the docs'.

---

## 4. Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 20+ | Next.js 16 requires it. |
| npm | 10+ | Or pnpm/yarn/bun. |
| Python | 3.10+ | `ag-ui-adk` 0.7.0 requires `>=3.10,<3.15`. |
| `uv` | any recent | Used for the backend venv. `pip` works too — see §5. |
| Google Gemini API key | — | **Required.** <https://aistudio.google.com/apikey> |
| OpenAI API key | — | Optional. Only the mic on `/voice` uses it. |

| CopilotKit Intelligence key | — | Optional. Only the three Rich Threads routes need it; everything else runs without. <https://dashboard.operations.copilotkit.ai/> |

Every chat route works with only a Gemini key. Intelligence is what makes threads persist — see §3.

---

## 5. Setup

```bash
git clone <this-repo> google-adk && cd google-adk
```

**1. Backend**

```bash
cd backend
uv venv
uv pip install -e .
```

<details>
<summary>Without <code>uv</code></summary>

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -e .
```
</details>

**2. Frontend**

```bash
cd ../frontend
npm install
```

Plain `npm install` — no `--legacy-peer-deps`. (If you bump `zod` to 4 it will start failing; see §9.)

**3. Environment**

```bash
cd ..
cp .env.example backend/.env
cp .env.example frontend/.env.local
```

`.env.example` is annotated per variable and marks which block belongs to which file. The only one you must fill in is `GOOGLE_API_KEY` in `backend/.env`.

| Variable | Where | What it does |
|---|---|---|
| `GOOGLE_API_KEY` | `backend/.env` | **Required.** Read by every ADK agent, server-side. Never reaches the browser. |
| `AGENT_HOST` / `AGENT_PORT` | `backend/.env` | Where the agent server listens. Defaults `localhost:8000`. |
| `LOG_LEVEL` | `backend/.env` | Uvicorn/ADK log level. Defaults `INFO`. |
| `GOOGLE_GEMINI_BASE_URL` | `backend/.env` | Optional Gemini proxy. Only Sub-Agents reads it. |
| `AGENT_URL` | `frontend/.env.local` | Where the Next runtime forwards runs. Defaults `http://localhost:8000`. |
| `OPENAI_API_KEY` | `frontend/.env.local` | Optional. Whisper transcription for the `/voice` mic only. |
| `INTELLIGENCE_API_KEY` | `frontend/.env.local` | Optional. Puts the runtime in Intelligence mode so threads persist. Server-side — never prefix it `NEXT_PUBLIC_`. |
| `COPILOTKIT_LICENSE_TOKEN` | `frontend/.env.local` | Optional. Advertises a licence so the Threads Drawer renders its real UI instead of the locked Upgrade view. |
| `NEXT_PUBLIC_COPILOTKIT_PUBLIC_LICENSE_KEY` | `frontend/.env.local` | Optional. The client-side half of the same licence axis; either this or the token above works. |
| `NEXT_PUBLIC_DEMO_USER_ID` / `_NAME` | `frontend/.env.local` | Optional. The identity `identifyUser` keys threads on. Change to watch two thread lists diverge. |
| `NEXT_PUBLIC_COPILOTKIT_INSPECTOR` | `frontend/.env.local` | Optional. Set to `off` to disable the Inspector app-wide. Otherwise on for localhost only. |

**Default ports:** frontend **3000**, agent server **8000**.

---

## 6. Running the project

Two processes, two terminals. There is no combined dev script — the CLI's `create` template ships one, but this repo was not scaffolded from it.

**Terminal 1 — the agent server**

```bash
cd backend
GOOGLE_API_KEY=... PYTHONPATH=src .venv/bin/python src/agent_server.py
```

or, with the key already in `backend/.env`:

```bash
cd backend && uv run --env-file .env python src/agent_server.py
```

Success looks like:

```
INFO:__main__:Mounted 28 agents: a2ui-fixed-schema, agent-config, agentic_chat, ...
INFO:     Started server process [12345]
INFO:     Uvicorn running on http://localhost:8000 (Press CTRL+C to quit)
```

Confirm every agent mounted:

```bash
curl -s localhost:8000/health | python3 -m json.tool
# → { "status": "ok", "agents": [...], "count": 28 }
```

**Terminal 2 — the frontend**

```bash
cd frontend
npm run dev
```

```
▲ Next.js 16.3.0
- Local:   http://localhost:3000
✓ Ready in 1.2s
```

Open **<http://localhost:3000>**.

If chats fail immediately, the usual cause is the agent server not running or `GOOGLE_API_KEY` missing from *its* environment — the key belongs to the Python process, not the Next one.

---

## 7. What to expect — walkthrough per section

### How each route is split

| | |
|---|---|
| **`<route>`** | Notes, pass/fail criteria, and **the exact source**, read off disk at render time. No live chat. |
| **`<route>/demo-chat`** | Just the running feature, no chrome — built for screen recording. Reached via **Open demo ↗**, which always opens a new tab. |

Code on a page is never a re-typed approximation: each page reads real files via `src/lib/source.ts` and syntax-highlights them with Shiki at build time. Excerpts use `#region` markers that stay visible in the source.

### Getting Started

**`/`** — Orientation, the architecture diagram, and the live agent roster.

**`/quickstart`** — An ADK `LlmAgent` behind `ag-ui-adk`, reached over HTTP. **Try:** `Can you tell me a joke?` **Pass:** tokens stream. **Fail:** an error banner — check the Python server and its `GOOGLE_API_KEY`. The demo mounts the doc's `Providers` (`agent="my_agent"`, `useSingleEndpoint={false}`), so its threads belong to the `anonymous` user rather than the harness demo user.

### Rich Threads

All three need `INTELLIGENCE_API_KEY` for real rows, and a licence for the drawer to render anything but its locked view — see §3.

**`/prebuilt-components/copilot-threads-drawer`** — The drop-in conversation sidebar, wired with **no active-thread state of your own**. **Try:** send a message, press New Conversation, send another, then click back to the first row. **Pass:** two auto-named rows; clicking one replays that conversation. **Fail:** a locked "Threads are a CopilotKit Intelligence feature" panel — that is the licence check, not the runtime.

**`/headless-threads`** — The same data through `useThreads` with a hand-built list, including **rename**, which the drawer omits. **Try:** press Rename on a row. **Pass:** the row relabels and survives a reload. **Fail:** rename/archive/delete do nothing — in SSE mode `/info` reports `mutations: false`.

**`/threads-lifecycle`** — Where a `threadId` comes from and what moves it. **Try:** press New chat, then pick a conversation and press Open conversation vs Set id, no replay. **Pass:** the readout's `threadId` and `explicit` fields change, and only the explicit open replays history. **Fail:** the readout moves but the chat never replays — replay needs a server-side store.

### Prebuilt Components

**`/prebuilt-components/chat`** — `<CopilotChat>`, the primitive the other two wrap. **Pass:** suggestion pills render before the first message; clicking one sends it.

**`/prebuilt-components/sidebar`** — Docked, and a *sibling* of your content. **Pass:** the toggle collapses and restores it and the main column never reflows. **Fail:** the layout jumps — that is popup behaviour.

**`/prebuilt-components/popup`** — Overlays instead of docking. **Pass:** the placeholder reads "Ask the popup anything…" (from `labels`) and the cards behind never shift.

**`/prebuilt-components/chat-controls`** — `useCopilotChatConfiguration` for modal state, plus thumbs up/down. **Try:** press **Ask the assistant**, send a message, rate the reply. **Pass:** both buttons open the closed sidebar, the toggle's label flips, and rating appends a row with that message's id. **Fail:** the buttons do not render — no provider in the tree owns modal state.

### Custom Look and Feel

**`/custom-look-and-feel/css`** — v2 shadcn tokens plus `.copilotKit*` class hooks, scoped to one wrapper. **Pass:** warm parchment surface, square corners, your messages in mono with a `→` marker.

**`/custom-look-and-feel/slots`** — All three override levels at once. **Pass:** a gradient welcome panel before sending; afterwards each reply sits in a tinted card with a "slot" badge, the composer is pre-focused, and the disclaimer is custom.

**`/custom-look-and-feel/markdown`** — The `markdownRenderer` slot in three forms (Streamdown `components` map, class string, full replacement) plus the default, switchable on one chat that uses the `chat-slots` agent. **Try:** ask for a `## Links` heading followed by a markdown link. **Pass:** in *components* mode the heading is uppercase with an orange left rule, the link is orange with a wavy underline, and the `<a>` keeps `target="_blank"` but has no `data-streamdown` or `node` attribute. *class-string* makes the block smaller. *replace* shows the raw markdown in a `<pre>`. **Fail:** all modes look the same, or `node="[object Object]"` shows up on the `<a>`.

**`/custom-look-and-feel/headless-ui`** — A chat with zero CopilotKit components. **Pass:** tokens stream into hand-written bubbles.

**`/custom-look-and-feel/reasoning-messages`** — Default card vs. two replaced sub-slots, toggleable. **Try:** a question needing real working (see the page). **Pass:** a reasoning card streams above the answer. **Fail:** no card — Gemini did not deliberate on that prompt; ask something harder.

### Input Modalities

**`/multimodal-attachments`** — `attachments={{ enabled: true }}`. **Try:** attach a screenshot and ask what is in it; then attach a `.zip`. **Pass:** the reply describes the actual image; the `.zip` never sends and an amber banner names it `invalid-type`. **Fail:** the reply describes the filename — the model got text, not an image part.

**`/voice`** — A second runtime carrying a `TranscriptionService`. **Try:** the 🎙 sample-audio button. **Pass:** text lands in the composer and the agent answers in spoken-length prose. The mic itself needs `OPENAI_API_KEY`. **Fail:** no mic button at all — the runtime has no transcription service or `basePath` is wrong.

### Generative UI

**`/generative-ui/reasoning`** — The whole reasoning card replaced. **Pass:** an always-open banner tagged "Reasoning" rather than a collapsible card.

**`/generative-ui/tool-based`** — `useComponent` registering a bar chart as a tool. **Try:** `Chart the number of days in each month of 2026`. **Pass:** a chart renders inline and the reply does not repeat the numbers.

**`/generative-ui/tool-rendering`** — A named renderer for `get_weather` plus a wildcard. **Try:** `What's the weather in Tokyo?` **Pass:** a card shows "Calling weather API…" then fills in with 68°, Sunny.

**`/generative-ui/state-rendering`** — A document assembling live beside the chat. **Try:** `Write a short blog post about…` **Pass:** the left pane fills progressively with a LIVE badge; the text never appears as a chat message.

**`/generative-ui/a2ui/dynamic-schema`** — A secondary LLM designs the whole surface. **Try:** `Build me a dashboard for a SaaS company's Q3…` **Pass:** cards, metric tiles, a table and a chart, assembled differently each prompt. **Fail:** a wall of JSON — the middleware is not attached.

**`/generative-ui/a2ui/fixed-schema`** — A flight card from a JSON schema. **Try:** `Find me a flight from SFO to JFK`. **Pass:** an itinerary card with both airport codes, an airline badge, a price and a Book button. **Fail:** raw JSON — the `catalogId` does not match.

**`/generative-ui/open-generative-ui`** — The agent writes a sandboxed HTML/CSS/JS page that streams into an iframe in the chat. It runs on its own runtime at `/api/copilotkit-ogui`, with *minimal* and *advanced* modes. **Try:** `build me a simple greeting card`. In *advanced*, ask for a calculator that calls `evaluateExpression`. **Pass:** an iframe preview fills in progressively. In *advanced*, the browser console logs `[open-gen-ui/advanced] evaluateExpression …`. **Fail:** a plain text reply. The agent has no page-specific prompt, so ask for a UI explicitly.

**`/generative-ui/json-render`** — ❌ Broken by design. All the code the page leaves out is written in: the three parse/validate helpers, the dashboard components, the runtime route, and an agent that replies with a `{ root, elements }` spec. The page's `<Renderer spec catalog>` call is left as published. **Try:** `Show me a sales dashboard.` **Expected:** once a valid root element has streamed in, the renderer throws, most likely `useVisibility must be used within a VisibilityProvider` (the page never adds `JSONUIProvider`). **Unexpected:** no error and no output. The reply never became a valid spec, so check the raw reply in the Inspector. Switch to **fixed** for the working version: the same prompt should render metric cards and a chart with no error.

**`/generative-ui/hashbrown`** — ❌ Broken by design. The missing components, runtime route and agent are written in, and the page's `useJsonParser` / `useUiKit` calls are left as published. **Try:** `Show me a sales dashboard.` **Expected:** the first assistant message throws `TypeError: Cannot read properties of undefined (reading 'forEach')` from `useUiKit`, which got no `components`. **Unexpected:** a reply renders cleanly. That would mean the installed Hashbrown accepts the page's calls, so re-check the route.

### App Control

**`/frontend-tools`** — `change_background` executing in the browser. **Try:** `Make the background a warm sunset gradient`. **Pass:** the page recolours and the CSS value under the heading updates.

**`/human-in-the-loop`** — `useHumanInTheLoop` suspending the run. **Try:** `Book an intro call with the sales team`. **Pass:** a picker renders and **nothing further streams** until you choose; the card then collapses to a green "Booked" badge naming your slot.

**`/human-in-the-loop/governed-actions`** — `approve_governed_action`, a `useHumanInTheLoop` tool that shows the doc's approval card and acts on the action's verdict. **Try:** `Use approve_governed_action to apply a 30% discount to account NW-8812, verdict require_approval.` **Pass:** a card reading "User approval required" shows the summary, tool, reference and arguments. The run waits until you press Approve or Reject, then the agent replies. **Fail:** a prose reply with no card. The model decides when to call the tool, so name it explicitly.


**`/programmatic-control`** — The doc's `headless-complete` send pipeline, run verbatim against this repo's agent. **Try:** press the second suggestion, then **Stop** mid-stream. **Pass:** status flips to Running, the transcript grows and follows the bottom, Stop halts it. ⚠️ Two of the three helpers its snippet destructures are never defined in the docs — see §9.

### Shared State

**`/shared-state`** — Both directions at once. **Try:** introduce yourself, then change Tone/Detail and ask a question. **Pass:** the scratch pad fills, and the next reply visibly changes register — the write side steers the model, not just the panel.

**`/shared-state/rendering-in-app`** — The same state as a main-view canvas. **Pass:** cards appear in the main view; clicking one removes it and the agent agrees it is gone.

**`/shared-state/streaming`** — `PredictStateMapping` forwarding a tool argument mid-generation. **Pass:** the document fills a few words at a time. **Fail:** one jump at the end — the mapping is not in effect.

**`/shared-state/agent-readonly`** — `useAgentContext` as a one-way channel. **Try:** `Who am I and what have I been doing?` **Pass:** the agent answers from the panel and refuses to change those values.

**`/shared-state/in-app-agent-read`** — Reading `agent.state.language`. **Try:** `Switch to Spanish`. **Pass:** the panel updates and replies switch language.

**`/shared-state/in-app-agent-write`** — `setState`, with and without a re-run. **Try:** **Toggle Language**, then `tell me a joke`. **Pass:** the joke comes back in the new language.

**`/shared-state/workflow-execution`** — State split by purpose. **Pass:** question fills immediately, answer fills after `answer_question`, resources stays placeholder.

**`/shared-state/predictive-state-updates`** — ❌ **Does not compile, on purpose.** The demo holds the doc's sample verbatim, and that sample calls `useAgent({ render })`, which is not a real prop. It is kept as published so the discrepancy is visible in code rather than only in prose. Everything else about the route — the `step_progress` agent, the state slot — is in place and works; only the frontend sample is broken.

### Multi-Agent

**`/multi-agent/subagents`** — Supervisor → research → write → critique. **Try:** `Write a short paragraph explaining why agent-native UIs beat chatbots`. **Pass:** three log cards in order with role chips lighting up. **Fail:** the log stays empty, or one sub-agent fires repeatedly.

### Agent Config

**`/agent-config`** — A typed config object published as runtime context. **Try:** ask the same question at `expertise=beginner` and then `expert`. **Pass:** visibly different answers. **Fail:** identical answers — the context is not reaching the callback.

**`/agent-app-context`** — `useAgentContext` sends three colleagues, and the doc's `InstructionProvider` renders them into the ADK prompt. **Try:** `Who are my colleagues?`, then `Draft an email to Alice in finance`. **Pass:** exactly John Doe, Jane Smith and Bob Wilson with their roles. Alice is reported as not in the list. **Fail:** invented colleagues, or "the page sent no colleagues".

### Observe & Operate

**`/inspector`** — The debugging overlay, mounted by the provider and therefore present on *every* route. **Try:** open it from the bottom-left button, then `highlight the churn panel`. **Pass:** AG-UI events stream, Frontend Tools already lists `highlight_panel` with its schema, Context shows the page's two entries, Agent State fills once the agent takes notes. **Fail:** no button at all — the provider is missing `showDevConsole`, or you are not on `localhost`/`127.0.0.1`.

### Backend

**`/backend/copilot-runtime`** — This repo's live runtime config plus a raw AG-UI capture. **Try:** `Hello`. **Pass:** `RUN_STARTED` → `TEXT_MESSAGE_START` → a delta counter climbing → `RUN_FINISHED`.

**`/status`** — Every route in one table.

---

## 8. Testing checklist / current status

| Doc page | Route | Status | Notes |
|---|---|---|---|
| `/google-adk` | `/` | 📖 Reference | Orientation + agent roster. |
| `/google-adk/quickstart?agent=bring-your-own` | `/quickstart` | ✅ Working | Demo runs on the doc's own `providers.tsx` (verbatim, via a route `layout.tsx`), not the app-wide provider. |
| `/google-adk/prebuilt-components/copilot-threads-drawer` | `/prebuilt-components/copilot-threads-drawer` | ⚠️ Partial | Needs Intelligence mode for rows **and** a licence for the drawer to render unlocked — two separate switches. |
| `/google-adk/headless-threads` | `/headless-threads` | ⚠️ Partial | Needs Intelligence mode. In SSE mode `/info` reports `mutations: false`, so rename/archive/delete have no endpoint. |
| `/google-adk/threads-lifecycle` | `/threads-lifecycle` | ⚠️ Partial | Switch and start are live in either mode; history replay needs a server-side store, so it is inert in SSE mode. |
| `/google-adk/prebuilt-components/chat` | `/prebuilt-components/chat` | ✅ Working | |
| `/google-adk/prebuilt-components/sidebar` | `/prebuilt-components/sidebar` | ✅ Working | |
| `/google-adk/prebuilt-components/popup` | `/prebuilt-components/popup` | ✅ Working | |
| `/google-adk/prebuilt-components/chat-controls` | `/prebuilt-components/chat-controls` | ✅ Working | |
| `/google-adk/custom-look-and-feel/css` | `/custom-look-and-feel/css` | ✅ Working | v2 tokens; the page's `--copilot-kit-*` set is v1 and inert here. |
| `/google-adk/custom-look-and-feel/slots` | `/custom-look-and-feel/slots` | ✅ Working | |
| `/google-adk/custom-look-and-feel/markdown` | `/custom-look-and-feel/markdown` | ⚠️ Partial | Not yet checked in a browser. `my-link`/`my-heading` CSS is harness-only because the doc never defines those classes. |
| `/google-adk/custom-look-and-feel/headless-ui` | `/custom-look-and-feel/headless-ui` | ✅ Working | Minimal example; the "complete" one is not reimplemented. |
| `/google-adk/custom-look-and-feel/reasoning-messages` | `/custom-look-and-feel/reasoning-messages` | ✅ Working | Needs Gemini thinking, which no doc page enables. This repo does. |
| `/google-adk/multimodal-attachments` | `/multimodal-attachments` | ✅ Working | |
| `/google-adk/voice` | `/voice` | ✅ Working | Mic needs `OPENAI_API_KEY`; sample-audio button works without. |
| `/google-adk/generative-ui/reasoning` | `/generative-ui/reasoning` | ✅ Working | Same thinking dependency. |
| `/google-adk/generative-ui/tool-based` | `/generative-ui/tool-based` | ✅ Working | |
| `/google-adk/generative-ui/tool-rendering` | `/generative-ui/tool-rendering` | ✅ Working | `get_weather` only — the page defines no other backend tool. |
| `/google-adk/generative-ui/state-rendering` | `/generative-ui/state-rendering` | ✅ Working | Shares the streaming agent, as the docs do. |
| `/google-adk/generative-ui/a2ui/dynamic-schema` | `/generative-ui/a2ui/dynamic-schema` | ✅ Working | Catalog is the doc's; leaf UI primitives are this repo's. |
| `/google-adk/generative-ui/a2ui/fixed-schema` | `/generative-ui/a2ui/fixed-schema` | ✅ Working | Book button inert — Python SDK has no `action_handlers`. |
| `/google-adk/generative-ui/open-generative-ui` | `/generative-ui/open-generative-ui` | ⚠️ Partial | Not yet checked in a browser. Page publishes no agent, leaves `headers`/`Chat`/`VISUALIZATION_DESIGN_SKILL`/`./suggestions` undefined, and cuts off the advanced snippet (§9 #22). |
| `/google-adk/generative-ui/json-render` | `/generative-ui/json-render` | ❌ Broken | As published it throws (§9 #25). A working “fixed” mode sits alongside, not yet checked in a browser. |
| `/google-adk/generative-ui/hashbrown` | `/generative-ui/hashbrown` | ❌ Broken | By design: missing code written in, hook calls left as published so the runtime error shows (§9 #26). |
| `/google-adk/frontend-tools` | `/frontend-tools` | ✅ Working | |
| `/google-adk/human-in-the-loop` | `/human-in-the-loop` | ✅ Working | |
| `/google-adk/human-in-the-loop/governed-actions` | `/human-in-the-loop/governed-actions` | ⚠️ Partial | Not yet checked in a browser. Only the `useHumanInTheLoop` half runs; `useInterrupt` can't fire on ADK (§9 #23). |
| `/google-adk/programmatic-control` | `/programmatic-control` | ⚠️ Partial | Runs the doc's `headless-complete` snippet; two of the three helpers it destructures are undefined in the docs and reconstructed here. Interrupt-resume half does not apply. |
| `/google-adk/shared-state` | `/shared-state` | ✅ Working | |
| `/google-adk/shared-state/rendering-in-app` | `/shared-state/rendering-in-app` | ✅ Working | |
| `/google-adk/shared-state/streaming` | `/shared-state/streaming` | ✅ Working | |
| `/google-adk/shared-state/agent-readonly` | `/shared-state/agent-readonly` | ✅ Working | |
| `/google-adk/shared-state/in-app-agent-read` | `/shared-state/in-app-agent-read` | ✅ Working | |
| `/google-adk/shared-state/in-app-agent-write` | `/shared-state/in-app-agent-write` | ✅ Working | |
| `/google-adk/shared-state/workflow-execution` | `/shared-state/workflow-execution` | ✅ Working | `resources` is separated by convention, not enforcement. |
| `/google-adk/shared-state/predictive-state-updates` | `/shared-state/predictive-state-updates` | ❌ Broken | **Deliberate.** Ships the doc's sample verbatim, including `useAgent({ render })` — a prop that does not exist. Kept as published rather than patched, so it does not compile. See §9 item 9. |
| `/google-adk/multi-agent/subagents` | `/multi-agent/subagents` | ✅ Working | |
| `/google-adk/agent-config` | `/agent-config` | ✅ Working | |
| `/google-adk/agent-app-context` | `/agent-app-context` | ⚠️ Partial | Not yet checked in a browser. Frontend and agent are verbatim; the tool example is a stub (§9 #24). |
| `/google-adk/inspector` | `/inspector` | ✅ Working | Four of five tabs work locally. Threads is the default tab and needs an Intelligence Platform key. |
| `/google-adk/backend/copilot-runtime` | `/backend/copilot-runtime` | ✅ Working | |

**Legend:** ✅ Working · ⚠️ Partial · 📖 Reference · 🚧 Not started · ❌ Broken

> **Deliberately not covered:** `/google-adk/human-in-the-loop/useInterrupt`. `useInterrupt` has no meaning on ADK — there is no `interrupt(...)` primitive for it to listen to, the page's own ADK demo silently falls back to `useHumanInTheLoop`, and three of its Python snippet regions render as `snippet skipped: … missing in google-adk`. A route here would have been a duplicate of Human in the Loop wearing a misleading name, so it was removed along with its agent.

> **Caveat on "Working":** every route *except* Predictive state updates typechecks, lints and renders, and the agent server boots with all 28 agents mounted. Predictive state updates is red on purpose — see its row. Note that one non-compiling file fails `tsc` and `next build` for the whole app, so those two commands stay red while it is kept as published.
>
> Individual agent *behaviours* — particularly the two A2UI routes and reasoning, which depend on model cooperation — have not each been driven end-to-end against a live Gemini key.

---

## 9. Known issues / doc-vs-implementation discrepancies

Found against `@copilotkit/react-core` 1.66.2, `@copilotkit/runtime` 1.66.2, `ag-ui-adk` 0.7.0 and `google-adk` 2.6.2.

### Things the docs reference but never define

**1. `agents.shared_chat` does not exist anywhere in the docs**
Ten Python snippets open with `from agents.shared_chat import get_model, stop_on_terminal_text`. Neither function appears on any page, and `stop_on_terminal_text` is not exported by `ag-ui-adk` either. It matters: without it Gemini re-calls the same tool indefinitely after a successful result, because no native termination condition fires. `backend/src/agents/shared_chat.py` supplies it. `get_model` is not reproduced — the Quickstart is the only page that names a model, so every agent inlines `gemini-2.5-flash` directly.

**2. Three `before_model_callback` bodies are named but not printed**
[Shared State](https://docs.copilotkit.ai/google-adk/shared-state) shows `before_model_callback=_inject_preferences` and `tools=[set_notes, …]`; [Agent read-only context](https://docs.copilotkit.ai/google-adk/shared-state/agent-readonly) shows `before_model_callback=_inject_context`; [Agent Config](https://docs.copilotkit.ai/google-adk/agent-config) shows `before_model_callback=_inject_config`. All four function bodies are absent. Each is written here to the shape its page describes in prose.

**3. `build_system_prompt` is called but never defined**
The Agent Config page's sample calls it on every turn. Its wording here is this repo's; only its job — turn three fields into directives — comes from the page.

**4. The A2UI schema files are never shown**
`flight_schema.json` and `booked_schema.json` are loaded by the fixed-schema agent and printed nowhere. They were supplied directly rather than derived from the page's component-tree diagram.

**5. Both A2UI catalogs import primitives from an unshown directory**
`renderers.tsx` on both pages imports `Card`, `Badge`, `Button`, `Separator`, `CardShell`, `CHART_COLORS` and a colour constant `c` from a sibling `_components/`. Rebuilt in `frontend/src/app/generative-ui/a2ui/_components/primitives.tsx`, which is the only invented UI in either route and is flagged on both route pages.

**6. No ADK agent in the docs emits reasoning tokens**
Both reasoning pages describe `REASONING_MESSAGE_*` events and name their demo agents, but neither shows an agent that would produce any. Reasoning does not arrive by itself — Gemini has to be asked. `build_thinking_chat_agent` sets `include_thoughts=True` and `thinking_budget=-1`.

**7. `useAgenticChatSuggestions()` is not exported by anything**
The CopilotChat page's sample calls it. It is local to CopilotKit's own demo app and wraps `useConfigureSuggestions`, which *is* exported. Called directly here.

### Things the docs get wrong

**8. The context state key is wrong for ADK**
Both the read-only-context and Agent Config pages read context from `state["copilotkit"]["context"]`. In `ag-ui-adk` 0.7.0 entries arrive under `state["_ag_ui_context"]`, exported as `CONTEXT_STATE_KEY`, each shaped `{ description, value }`. Reading the documented path returns nothing at all, silently. This repo imports the constant.

**9. `useAgent` has no `initialState` and no `render`**
Both shared-state read/write pages seed with `useAgent({ agentId, initialState })`, and both that page and Predictive State Updates pass a `render` function. `UseAgentProps` in 1.66.2 admits exactly two shapes and neither includes either field. Defaults are applied in the render instead; for state inside the transcript, register a renderer for the tool that writes it.

**10. `useHumanInTheLoop` does not infer its argument type**
Unlike `useRenderTool`, it defaults to `Record<string, unknown>`, so `args.topic` is `unknown` and unusable in JSX. The docs sidestep this by typing the render props `any`; both HITL routes here supply the generic explicitly.

**11. The HITL agent is instructed to call a tool its own page never registers**
[Human in the Loop](https://docs.copilotkit.ai/google-adk/human-in-the-loop)'s Python tells the model to call `generate_task_steps`; its frontend registers `book_call`. The agent here is instructed to call the tool that exists.

**12. `@copilotkit/react-ui` in the Quickstart's install line**
It is the v1 package and nothing on that page imports from it. Not a dependency here. Likewise the CSS page's `CopilotKitCSSProperties` helper and the whole `--copilot-kit-*` variable set — all v1, inert against v2 components.

**13. Several pages' Python is another framework's**
Agent Config prints its config-reading half as a LangGraph node. The dynamic-schema page's opt-out section builds the A2UI tool with `ag_ui_langgraph.get_a2ui_tools` and a `ChatOpenAI` model. The `useInterrupt` page's ADK variant has three snippet regions that render as `<!-- snippet skipped: region … missing in google-adk -->` in the source markdown — there was nothing to reproduce and nothing was invented in their place.

**14. Sub-agents uses a different model from every other page**
It sets `_SUB_MODEL = "gemini-3.1-flash-lite"` while the Quickstart says `gemini-2.5-flash`. This repo names one model anywhere.

### Package-level

**15. `zod` must be 3.x, not 4.x**
`@copilotkit/a2ui-renderer` 1.66.2 depends on `zod ^3.25.75` and types `CatalogComponentDefinition.props` as a zod 3 `ZodObject`. With zod 4 installed, both A2UI catalogs fail to typecheck (`ZodObject<…, $strip>` is missing `_cached`, `_getCached`, `_parse`, …). Zod 4 *also* triggers an `ERESOLVE` peer conflict via `@copilotkit/runtime` → `@ag-ui/langgraph` → `langchain` → `langsmith`, which wants zod 3. Pinning `zod ^3.25.76` fixes both, and is why `npm install` needs no `--legacy-peer-deps`.

**16. `openai` must match what `@copilotkit/voice` bundles**
It depends on `openai ^5.9.0`. Installing `openai ^6` at the root gives you two copies and `new OpenAI(...)` no longer satisfies `TranscriptionServiceOpenAIConfig` — the `#private` brand differs. Pinned to `^5.9.0`.

**17. The Inspector's documented prop does not exist on a v2 provider**
[The Inspector page](https://docs.copilotkit.ai/google-adk/inspector) says it is "enabled by default" and shows `<CopilotKit enableInspector={false}>` to turn it off. `enableInspector` exists only on `<CopilotKit>`, the v1 compatibility wrapper; `CopilotKitProvider` — what a v2 app root uses — has no such prop and defaults `showDevConsole` to `false`, so a v2 app gets **no** inspector until it asks. Internally the wrapper just forwards `showDevConsole: shouldShowDevConsole(props.enableInspector)`. Worse, `CopilotKitProps.showDevConsole` is annotated `@deprecated … showDevConsole only controls error toasts/banners, not the inspector button` — true of the wrapper's own prop, false of the provider's, where it is the only switch. Following the deprecation notice literally on a v2 provider silently gets you nothing. This repo sets `showDevConsole="auto"` on the provider.

**18. The Inspector has two failure modes that pull against each other**
It is rendered as `<CopilotKitInspector core={copilotkit} />` — bound to *one* provider's core — and `enableInspector` defaults to *on when localhost*. That combination gives you a choice of two bugs:

- **Too many.** Any nested `<CopilotKit>` silently adds a second inspector once the app-wide provider has one. Two instances of the same lit custom element spin `lit-html` into an unbounded `unexpected parse state B` assert loop, firing every 1–2 ms. Next's dev server mirrors every browser console line to its own log, so the flood eats memory in the tab *and* the server — enough to hang the machine. `defineWebInspector()` guards the `customElements.define` call, so nothing errors; you only get the storm.
- **Wrong one.** Suppress the nested inspectors instead and the surviving one watches a core those pages never use — a working inspector with a permanently empty event list, indistinguishable from a broken one.

So the rule is *exactly one per page, attached to the provider the page's chat actually runs on*. `frontend/src/lib/inspector.ts` owns that decision for both sides: the root provider stands down on the three nested-provider routes (Voice, both A2UI), and each of those passes `nestedInspectorSetting`. Nothing in the package enforces or warns about either half.

**19. The Programmatic Control snippet destructures helpers it never defines**
[The page](https://docs.copilotkit.ai/google-adk/programmatic-control) publishes its `headless-complete` send pipeline opening with `useAttachmentsConfig()`, `useAutoScroll(...)` and `buildContent(...)`. Only the first has a counterpart: it is `useAttachments`, which is exported and already returns every field destructured, `consumeAttachments` included. The other two appear nowhere in the docs and are reconstructed in `frontend/src/app/programmatic-control/headless-helpers.ts`. The primitives the page is *about* — `addMessage`, `runAgent`, `stopAgent`, `subscribe` — are the doc's and run as published; the route is marked ⚠️ Partial for the scaffolding, not the substance.

**20. `CopilotChat`'s `onError` collides with the DOM handler**
`CopilotChatProps` inherits the div's `onError` alongside its own, so the prop's type is an *intersection* of both. A handler typed only for the CopilotKit event will not assign; it has to accept `SyntheticEvent` too and narrow. See `multimodal-attachments/demo-chat/page.tsx`.

**21. `a2ui.render(...)` does not accept `action_handlers`**
The fixed-schema pattern pairs a schema with action handlers so clicking Book swaps in `booked_schema.json`. The Python SDK has no such kwarg yet, so the schema is loaded and unused and the button is inert. Flagged on the route.

**22. Open Generative UI publishes a runtime but only fragments of the rest**
[The page](https://docs.copilotkit.ai/google-adk/generative-ui/open-generative-ui) has a complete runtime block, and 1.73.3 accepts `openGenerativeUI` on both `CopilotRuntime` and `<CopilotKit>`. Missing: any agent behind `/open_gen_ui` and `/open_gen_ui_advanced` (this repo mounts its generic `AGUIToolset()` agent at both). `headers` is used in the runtime block but never defined (set to `{}` here). Both frontend blocks render `<Chat />` without defining it (a bare `<CopilotChat />` here). The minimal block passes `VISUALIZATION_DESIGN_SKILL`, which is never defined, so that line is removed. The advanced block imports `./suggestions`, which is never published, so that import is removed. The advanced block also ends at `</CopilotKit>` with no closing `);` or `}`. `sandbox-functions.ts` is complete and used verbatim.

**23. Governed Actions: the `useInterrupt` pattern can't run on ADK**
[The page](https://docs.copilotkit.ai/google-adk/human-in-the-loop/governed-actions) offers two patterns. `useInterrupt` needs the backend to end a run with an AG-UI interrupt, and the installed `ag_ui_adk` never emits one, so that block is shown as text only. The `useHumanInTheLoop` pattern runs verbatim. The page is frontend-only, though: no agent, no policy engine, and the resume sample calls an `executeSideEffect` that is never defined. The verdict the card acts on is whatever the model writes into the tool call.

**24. Agent App Context: two unused lines and a stub tool**
[The page](https://docs.copilotkit.ai/google-adk/agent-app-context)'s `agent.py` imports `add_adk_fastapi_endpoint` without calling it, and builds an `ADKAgent` it never mounts. Both are kept verbatim, and this repo's server mounts `colleagues_agent` itself. The "read it inside a tool" example leaves the lookup as a comment and always returns `{"found": False}`, so it is shown as text and not wired in. The page's own component renders `<>...</>`, which shows as a literal "..." above the chat.

**25. JSON Render: the renderer call doesn't match `@json-render/react` 0.21.0, and most of the code is missing**
[The page](https://docs.copilotkit.ai/google-adk/generative-ui/json-render) publishes the page component, a renderer and a catalog. The renderer calls three helpers that are never defined (`stripCodeFencesAndPrelude`, `tolerantJsonParse`, `validateAgainstCatalog`) and never imports `AssistantMessage`. The catalog imports `MetricCard`, `BarChart` and `PieChart` from files that are never published. The example output uses a `Stack` type that isn't in the catalog. No runtime route or agent is shown. All of that is written in here (see the route). The library call itself is left as published: `<Renderer spec catalog>` should be `registry` (built with `defineRegistry`), and the renderer needs `JSONUIProvider` around it. A `@ts-expect-error` above the line lets the build pass, so the failure shows at runtime. The working version (`json-render-fixed.tsx`, the demo's **fixed** mode) builds a `registry` from the page's catalog, wraps `<Renderer>` in `<JSONUIProvider>`, plugs in through `assistantMessage.markdownRenderer` (typed, and gets the raw `content`), and calls `useConfigureSuggestions` inside `<CopilotKit>`.

**26. Hashbrown: all three hook calls disagree with `@hashbrownai/react` 0.6.1**
[The page](https://docs.copilotkit.ai/google-adk/generative-ui/hashbrown) calls `useJsonParser(text)`, but 0.6.1 needs `useJsonParser(text, schema)`. It calls `useUiKit({ catalog, value })`, but 0.6.1 takes `{ components }` built with `exposeComponent`. And it renders the kit object directly, where 0.6.1 needs `ui.render(value)`. The components, `AssistantMessage` import, runtime route and agent are never published, and are written in here. The hook calls are left as published, each with a `@ts-expect-error`, so the route throws at runtime.

**27. Both BYOC pages: the assistant-message slot's type rejects a plain component**
In CopilotKit 1.73.3 and 1.74.0, `messageView.assistantMessage` is typed as `typeof CopilotChatAssistantMessage`, including its static sub-components. The plain function component both pages pass doesn't satisfy it, so each page's `messageView` line carries a `@ts-expect-error`. Both pages also call `useConfigureSuggestions` outside the `<CopilotKit>` they render, so the suggestions register on the app's root provider and never show in their chat.

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Every chat errors immediately | Agent server not running, or `GOOGLE_API_KEY` missing from **its** environment | The key belongs to the Python process. `curl localhost:8000/health` to check the server. |
| Connection refused / hangs | `localhost` resolution | The docs' own troubleshooting note: try `127.0.0.1` or `0.0.0.0` in `AGENT_URL`. |
| One route errors, others fine | That agent id is not mounted | Compare `frontend/src/lib/agents.ts` against `curl localhost:8000/health`. The `/backend/copilot-runtime` route lists both. |
| The agent calls a tool forever | `stop_on_terminal_text` not wired | Gemini has no native termination after a successful tool result. Every agent needs it as `after_model_callback`. |
| Tool runs but custom UI never renders | Renderer name ≠ tool name | `useRenderTool({ name })` must equal the Python function name exactly. |
| No tool calls visible at all | No wildcard renderer | Without `useDefaultRenderTool()` the runtime has no `*` renderer and calls are invisible — you only see the final text. |
| Frontend tool never called | `AGUIToolset()` missing from `tools=` | That is what puts the frontend-tool channel on the model's list each turn. |
| Shared state resets on restart | `use_in_memory_services=True` | The Quickstart's setting. Swap in a real `session_service` to persist. |
| Reasoning card never appears | Model did not deliberate | Only thinking-enabled agents emit `thought` parts, and only for prompts that need working out. |
| No mic button on `/voice` | Runtime has no `transcriptionService`, or `basePath` ≠ route directory | Both are required for `/info` to advertise `audioFileTranscriptionEnabled`. |
| Mic returns an error | No `OPENAI_API_KEY` | Transcription is Whisper, not Gemini. Use the sample-audio button instead. |
| A2UI surface renders as raw JSON | `catalogId` mismatch, or middleware not attached | The backend's `createSurface.catalogId` must equal the frontend `createCatalog` id. |
| **Browser tab, dev server, or whole machine hangs on a route** | **Two inspectors mounted on one page** | Only one provider per page may enable it. `frontend/src/lib/inspector.ts` coordinates this; add any new nested `<CopilotKit>` to its route list. |
| Inspector opens but the event list stays empty | It is attached to a different provider's core | It only sees the core it was given. On a route with a nested `<CopilotKit>`, the *nested* provider must own it — see `lib/inspector.ts`. |
| Console floods `unexpected parse state B` | Same cause | That assert is `lit-html`'s. Next mirrors every browser console line to the dev server, so the flood consumes memory on both sides. |
| Want the inspector gone entirely | — | `NEXT_PUBLIC_COPILOTKIT_INSPECTOR=off` in `frontend/.env.local`, then restart. |
| `npm install` ERESOLVE on zod | `zod` bumped to 4 | See §9 item 15. Stay on `^3.25.76`. |
| **Dev server dies silently mid-session; a route "crashes"** | **The Linux OOM killer, not the app** | `dmesg -T | grep -i oom` — if it names `next-server`, see *Out-of-memory kills* below. |
| A first page load takes minutes to compile | Cold Turbopack cache, or a dependency with a huge module graph | Expected once after `rm -rf .next`. If it repeats on every route, check what that route's graph pulls in — see §9. |

### Out-of-memory kills

The most confusing failure this repo has produced. The terminal shows a route
compiling, then nothing — no stack trace, no exit message, just a dead server.
It reads like the route crashed. It is the kernel killing `next-server`:

```
$ dmesg -T | grep -i "oom\|killed process"
Out of memory: Killed process 4396 (next-server (v1) ... anon-rss:13841920kB
```

13.8 GB resident on a 16 GB machine. The route being compiled is incidental —
whichever one you opened is the one that gets blamed.

The cause is Turbopack's persistent dev cache at `.next/dev/cache/turbopack`.
It is an append-only LSM store of `.sst` files, it is memory-mapped, and it is
not pruned between restarts. In this repo it had reached **8.5 GB**. Two things
keep it in bounds:

1. **`turbopackMemoryEviction: "full"`** in `frontend/next.config.ts`. The
   default is `"auto"`, which evicts only when it predicts a large saving or
   detects pressure — too late to help here. `"full"` drops what it can after
   every snapshot. The cache stays on disk, so restarts are still warm.
2. **`rm -rf frontend/.next` when it gets large.** Check with
   `du -sh frontend/.next`. Anything past a couple of GB is worth clearing; the
   cost is one cold compile.

If it still gets killed, turn the cache off entirely with
`experimental: { turbopackFileSystemCacheForDev: false }` and accept a cold
compile on every restart.

Worth knowing before you blame the app: `free -h` before starting. This is a
memory-hungry dev server sharing a box with a browser and an editor, and it
will lose that fight quietly.


---

## Doc drift detection

`/doc-sync` keeps this repo honest about the docs it mirrors. Press **Sync docs now** (on the landing page or on `/doc-sync`) and it fetches the markdown source behind all 33 tracked doc pages, diffs each against the copy stored in `doc-snapshot/`, replaces that copy, and reports what moved — ranked by whether the change can actually break an implementation.

Doc pages are fetched by appending `.md` to their URL, which returns the authored MDX rather than 250 KB of rendered HTML. Every response is checked for `text/markdown` before it is allowed near the snapshot: a URL that misses the markdown handler still answers `200` with the HTML app shell, and writing that in would destroy the baseline and report the whole corpus as rewritten on the next run. A run commits all pages or none.

**Severity is decided by where the edit landed**, not how big it was:

| Level | Trigger |
|---|---|
| **High** | a changed line inside a fenced code block, a changed fence count, or a page that now 404s and is gone from the sitemap |
| **Medium** | a changed heading, changed frontmatter `title`/`description`, or prose in the same section as changed code |
| **Low** | other prose |

**Sections checked** lists every tracked page in nav order with a mark — `✓` unchanged, `!` changed, `+` stored, `✗` 404, `~` unstable, `·` not checked. Expanding a row shows the comparison: for a changed page the diff (`−` existing snapshot, `+` newly fetched), and for an unchanged one the two matching hashes, which is the evidence the check ran.

**`doc-snapshot/CHANGELOG.md`** is the record that survives a re-sync. Because syncing replaces the copy it just compared against, the run *after* a change reports nothing — so the changelog is written at the moment of discovery and never rewritten later. Only changed pages are recorded; a clean run does not touch the file. It keeps the three most recent dated entries, counted rather than aged, so a change from six weeks ago still shows if nothing has happened since.

**One sync date.** `syncedAt` in `doc-snapshot/manifest.json`, rewritten on every run and shown on `/`, `/status` and `/doc-sync`. There is no hand-maintained date to keep in step with it.

**To test it**, edit any `doc-snapshot/pages/*.md` file and press the button — a line inside a code fence for High, a `##` heading for Medium, a sentence for Low. The comparison reads the stored file itself, so nothing else needs changing. Both `/doc-sync` and the changelog label the result as a local snapshot edit rather than upstream drift.

Commit `doc-snapshot/` — `pages/`, `manifest.json` and `CHANGELOG.md` are the baseline every diff is taken against. `reports/` is gitignored derived data.

---

## 11. Project structure

```
google-adk/
├── CLAUDE.md
├── README.md
├── .env.example                      # annotated, split by which process reads what
│
├── backend/                          # Python — a genuinely separate process
│   ├── pyproject.toml                # the Quickstart's install line
│   └── src/
│       ├── agent_server.py           # ★ FastAPI; one AG-UI endpoint per agent
│       └── agents/
│           ├── registry.py           # ★ id → agent; id is also the mount path
│           ├── shared_chat.py        # ★ MODEL + stop_on_terminal_text + builders
│           ├── quickstart_agent.py   # verbatim from the Quickstart
│           ├── chat_agents.py        # the frontend-only routes' agents
│           ├── tool_rendering_agent.py
│           ├── hitl_in_chat_agent.py
│           ├── shared_state_*.py     # language / read-write / streaming
│           ├── predictive_state_updates_agent.py
│           ├── workflow_execution_agent.py
│           ├── readonly_state_agent_context_agent.py
│           ├── agent_config_agent.py
│           ├── subagents_agent.py
│           ├── a2ui_fixed_agent.py
│           ├── declarative_gen_ui_agent.py
│           └── a2ui_schemas/         # flight_schema.json · booked_schema.json
│
└── frontend/
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx                     # / — orientation + roster
        │   ├── status/page.tsx
        │   ├── api/
        │   │   ├── copilotkit/route.ts                    # ★ main runtime, 28 agents
        │   │   ├── copilotkit-voice/[[...slug]]/route.ts  # ★ v2 runtime + transcription
        │   │   └── copilotkit-declarative-gen-ui/route.ts # ★ A2UI auto-inject
        │   └── <doc route>/
        │       ├── page.tsx                 # notes + exact source (server component)
        │       └── demo-chat/page.tsx       # ★ the running feature, chrome-free
        ├── components/
        │   ├── providers.tsx                # ★ the one app-wide provider
        │   ├── source-code.tsx              # renders a repo file verbatim
        │   ├── code-figure.tsx              # shared Shiki code block
        │   ├── app-chrome.tsx               # sidebar layout, skipped on /demo-chat
        │   ├── demo-frame.tsx
        │   ├── nav-sidebar.tsx
        │   ├── route-header.tsx
        │   └── ui.tsx                       # Panel, Callout, TryIt, KeyValue
        └── lib/
            ├── copilot-runtime.ts          # ★ Intelligence + identifyUser, once
            ├── nav-config.ts                # ★ routes, docs, status — one source
            ├── agents.ts                    # ★ agent ids, mirrors registry.py
            ├── source.ts                    # server-only file reader
            └── highlight.ts                 # server-only Shiki wrapper
```

---

## 12. References

**Getting Started** — [Quickstart (bring your own agent)](https://docs.copilotkit.ai/google-adk/quickstart?agent=bring-your-own)

**Rich Threads** — [Threads Drawer](https://docs.copilotkit.ai/google-adk/prebuilt-components/copilot-threads-drawer) · [Headless Threads](https://docs.copilotkit.ai/google-adk/headless-threads) · [Thread & History Lifecycle](https://docs.copilotkit.ai/google-adk/threads-lifecycle)

**Prebuilt Components** — [CopilotChat](https://docs.copilotkit.ai/google-adk/prebuilt-components/chat) · [CopilotSidebar](https://docs.copilotkit.ai/google-adk/prebuilt-components/sidebar) · [CopilotPopup](https://docs.copilotkit.ai/google-adk/prebuilt-components/popup) · [Open, close, and feedback](https://docs.copilotkit.ai/google-adk/prebuilt-components/chat-controls)

**Custom Look and Feel** — [CSS](https://docs.copilotkit.ai/google-adk/custom-look-and-feel/css) · [Slots](https://docs.copilotkit.ai/google-adk/custom-look-and-feel/slots) · [Markdown Rendering](https://docs.copilotkit.ai/google-adk/custom-look-and-feel/markdown) · [Headless UI](https://docs.copilotkit.ai/google-adk/custom-look-and-feel/headless-ui) · [Reasoning Messages](https://docs.copilotkit.ai/google-adk/custom-look-and-feel/reasoning-messages)

**Input Modalities** — [Multimodal Attachments](https://docs.copilotkit.ai/google-adk/multimodal-attachments) · [Voice](https://docs.copilotkit.ai/google-adk/voice)

**Generative UI** — [Reasoning](https://docs.copilotkit.ai/google-adk/generative-ui/reasoning) · [Components as Tools](https://docs.copilotkit.ai/google-adk/generative-ui/tool-based) · [Tool Rendering](https://docs.copilotkit.ai/google-adk/generative-ui/tool-rendering) · [State Rendering](https://docs.copilotkit.ai/google-adk/generative-ui/state-rendering) · [A2UI Dynamic Schema](https://docs.copilotkit.ai/google-adk/generative-ui/a2ui/dynamic-schema) · [A2UI Fixed Schema](https://docs.copilotkit.ai/google-adk/generative-ui/a2ui/fixed-schema) · [Open Generative UI](https://docs.copilotkit.ai/google-adk/generative-ui/open-generative-ui) · [JSON Render](https://docs.copilotkit.ai/google-adk/generative-ui/json-render) · [Hashbrown](https://docs.copilotkit.ai/google-adk/generative-ui/hashbrown)

**App Control** — [Frontend Tools](https://docs.copilotkit.ai/google-adk/frontend-tools) · [Human in the Loop](https://docs.copilotkit.ai/google-adk/human-in-the-loop) · [Governed Action Approval UI](https://docs.copilotkit.ai/google-adk/human-in-the-loop/governed-actions) · [Programmatic Control](https://docs.copilotkit.ai/google-adk/programmatic-control)

**Shared State** — [Overview](https://docs.copilotkit.ai/google-adk/shared-state) · [Render state in your app](https://docs.copilotkit.ai/google-adk/shared-state/rendering-in-app) · [State Streaming](https://docs.copilotkit.ai/google-adk/shared-state/streaming) · [Agent Read-Only Context](https://docs.copilotkit.ai/google-adk/shared-state/agent-readonly) · [Reading agent state](https://docs.copilotkit.ai/google-adk/shared-state/in-app-agent-read) · [Writing agent state](https://docs.copilotkit.ai/google-adk/shared-state/in-app-agent-write) · [Workflow Execution](https://docs.copilotkit.ai/google-adk/shared-state/workflow-execution) · [Predictive state updates](https://docs.copilotkit.ai/google-adk/shared-state/predictive-state-updates)

**Multi-Agent** — [Sub-Agents](https://docs.copilotkit.ai/google-adk/multi-agent/subagents)

**Agent Config** — [Agent Config](https://docs.copilotkit.ai/google-adk/agent-config) · [Agent App Context](https://docs.copilotkit.ai/google-adk/agent-app-context)

**Observe & Operate** — [Inspector](https://docs.copilotkit.ai/google-adk/inspector)

**Backend** — [Copilot Runtime](https://docs.copilotkit.ai/google-adk/backend/copilot-runtime)

**External** — [Google ADK docs](https://google.github.io/adk-docs/) · [`ag-ui-adk` on PyPI](https://pypi.org/project/ag-ui-adk/) · [AG-UI protocol](https://ag-ui.com) · [A2UI Composer](https://a2ui-composer.ag-ui.com/)
