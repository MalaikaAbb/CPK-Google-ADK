"""Backing agent for the Components & surfaces routes.

https://docs.copilotkit.ai/google-adk/generative-ui/components/surfaces
(and catalogs, standard-catalog, state-and-actions, theming, transports,
markdown-mode, from-a2ui)

Harness-authored: none of the eight pages shows a Google ADK agent.

What the pages do require of the agent:

- Tool transport: the runtime (`generativeUI: true`) adds a `render_ui` tool to
  the run's tools and a guide for it to the run's context. `AGUIToolset()`
  exposes the run's client tools to the model, so `render_ui` arrives with it.
- Markdown transport: the provider sends the component schemas and a writing
  guide as context entries. The Markdown Mode page only says that a non-LangGraph
  agent must "put the run's context entries into its system prompt".

`ag_ui_adk` stores context entries in session state, not in the prompt. The
instruction provider below uses the pattern the Agent App Context page publishes
for ADK (`CONTEXT_STATE_KEY`, `render_context`) to put them into the prompt.

`search_products` is also harness-authored. The Catalogs page tells the agent to
"copy every value from a product of a tool result" but publishes no tool.
"""

from __future__ import annotations

from urllib.parse import quote_plus

from ag_ui_adk import AGUIToolset
from google.adk.agents import LlmAgent
from google.adk.agents.readonly_context import ReadonlyContext

from agents.agent_app_context_agent import render_context
from agents.shared_chat import MODEL, stop_on_terminal_text


#region search-products
# Harness-authored product data for the shop catalog's ProductGrid/ProductCard.
PRODUCTS = [
    {"productId": "shoe-001", "name": "Trail Runner Lite", "price": 59, "category": "running shoes"},
    {"productId": "shoe-002", "name": "Road Glide 3", "price": 89, "category": "running shoes"},
    {"productId": "shoe-003", "name": "Tempo Racer", "price": 129, "category": "running shoes"},
    {"productId": "shoe-004", "name": "Easy Jog", "price": 45, "category": "running shoes"},
    {"productId": "jacket-001", "name": "Wind Shell", "price": 79, "category": "jackets"},
    {"productId": "jacket-002", "name": "Rain Pro", "price": 149, "category": "jackets"},
    {"productId": "sock-001", "name": "Cushion Socks (3 pack)", "price": 18, "category": "accessories"},
    {"productId": "bottle-001", "name": "Insulated Bottle", "price": 25, "category": "accessories"},
]
# Labelled placeholders (name + category), not stock photos: a random photo
# next to a product name reads as a wrong product image.
for _product in PRODUCTS:
    _text = quote_plus(f"{_product['name']}\n{_product['category']}")
    _product["imageUrl"] = f"https://placehold.co/320x200/png?text={_text}"


def search_products(query: str = "", max_price: float | None = None) -> dict:
    """Search the shop's products.

    Args:
        query: Words to match against product names and categories. Empty
            returns every product.
        max_price: Only return products at or below this price.

    Returns:
        A dict with `products`: each has productId, name, price (a number),
        imageUrl and category.
    """
    words = [w for w in query.lower().split() if w]
    found = [
        p
        for p in PRODUCTS
        if (not words or any(w in f"{p['name']} {p['category']}".lower() for w in words))
        and (max_price is None or p["price"] <= max_price)
    ]
    return {"products": found}
#endregion


#region agent
BASE_INSTRUCTION = """You are the shopping assistant of an online shop.

When the user asks about products, call `search_products` first, then show the
results as generative UI, following the guide and component list in the
context below. Copy product values exactly from the tool result.

After rendering UI, reply with at most one short sentence."""


def build_instruction(ctx: ReadonlyContext) -> str:
    return f"{BASE_INSTRUCTION}\n\n## Context from the page\n\n{render_context(ctx.state)}\n"


genui_agent = LlmAgent(
    name="GenUiComponentsAgent",
    model=MODEL,
    instruction=build_instruction,
    tools=[search_products, AGUIToolset()],
    after_model_callback=stop_on_terminal_text,
)
#endregion
