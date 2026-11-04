// The "Positional parameter order" snippet of
// https://docs.copilotkit.ai/google-adk/generative-ui/components/catalogs
// verbatim inside `#region parameter-order`. Harness-authored outside it: the
// imports and the `Panel` component, which the page never defines.
import type { ReactNode } from "react";
import { z } from "zod";
import { createGenerativeUI } from "@copilotkit/react-core/v2/generative-ui";

function Panel({ title, color, children }: { title: string; color?: string; children?: ReactNode }) {
  return (
    <section className="rounded-lg border p-3" style={color ? { borderColor: color } : undefined}>
      <h4 className="mb-2 font-semibold">{title}</h4>
      {children}
    </section>
  );
}

//#region parameter-order
const ui = createGenerativeUI({
  id: "acme/panel@1",
  components: {
    Panel: {
      component: Panel,
      props: z.object({ title: z.string(), color: z.string().optional() }),
      slots: { children: "multiple" },
      parameterOrder: ["title", "children"],
    },
  },
});
//#endregion

export { ui as panelUI };
