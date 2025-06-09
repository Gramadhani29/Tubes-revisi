import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import "./EventStatus.css";

const EVENT_STATUS = gql`
  query EventStatus($eventId: Int!) {
    eventStatus(event_id: $eventId) {
      event_id
      nama_event
      status_approval
    }
  }
`;

export default function EventStatus() {
  const [eventId, setEventId] = useState("");
  const [getStatus, { data, loading, error }] = useLazyQuery(EVENT_STATUS);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (eventId.trim()) {
      getStatus({ variables: { eventId: parseInt(eventId) } });
    }
  };

  return (
    <div className="event-status-container">
      <div className="event-status-card">
        <h2 className="event-status-title">Cek Status Event</h2>
        
        <form onSubmit={handleSubmit} className="event-status-form">
          <div className="form-group">
            <label htmlFor="eventId">ID Event</label>
            <div className="input-with-button">
              <input
                id="eventId"
                className="form-input"
                placeholder="Masukkan ID event"
                value={eventId}
                onChange={e => setEventId(e.target.value)}
                type="number"
                required
              />
              <button 
                type="submit" 
                className="check-button"
                disabled={loading || !eventId.trim()}
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

        {data && data.eventStatus && (
          <div className="status-result">
            <h3>Detail Event</h3>
            <div className="event-details">
              <div className="detail-item">
                <span className="detail-label">Nama Event:</span>
                <span className="detail-value">{data.eventStatus.nama_event}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ID Event:</span>
                <span className="detail-value">{data.eventStatus.event_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${data.eventStatus.status_approval.toLowerCase()}`}>
                  {data.eventStatus.status_approval === 'approved' ? 'Disetujui' : 
                   data.eventStatus.status_approval === 'rejected' ? 'Ditolak' : 
                   'Menunggu Persetujuan'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}