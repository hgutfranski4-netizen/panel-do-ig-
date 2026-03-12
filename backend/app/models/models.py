import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, Float, JSON, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    full_name = Column(String(255))
    role = Column(String(50), default='viewer')
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Proxy(Base):
    __tablename__ = 'proxies'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String(20))
    protocol = Column(String(10))
    host = Column(String(255))
    port = Column(Integer)
    username = Column(String(255))
    password = Column(Text)
    country = Column(String(2))
    status = Column(String(20), default='active')
    success_rate = Column(Float)
    speed_ms = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class Device(Base):
    __tablename__ = 'devices'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    model = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)
    status = Column(String(20), default='offline')
    proxy_id = Column(UUID(as_uuid=True), ForeignKey('proxies.id'))
    battery_level = Column(Integer)
    last_seen = Column(DateTime)
    location_lat = Column(Float)
    location_lng = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class Account(Base):
    __tablename__ = 'accounts'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    platform = Column(String(20), nullable=False)
    username = Column(String(255))
    email = Column(String(255))
    phone = Column(String(20))
    password_encrypted = Column(Text, nullable=False)
    device_id = Column(UUID(as_uuid=True), ForeignKey('devices.id'))
    proxy_id = Column(UUID(as_uuid=True), ForeignKey('proxies.id'))
    status = Column(String(20), default='inactive')
    health_score = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)

class Campaign(Base):
    __tablename__ = 'campaigns'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255))
    platform = Column(String(20))
    type = Column(String(50))
    status = Column(String(20), default='draft')
    targeting = Column(JSON, default={})
    schedule = Column(JSON, default={})
    ai_settings = Column(JSON, default={})
    assigned_accounts = Column(ARRAY(UUID(as_uuid=True)))
    actions_performed = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Conversation(Base):
    __tablename__ = 'conversations'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = Column(UUID(as_uuid=True), ForeignKey('accounts.id'))
    platform = Column(String(20))
    external_user_id = Column(String(255))
    external_username = Column(String(255))
    history = Column(JSON, default={})
    last_message = Column(Text)
    last_message_time = Column(DateTime)
    status = Column(String(20))
    converted_to_ig = Column(Boolean, default=False)
    converted_to_of = Column(Boolean, default=False)
