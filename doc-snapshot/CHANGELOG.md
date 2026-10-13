# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-10-08

### 11:27 UTC — 5 pages, highest severity high

**High — Introduction**

`/google-adk` · routes `/`, `/doc-sync` · under “Install CopilotKit packages” · in a `npm` block

2 code lines changed.

````diff
- npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client@1.0.1
+ npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client@1.0.2
````

**High — Quickstart**

`/google-adk/quickstart` · route `/quickstart` · under “Install CopilotKit packages” · in a `npm` block

2 code lines changed.

````diff
- npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client@1.0.1
+ npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client@1.0.2
````

**Medium — Thread & History Lifecycle**

`/google-adk/threads-lifecycle` · route `/threads-lifecycle` · under “Future runs can remain durable in both places”

1 heading, 7 prose lines changed.

````diff
- After historical import, future conversations that run through CopilotKit are
- written to CopilotKit Intelligence as threads. If your LangGraph agent
+ Once Intelligence is connected, conversations that run through that runtime are
+ recorded automatically in Intelligence. Historical import is optional. If your LangGraph agent
+ 
+ ## Example: keep an existing LangGraph conversation
+ 
+ Follow [Bring your own thread system](/google-adk/intelligence/bring-your-own-thread-system#example-keep-an-existing-langgraph-conversation) for an example that keeps native persistence and continues the same conversation.
````

**Low — Copilot Runtime**

`/google-adk/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “mcpApps”

2 prose lines changed.

````diff
- Per-tool filtering belongs to `@ag-ui/mcp-apps-middleware`. The runtime currently pins version `0.0.3`, which does not support `includeTools` or `excludeTools`. Supplying either key raises a configuration error instead of silently ignoring it; use a compatible middleware release when that upstream policy contract is available.
+ Per-tool filtering belongs to `@ag-ui/mcp-apps-middleware`. The release the runtime depends on does not support `includeTools` or `excludeTools`. Supplying either key raises a configuration error instead of silently ignoring it. A newer middleware release alone does not change this: the runtime has to adopt the policy first. Follow [#5930](https://github.com/CopilotKit/CopilotKit/issues/5930) for that work.
````

**Low — Programmatic Control**

`/google-adk/programmatic-control` · route `/programmatic-control` · under “What is this?”

4 prose lines changed.

````diff
- - `agent.subscribe(subscriber)` — low-level AG-UI event subscription (`onCustomEvent`, `onRunStartedEvent`, `onRunFinalized`, `onRunFailed`, …). Pairs with `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` to drive interrupt resolution from arbitrary UI.
+ - `agent.subscribe(subscriber)` — low-level AG-UI event subscription (`onCustomEvent`, `onRunStartedEvent`, `onRunFinalized`, `onRunFailed`, …). Pairs with `copilotkit.runAgent({ agent, resume })` for standard AG-UI interrupts, or `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` for legacy `on_interrupt` custom events, to drive interrupt resolution from arbitrary UI.
- - **`agent.runAgent(options)`** — low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or chain follow-ups. Reach for this only when you need direct control. (For the interrupt-resume case, use `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` — see the snippet below — so the subscriber lifecycle still wraps the resumed run.)
+ - **`agent.runAgent(options)`** — low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or chain follow-ups. Reach for this only when you need direct control. (For the interrupt-resume case, use `copilotkit.runAgent({ agent, resume })` for standard AG-UI interrupts, or `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` for legacy `on_interrupt` custom events — the snippet below shows the legacy form — so the subscriber lifecycle still wraps the resumed run.)
````

---

## 2026-10-05

### 09:54 UTC — 2 pages, highest severity high

**High — Inspector**

`/google-adk/inspector` · route `/inspector` · under “Control when Inspector appears”

4 code lines, 20 prose lines changed. The number of fenced code blocks changed.

````diff
- | Goal                                      | Action                                                                                                    |
- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
- | Close the current view                    | Use the close control; reopen it from the Inspector button                                                |
- | See your application without an overlay   | Use the pop-out control in the Inspector header                                                           |
- | Hide chat message shortcuts until reload  | Open a message's Inspector shortcut menu and choose **Hide this icon**                                    |
- | Hide Inspector temporarily on this domain | Choose **Hide Inspector for a day** from the launcher HUD, or **Hide Inspector for one week** in settings |
- | Disable Inspector for the development app | Set `enableInspector` to `false`                                                                          |
+ | Goal                                       | Action                                                                                                    |
````

**Medium — Copilot Runtime**

`/google-adk/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “Runtime languages”

1 heading, 20 prose lines changed.

````diff
+ ## Runtime languages
+ 
+ **TypeScript is the default and most fully featured runtime. It is the only runtime that can run without CopilotKit Intelligence.** Use it for an open-source setup, or connect it to Intelligence when you need its services.
+ 
+ Python, Go, Ruby, and C#/.NET runtimes require an Intelligence project and server-side API key. They work with both [cloud-hosted](/google-adk/intelligence/managed-intelligence-platform) and [self-hosted](/google-adk/intelligence/self-hosting) Intelligence; they do not provide an in-memory or SQLite runner.
+ 
+ | Language | Host | Without Intelligence |
+ | --- | --- | --- |
````

---

---

## 2026-10-02

### 05:36 UTC — 1 page, highest severity low

**Low — Copilot Runtime**

`/google-adk/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “Agents”

2 prose lines changed.

````diff
+ To register agent logic you wrote yourself, extend AG-UI's `AbstractAgent`. See [Write your own AG-UI agent](/google-adk/backend/custom-ag-ui-agent).
+ 
````

---

---
