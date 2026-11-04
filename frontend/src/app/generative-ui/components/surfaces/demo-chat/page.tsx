"use client";

import { useState } from "react";
import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";
import { GenerativeUISurface } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { shopUI } from "../../_shop/catalog";
import { SAMPLE_PRODUCTS } from "../../_shop/products";
import { FeaturedProducts } from "../featured-products";

/**
 * Each doc snippet from the Surfaces page, mounted on one shop page with a
 * chat beside it.
 *
 * Doc code, verbatim: the provider's `generativeUI` value (the "When a
 * component fails" snippet), `FeaturedProducts`, the `sidebar-notes` target,
 * the per-product `recommendations-*` target and the `scroll-margin-top` CSS.
 *
 * Harness-authored: `runtimeUrl` (this repo's components runtime), the page
 * layout, and the product picker that `product` comes from. The page uses
 * `product` in the per-item snippet without defining it.
 */
export default function Page() {
  const [product, setProduct] = useState(SAMPLE_PRODUCTS[0]);

  return (
    <DemoFrame parentPath="/generative-ui/components/surfaces" subtitle="agent: genui">
      <style>{`
[data-generative-ui-surface] {
  scroll-margin-top: 6rem;
}
`}</style>
      <CopilotKitProvider
        runtimeUrl="/api/copilotkit-genui"
        enableInspector={nestedInspectorSetting}
        generativeUI={{
          ui: shopUI,
          errorBoundary: {
            onError: (info) => console.warn(info.kind, info.surfaceId, info.error.message),
            fallback: ({ retry }) => <button onClick={retry}>Try again</button>,
          },
        }}
      >
        <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_420px]">
          <main className="space-y-6 overflow-y-auto p-6">
            <section>
              <h2 className="mb-2 text-sm font-semibold">Featured products · target <code>featured</code></h2>
              <FeaturedProducts products={SAMPLE_PRODUCTS} />
            </section>

            <section>
              <h2 className="mb-2 text-sm font-semibold">
                Product page · target <code>recommendations-{product.id}</code>
              </h2>
              <div className="mb-2 flex flex-wrap gap-2">
                {SAMPLE_PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProduct(p)}
                    className={`rounded border px-2 py-1 text-xs ${
                      p.id === product.id
                        ? "border-[var(--accent)] font-semibold"
                        : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
              <GenerativeUISurface
                key={product.id}
                id={`recommendations-${product.id}`}
                description={`The "You might also like" row under ${product.name}. Show related products here. Never include ${product.name} itself.`}
              />
            </section>

            <section>
              <h2 className="mb-2 text-sm font-semibold">Notes · target <code>sidebar-notes</code> (autoScroll off)</h2>
              <GenerativeUISurface id="sidebar-notes" autoScroll={false} />
            </section>
          </main>
          <aside className="min-h-0 border-l border-slate-200 dark:border-slate-800">
            <CopilotChat className="h-full" />
          </aside>
        </div>
      </CopilotKitProvider>
    </DemoFrame>
  );
}
