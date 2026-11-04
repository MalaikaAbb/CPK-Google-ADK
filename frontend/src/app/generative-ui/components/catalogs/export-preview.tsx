"use client";

// The "Export the catalog for other A2UI tools" snippet of
// https://docs.copilotkit.ai/google-adk/generative-ui/components/catalogs,
// run in the browser. The snippet's first line is verbatim. Its second line,
// `fs.writeFileSync("acme-catalog.json", ...)`, needs Node's `fs`, so the
// harness shows the JSON instead of writing it to disk.
import { useMemo, useState } from "react";
import { exportA2UICatalog } from "@copilotkit/react-core/v2/generative-ui";

import { appUI } from "./app-ui";
import { panelUI } from "./panel-ui";

export function ExportPreview() {
  const [which, setWhich] = useState<"app" | "panel">("panel");
  const json = useMemo(() => {
    if (which === "app") {
      const catalog = exportA2UICatalog(appUI, { title: "Acme app" });
      return JSON.stringify(catalog, null, 2);
    }
    // The parameter-order check: Panel.properties should list
    // component, title, children, color — in that order.
    return JSON.stringify(exportA2UICatalog(panelUI), null, 2);
  }, [which]);

  return (
    <div>
      <div className="mb-2 flex gap-2 text-xs">
        {(["panel", "app"] as const).map((w) => (
          <button
            key={w}
            onClick={() => setWhich(w)}
            className={`rounded-md px-3 py-1 font-medium ${
              which === w
                ? "bg-[var(--accent)] text-white"
                : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            {w === "panel" ? "parameterOrder (panelUI)" : "exportA2UICatalog(appUI)"}
          </button>
        ))}
      </div>
      <pre className="max-h-96 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">{json}</pre>
    </div>
  );
}
