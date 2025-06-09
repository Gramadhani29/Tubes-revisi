import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            Sistem Kemahasiswaan
          </Link>
        </div>
        
        <div className="navbar-menu">
          <Link 
            to="/event-submission" 
            className={`nav-link ${isActive('/event-submission') ? 'active' : ''}`}
          >
            Ajukan Event
          </Link>
          
          <Link 
            to="/event-approval" 
            className={`nav-link ${isActive('/event-approval') ? 'active' : ''}`}
          >
            Persetujuan Event
          </Link>
          
          <Link 
            to="/event-status" 
            className={`nav-link ${isActive('/event-status') ? 'active' : ''}`}
          >
            Status Event
          </Link>
          
          <Link 
            to="/room-booking-status" 
            className={`nav-link ${isActive('/room-booking-status') ? 'active' : ''}`}
          >
            Status Booking
          </Link>
          
          <Link 
            to="/event-notification" 
            className={`nav-link ${isActive('/event-notification') ? 'active' : ''}`}
          >
            Notifikasi Logistik
          </Link>
        </div>
      </div>
    </nav>
  );
} 