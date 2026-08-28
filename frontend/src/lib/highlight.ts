import "server-only";

import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";

import cssGrammar from "@shikijs/langs/css";
import jsonGrammar from "@shikijs/langs/json";
import pythonGrammar from "@shikijs/langs/python";
import typescriptGrammar from "@shikijs/langs/typescript";
import tsxGrammar from "@shikijs/langs/tsx";
import githubDark from "@shikijs/themes/github-dark";

/**
 * Syntax highlighting for the code shown on doc routes.
 *
 * Runs on the server only. Every page that renders code is a server component,
 * so the grammars never reach the browser and most routes are highlighted once
 * at build time rather than per request.
 *
 * Four choices worth knowing:
 *
 * - **`shiki/core`, not `shiki`.** The default entry is the *full bundle*: it
 *   statically pulls a manifest of 242 grammars and 65 themes — roughly 13 MB
 *   of grammar JSON across ~300 modules. They are lazy `import()`s at runtime,
 *   but a bundler still has to resolve, parse and chunk every one of them, and
 *   single grammars run to hundreds of KB of one JSON literal. Under Turbopack
 *   dev that made the first page compile take minutes and left the dev server
 *   holding enough memory to take the machine down with it. The core entry
 *   ships no manifest, so the graph is only what is imported above: five
 *   grammars and one theme, about 0.5 MB.
 * - **Grammars imported statically, by name.** Each `@shikijs/langs` module is
 *   self-contained — embedded languages are inlined into its JSON — so these
 *   five pull in nothing further.
 * - **One highlighter, created lazily and reused.** `createHighlighterCore`
 *   compiles grammars and loads the Oniguruma wasm; several pages render four
 *   or more blocks. The promise is cached at module scope so that cost is paid
 *   once per process, not once per block.
 * - **A single dark theme.** The code figure is always dark (`bg-slate-950`)
 *   regardless of the page theme, so emitting light/dark CSS variables would
 *   produce unreadable light-on-dark text in light mode.
 */

const THEME = "github-dark";

const GRAMMARS = [
  tsxGrammar,
  typescriptGrammar,
  pythonGrammar,
  cssGrammar,
  jsonGrammar,
];

/**
 * What `languageFor()` in `lib/source.ts` returns → the grammar's own name.
 *
 * The two disagree on TypeScript: the file extension says `ts`, the grammar
 * calls itself `typescript`. Mapping at lookup keeps both spellings honest
 * instead of renaming a registration.
 *
 * Keep this in step with `languageFor`: a language it returns but this map
 * lacks renders as unhighlighted plain text, and a grammar imported above that
 * nothing returns is pure module-graph weight.
 */
const LANG_IDS = {
  tsx: "tsx",
  ts: "typescript",
  python: "python",
  css: "css",
  json: "json",
} as const;

type SupportedLang = keyof typeof LANG_IDS;

let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= createHighlighterCore({
    themes: [githubDark],
    langs: GRAMMARS,
    engine: createOnigurumaEngine(() => import("shiki/wasm")),
  });
  return highlighterPromise;
}

function isSupported(lang: string): lang is SupportedLang {
  return lang in LANG_IDS;
}

/**
 * @returns Highlighted HTML, or `null` when the language has no grammar — the
 *   caller then renders the code as plain text rather than showing nothing.
 */
export async function highlight(
  code: string,
  lang: string,
): Promise<string | null> {
  if (!isSupported(lang)) return null;

  try {
    const highlighter = await getHighlighter();
    return highlighter.codeToHtml(code, {
      lang: LANG_IDS[lang],
      theme: THEME,
    });
  } catch {
    // Never let a highlighting failure blank out a page's source panel.
    return null;
  }
}
