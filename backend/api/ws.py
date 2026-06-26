from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from core.websocket_manager import ws_manager

router = APIRouter(tags=["websockets"])

@router.websocket("/ws/sensors")
async def websocket_sensors_endpoint(websocket: WebSocket):
    await ws_manager.connect_sensor(websocket)
    try:
        while True:
            # Keep alive loop
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect_sensor(websocket)

@router.websocket("/ws/alerts")
async def websocket_alerts_endpoint(websocket: WebSocket):
    await ws_manager.connect_alert(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect_alert(websocket)
