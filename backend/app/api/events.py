from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
import asyncio
from datetime import datetime

router = APIRouter()

# In a real app, this would use Redis Pub/Sub or similar.
# For demo, we just emit a heartbeat and simulated events.
async def event_generator():
    try:
        while True:
            # Send a heartbeat
            yield {
                "event": "heartbeat",
                "data": f'{{"time": "{datetime.now().isoformat()}"}}'
            }
            await asyncio.sleep(5)
    except asyncio.CancelledError:
        pass

@router.get("/stream")
async def sse_stream():
    return EventSourceResponse(event_generator())
