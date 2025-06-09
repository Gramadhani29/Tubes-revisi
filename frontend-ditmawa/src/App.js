import React from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Outlet } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import Navbar from './components/Navbar';
import Home from './components/Home';
import EventSubmission from './components/EventSubmission';
import EventApproval from './components/EventApproval';
import EventStatus from './components/EventStatus';
import RoomBookingStatus from './components/RoomBookingStatus';
import ApprovedEventNotifier from './components/ApprovedEventNotifier';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Layout component to wrap all routes with Navbar
const RootLayout = () => {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

// Create router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />} errorElement={<ErrorBoundary />}>
      <Route path="/" element={<Home />} />
      <Route path="/event-submission" element={<EventSubmission />} />
      <Route path="/event-approval" element={<EventApproval />} />
      <Route path="/event-status" element={<EventStatus />} />
      <Route path="/room-booking-status" element={<RoomBookingStatus />} />
      <Route path="/event-notification" element={<ApprovedEventNotifier />} />
    </Route>
  )
);

function App() {
  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  );
}

export default App;