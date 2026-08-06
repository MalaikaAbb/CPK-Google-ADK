"""The ADK agent server.

One FastAPI app, one AG-UI endpoint per registered agent. The Quickstart mounts
a single agent at `/`; this harness has one agent per doc route, so it mounts
each at `/{agent_id}` — the pattern the Voice page describes when it says the
backend "mounts registered ADK agents with
`add_adk_fastapi_endpoint(app, ..., path=f"/{agent_name}")`".

Everything else — `ADKAgent(app_name=…, user_id=…, session_timeout_seconds=…,
use_in_memory_services=True)` — is the Quickstart's configuration, applied per
agent. Sessions are in-memory, so shared state resets when this process
restarts.

Run with:  uv run --directory backend python src/agent_server.py
"""

from __future__ import annotations

import logging
import os

import uvicorn
from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint
from fastapi import FastAPI

from agents.registry import REGISTRY

logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

HOST = os.environ.get("AGENT_HOST", "localhost")
PORT = int(os.environ.get("AGENT_PORT", "8000"))

app = FastAPI(
    title="CopilotKit + Google ADK test suite — agent server",
    description="One AG-UI endpoint per doc route.",
)


#region mount
for agent_id, registered in REGISTRY.items():
    adk_agent = ADKAgent(
        adk_agent=registered.agent,
        app_name="demo_app",
        user_id="demo_user",
        session_timeout_seconds=3600,
        use_in_memory_services=True,
        # Only State Streaming supplies this. It is what forwards a streaming
        # tool argument into a shared-state key before the tool returns.
        predict_state=registered.predict_state,
    )
    add_adk_fastapi_endpoint(app, adk_agent, path=f"/{agent_id}")
#endregion


@app.get("/health")
def health() -> dict:
    """Lets the README's smoke test confirm every agent mounted."""
    return {
        "status": "ok",
        "agents": sorted(REGISTRY),
        "count": len(REGISTRY),
    }


if __name__ == "__main__":
    logger.info("Mounted %d agents: %s", len(REGISTRY), ", ".join(sorted(REGISTRY)))
    uvicorn.run(app, host=HOST, port=PORT)
