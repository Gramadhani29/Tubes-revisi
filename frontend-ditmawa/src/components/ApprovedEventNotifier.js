import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "./ApprovedEventNotifier.css";

const NOTIFY_LOGISTICS = gql`
  mutation NotifyLogistics($eventId: Int!) {
    notifyLogistics(event_id: $eventId) {
      success
      message
    }
  }
`;

export default function ApprovedEventNotifier() {
  const [eventId, setEventId] = useState("");
  const [notifyLogistics, { data, loading, error }] = useMutation(NOTIFY_LOGISTICS);

  const handleSubmit = e => {
    e.preventDefault();
    notifyLogistics({ variables: { eventId: parseInt(eventId) } });
  };

  return (
    <div className="notifier-container">
      <div className="notifier-card">
        <h2 className="notifier-title">Notifikasi Event ke Logistik</h2>
        <p className="notifier-description">
          Kirim notifikasi event yang telah disetujui ke tim logistik untuk persiapan fasilitas dan kebutuhan event.
        </p>
        
        <form onSubmit={handleSubmit} className="notifier-form">
          <div className="form-group">
            <label htmlFor="eventId">ID Event</label>
            <div className="input-with-button">
              <input
                id="eventId"
                className="form-input"
                placeholder="Masukkan ID event yang telah disetujui"
                value={eventId}
                onChange={e => setEventId(e.target.value)}
                type="number"
                required
              />
              <button 
                type="submit" 
                className="notify-button"
                disabled={loading || !eventId.trim()}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  "Kirim Notifikasi"
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

        {data && data.notifyLogistics && (
          <div className={`notification-result ${data.notifyLogistics.success ? 'success' : 'error'}`}>
            <div className="result-icon">
              {data.notifyLogistics.success ? (
                <svg className="success-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="result-message">{data.notifyLogistics.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}