import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import "./RoomBookingStatus.css";

const ROOM_BOOKING_STATUS = gql`
  query RoomBookingStatus($bookingId: Int!) {
    roomBookingStatus(booking_id: $bookingId) {
      booking_id
      status_booking
      tanggal_update
    }
  }
`;

export default function RoomBookingStatus() {
  const [bookingId, setBookingId] = useState("");
  const [getStatus, { data, loading, error }] = useLazyQuery(ROOM_BOOKING_STATUS);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookingId.trim()) {
      getStatus({ variables: { bookingId: parseInt(bookingId) } });
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="room-booking-container">
      <div className="room-booking-card">
        <h2 className="room-booking-title">Status Booking Ruangan</h2>
        
        <form onSubmit={handleSubmit} className="room-booking-form">
          <div className="form-group">
            <label htmlFor="bookingId">ID Booking</label>
            <div className="input-with-button">
              <input
                id="bookingId"
                className="form-input"
                placeholder="Masukkan ID booking"
                value={bookingId}
                onChange={e => setBookingId(e.target.value)}
                type="number"
                required
              />
              <button 
                type="submit" 
                className="check-button"
                disabled={loading || !bookingId.trim()}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  "Cek Status"
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <p>{error.message}</p>
          </div>
        )}

        {data && data.roomBookingStatus && (
          <div className="booking-status-result">
            <h3>Detail Booking</h3>
            <div className="booking-details">
              <div className="detail-item">
                <span className="detail-label">ID Booking:</span>
                <span className="detail-value">{data.roomBookingStatus.booking_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${data.roomBookingStatus.status_booking.toLowerCase()}`}>
                  {data.roomBookingStatus.status_booking === 'approved' ? 'Disetujui' : 
                   data.roomBookingStatus.status_booking === 'rejected' ? 'Ditolak' : 
                   'Menunggu Persetujuan'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Terakhir Diperbarui:</span>
                <span className="detail-value">{formatDate(data.roomBookingStatus.tanggal_update)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}