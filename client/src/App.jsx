import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Location from './components/Location';
import RSVP from './components/RSVP';
import Mural from './components/Mural';
import Footer from './components/Footer';
import AdminModal from './components/AdminModal';
import AdminPage from './pages/AdminPage';

// Página pública do site
function PublicSite() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-wedding-cream text-wedding-charcoal">
      <Navbar />
      <Hero weddingDate="2026-11-14T16:00:00" />
      <Location />
      <RSVP />
      <Mural />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Site público para convidados */}
        <Route path="/" element={<PublicSite />} />

        {/* Página de administração dos noivos */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}
