// The "Drop components" snippet of
// https://docs.copilotkit.ai/google-adk/generative-ui/components/standard-catalog,
// verbatim inside `#region omit`. The import line is harness-authored (the
// snippet relies on the one from the snippet above it on the page).
import { createGenerativeUI, standardUI } from "@copilotkit/react-core/v2/generative-ui";

//#region omit
export const appUI = createGenerativeUI({
  id: "acme/app@1",
  extends: [standardUI.omit(["Map", "Video", "HtmlView"])],
  components: {},
});
//#endregion
