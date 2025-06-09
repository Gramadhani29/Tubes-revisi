import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const features = [
    {
      title: 'Ajukan Event',
      description: 'Ajukan event baru untuk diselenggarakan di kampus',
      path: '/event-submission',
      icon: '🎉'
    },
    {
      title: 'Persetujuan Event',
      description: 'Kelola persetujuan event yang diajukan',
      path: '/event-approval',
      icon: '✅'
    },
    {
      title: 'Status Event',
      description: 'Cek status event yang telah diajukan',
      path: '/event-status',
      icon: '📊'
    },
    {
      title: 'Status Booking',
      description: 'Pantau status booking ruangan',
      path: '/room-booking-status',
      icon: '🏢'
    },
    {
      title: 'Notifikasi Logistik',
      description: 'Kirim notifikasi ke tim logistik untuk event yang disetujui',
      path: '/event-notification',
      icon: '📢'
    }
  ];

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Selamat Datang di Sistem Kemahasiswaan</h1>
        <p className="home-description">
          Kelola event dan booking ruangan kampus dengan mudah dan efisien
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <Link 
              key={index} 
              to={feature.path} 
              className="feature-card"
            >
              <div className="feature-icon">{feature.icon}</div>
              <h2 className="feature-title">{feature.title}</h2>
              <p className="feature-description">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 