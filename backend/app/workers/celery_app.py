from celery import Celery
import os

# Read Redis URL from environment
redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "automator_worker",
    broker=redis_url,
    backend=redis_url
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

@celery_app.task(bind=True, max_retries=3)
def check_proxy_health(self, proxy_id):
    """
    Mock task for checking proxy health.
    In a real scenario, this would use requests to test the proxy.
    """
    print(f"Checking health for proxy {proxy_id}...")
    return {"status": "success", "proxy_id": proxy_id, "speed_ms": 120}

@celery_app.task
def check_all_devices():
    """
    Mock task for checking all devices.
    """
    print("Checking all devices...")
    return {"status": "completed"}
