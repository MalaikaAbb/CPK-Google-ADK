// Harness-authored CopilotKit wrapper (approved), for two State and Actions
// snippets that are bare fragments with no catalog around them:
//
// - "Keep what the user types": the `CheckoutForm` entry and its component,
//   both verbatim inside `#region checkout-entry` / `#region checkout-form`.
// - "Send a click to the agent": the `onChoose` event, verbatim inside
//   `#region on-choose`, on a minimal `PlanButton` component the page never
//   shows.
//
// The catalog is named `shopUI` because the verbatim CheckoutForm component is
// typed against `typeof shopUI`.
import { z } from "zod";
import {
  createGenerativeUI,
  type GenerativeUIComponentProps,
} from "@copilotkit/react-core/v2/generative-ui";

function PlanButton({ plan, label, onChoose }: GenerativeUIComponentProps<typeof shopUI, "PlanButton">) {
  return (
    <button className="rounded-md border px-3 py-1.5 text-sm" onClick={() => onChoose?.({ plan })}>
      {label}
    </button>
  );
}

export const shopUI = createGenerativeUI({
  id: "acme/shop@1",
  components: {
    //#region checkout-entry
    CheckoutForm: {
      component: CheckoutForm,
      props: z.object({ email: z.string().optional() }),
      writable: ["email"],
    },
    //#endregion
    PlanButton: {
      component: PlanButton,
      description: "A button that picks one pricing plan. Clicking it asks the agent about that plan.",
      props: z.object({ plan: z.string(), label: z.string() }),
      //#region on-choose
      events: {
        onChoose: {
          description: "The user picked a plan",
          parameters: z.object({ plan: z.string() }),
        },
      },
      //#endregion
    },
  },
});

//#region checkout-form
function CheckoutForm({ email, setEmail }: GenerativeUIComponentProps<typeof shopUI, "CheckoutForm">) {
  return <input value={email ?? ""} onChange={(event) => setEmail(event.target.value)} />;
}
//#endregion
