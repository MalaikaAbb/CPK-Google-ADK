// The "Type your components" snippet of
// https://docs.copilotkit.ai/google-adk/generative-ui/components/catalogs,
// verbatim. Compile-only — never rendered. `tsc` proves the page's claim: the
// `@ts-expect-error` line fails the build if `props.color` ever stops being a
// type error. The function is renamed from `ProductCard` to avoid shadowing.
import type { GenerativeUIComponentProps } from "@copilotkit/react-core/v2/generative-ui";

import { shopUI } from "../_shop/catalog";

export function ProductCardTypingCheck(props: GenerativeUIComponentProps<typeof shopUI, "ProductCard">) {
  props.price; // number
  // @ts-expect-error harness: the page's point — `color` is not a prop of ProductCard
  props.color; // type error: not a prop of ProductCard
}
