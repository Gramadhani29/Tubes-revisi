from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Event(Base):
    __tablename__ = 'event'
    event_id = Column(Integer, primary_key=True)
    nama_event = Column(String(255))
    deskripsi = Column(String(1000))
    tanggal_mulai = Column(Date)
    tanggal_selesai = Column(Date)
    status_approval = Column(String(255))

class EventApprovalLog(Base):
    __tablename__ = 'event_approval_log'
    approval_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey('event.event_id'))
    tanggal_approval = Column(Date)
    status = Column(String(255))
    catatan = Column(String(1000))

class RoomBookingStatus(Base):
    __tablename__ = 'room_booking_status'
    booking_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey('event.event_id'))
    room_id = Column(Integer)
    status_booking = Column(String(255))
    tanggal_update = Column(Date)