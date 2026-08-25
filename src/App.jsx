import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Location from './components/Location';
import RSVP from './components/RSVP';
import Mural from './components/Mural';
import Footer from './components/Footer';
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
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentHash(window.location.hash);
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Se a rota for #admin, #/admin ou /admin -> exibe o Painel dos Noivos
  const isAdmin =
    currentHash === '#admin' ||
    currentHash.startsWith('#admin') ||
    currentHash.startsWith('#/admin') ||
    currentPath === '/admin';

  if (isAdmin) {
    return <AdminPage />;
  }

  return <PublicSite />;
}
