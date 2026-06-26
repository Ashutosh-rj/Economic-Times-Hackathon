import json
from typing import List, Dict, Any
from fastapi import WebSocket

class WebSocketManager:
    def __init__(self):
        self.sensor_connections: List[WebSocket] = []
        self.alert_connections: List[WebSocket] = []

    async def connect_sensor(self, websocket: WebSocket):
        await websocket.accept()
        self.sensor_connections.append(websocket)

    def disconnect_sensor(self, websocket: WebSocket):
        if websocket in self.sensor_connections:
            self.sensor_connections.remove(websocket)

    async def connect_alert(self, websocket: WebSocket):
        await websocket.accept()
        self.alert_connections.append(websocket)

    def disconnect_alert(self, websocket: WebSocket):
        if websocket in self.alert_connections:
            self.alert_connections.remove(websocket)

    async def broadcast_sensors(self, message: Dict[str, Any]):
        dead_connections = []
        text = json.dumps(message)
        for ws in self.sensor_connections:
            try:
                await ws.send_text(text)
            except Exception:
                dead_connections.append(ws)
        for ws in dead_connections:
            self.disconnect_sensor(ws)

    async def broadcast_alert(self, message: Dict[str, Any]):
        dead_connections = []
        text = json.dumps(message)
        for ws in self.alert_connections:
            try:
                await ws.send_text(text)
            except Exception:
                dead_connections.append(ws)
        for ws in dead_connections:
            self.disconnect_alert(ws)

ws_manager = WebSocketManager()
