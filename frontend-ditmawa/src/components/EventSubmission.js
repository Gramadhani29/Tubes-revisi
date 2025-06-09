import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "./EventSubmission.css";

const SUBMIT_EVENT = gql`
  mutation SubmitEvent($input: SubmitEventInput!) {
    submitEvent(input: $input) {
      event_id
      nama_event
      status_approval
    }
  }
`;

export default function EventSubmission() {
  const [form, setForm] = useState({
    nama_event: "",
    deskripsi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
  });
  const [submitEvent, { data, loading, error }] = useMutation(SUBMIT_EVENT);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    submitEvent({ variables: { input: form } });
  };

  return (
    <div className="event-submission-container">
      <div className="event-submission-card">
        <h2 className="event-submission-title">Ajukan Event Baru</h2>
        <form onSubmit={handleSubmit} className="event-submission-form">
          <div className="form-group">
            <label htmlFor="nama_event">Nama Event</label>
            <input
              id="nama_event"
              name="nama_event"
              className="form-input"
              placeholder="Masukkan nama event"
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="deskripsi">Deskripsi Event</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              className="form-input"
              placeholder="Jelaskan detail event Anda"
              onChange={handleChange}
              required
              rows="4"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tanggal_mulai">Tanggal Mulai</label>
              <input
                id="tanggal_mulai"
                name="tanggal_mulai"
                type="date"
                className="form-input"
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tanggal_selesai">Tanggal Selesai</label>
              <input
                id="tanggal_selesai"
                name="tanggal_selesai"
                type="date"
                className="form-input"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Ajukan Event"}
          </button>
        </form>

        {data && (
          <div className="success-message">
            <h3>Event Berhasil Diajukan!</h3>
            <div className="event-details">
              <p><strong>Nama Event:</strong> {data.submitEvent.nama_event}</p>
              <p><strong>ID Event:</strong> {data.submitEvent.event_id}</p>
              <p><strong>Status:</strong> 
                <span className={`status-badge ${data.submitEvent.status_approval.toLowerCase()}`}>
                  {data.submitEvent.status_approval}
                </span>
              </p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}