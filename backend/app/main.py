from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio

app = FastAPI(
    title="Automator API",
    description="Backend API for managing social media automation bots and proxies.",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Socket.IO setup
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
sio_app = socketio.ASGIApp(sio, other_asgi_app=app)

@app.get("/")
async def root():
    return {"message": "Automator API is running. Go to /docs for API documentation."}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "database": "connected", "redis": "connected"}

# --- Socket.IO Events ---
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.on('subscribe_devices')
async def subscribe_devices(sid, data):
    """Client subscribes to device updates"""
    sio.enter_room(sid, 'device_updates')
    # Mock initial data
    devices = [
        {"id": 1, "name": "Pixel 7 Pro - Alpha", "status": "online", "battery": 89},
        {"id": 2, "name": "Galaxy S23 - Beta", "status": "online", "battery": 45}
    ]
    await sio.emit('devices_initial', devices, room=sid)

# To run: uvicorn app.main:sio_app --host 0.0.0.0 --port 8000 --reload
