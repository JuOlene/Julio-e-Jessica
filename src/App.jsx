import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Compass, 
  Check, 
  Gift, 
  UserCheck, 
  Copy, 
  Send, 
  Loader2, 
  X, 
  CheckCircle2, 
  Church,
  Utensils
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api, DEFAULT_CONFIG } from './services/api';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [activeModal, setActiveModal] = useState(null); // 'cerimonia' | 'buffet' | 'rsvp' | 'presentes' | null
  const [isAdmin, setIsAdmin] = useState(false);

  // Configurações Dinâmicas dos Locais e Pix
  const [eventConfig, setEventConfig] = useState(DEFAULT_CONFIG);

  // Countdown State: 14/11/2026 às 15:30
  const weddingDate = '2026-11-14T15:30:00';
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // RSVP State & Lista de Convidados Cadastrados
  const [guestList, setGuestList] = useState([]);
  const [rsvpNome, setRsvpNome] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpConfirmedName, setRsvpConfirmedName] = useState('');
  const [rsvpError, setRsvpError] = useState('');

  // Pix State
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedCerimonia, setCopiedCerimonia] = useState(false);
  const [copiedBuffet, setCopiedBuffet] = useState(false);

  // Informações Fixas da Data & Famílias
  const eventDetails = {
    month: "NOVEMBRO",
    dayOfWeek: "SÁBADO",
    day: "14",
    year: "2026",
    time: "15:30H",

    // Pais da Noiva
    paisNoiva: {
      mae: "SEVERINA OLEGÁRIO DA SILVA",
      pai: "AUSTIN PEREIRA DOS SANTOS",
      inMemoriam: true
    },

    // Pais do Noivo
    paisNoivo: {
      mae: "MARIA DE LOURDES HONORATO RIBEIRO",
      pai: "JULIO CUNHA RIBEIRO",
      inMemoriam: true
    }
  };

  useEffect(() => {
    const loadConfig = () => {
      setEventConfig(api.getConfig());
    };
    const loadGuests = async () => {
      const list = await api.getConvidados();
      setGuestList(list);
    };

    loadConfig();
    loadGuests();

    window.addEventListener('wedding_config_updated', loadConfig);
    window.addEventListener('wedding_guests_updated', loadGuests);
    return () => {
      window.removeEventListener('wedding_config_updated', loadConfig);
      window.removeEventListener('wedding_guests_updated', loadGuests);
    };
  }, []);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };
    checkHash();
    window.addEventListener('popstate', checkHash);
    window.addEventListener('hashchange', checkHash);
    return () => {
      window.removeEventListener('popstate', checkHash);
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  useEffect(() => {
    const target = new Date(weddingDate).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#6B7A42', '#7A8C4B', '#9DAE6A', '#3F4D27']
    });
  };

  const handleRsvpSubmit = async (e) => {
    if (e) e.preventDefault();
    const targetName = selectedGuest ? selectedGuest.nome : rsvpNome.trim();
    if (!targetName) {
      setRsvpError('Por favor, informe ou selecione seu nome na lista.');
      return;
    }
    setRsvpError('');
    setRsvpLoading(true);
    try {
      const confirmed = await api.confirmConvidado(selectedGuest ? selectedGuest.id : targetName);
      setRsvpConfirmedName(confirmed.nome || targetName);
      setRsvpSuccess(true);
      setRsvpNome('');
      setSelectedGuest(null);
      triggerConfetti();
    } catch (err) {
      setRsvpError(err.message || 'Erro ao confirmar presença.');
    } finally {
      setRsvpLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'pix') {
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    } else if (type === 'cerimonia') {
      setCopiedCerimonia(true);
      setTimeout(() => setCopiedCerimonia(false), 2500);
    } else if (type === 'buffet') {
      setCopiedBuffet(true);
      setTimeout(() => setCopiedBuffet(false), 2500);
    }
  };

  if (isAdmin) {
    return <AdminPage onBack={() => { window.location.hash = ''; setIsAdmin(false); }} />;
  }

  // 4 Botões Circulares com a Paleta Exata da Cartela Verde Oliva Escurecida
  const circleButtons = [
    {
      id: 'cerimonia',
      label: 'Cerimônia',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7 text-[#3F4D27] group-hover:scale-110 transition-transform">
          <path d="M12 2v4M10 4h4" />
          <path d="m4 10 8-5 8 5" />
          <path d="M6 10v11h12V10" />
          <path d="M10 21v-5a2 2 0 0 1 4 0v5" />
          <path d="M9 10h6" />
        </svg>
      )
    },
    {
      id: 'buffet',
      label: 'Buffet',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7 text-[#3F4D27] group-hover:scale-110 transition-transform">
          <path d="m3 9 9-6 9 6v12H3z" />
          <path d="M7 21v-8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8" />
          <path d="M10 9h4" />
        </svg>
      )
    },
    {
      id: 'rsvp',
      label: 'Presença',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7 text-[#3F4D27] group-hover:scale-110 transition-transform">
          <circle cx="9" cy="12" r="4.5" />
          <circle cx="15" cy="11" r="4.5" />
          <path d="M15 7.5 16 6l1.5 1" />
        </svg>
      )
    },
    {
      id: 'presentes',
      label: 'Opção de presente',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7 text-[#3F4D27] group-hover:scale-110 transition-transform">
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <path d="M12 8v13" />
          <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
          <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
        </svg>
      )
    }
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F5F7EE] text-[#2F3A1D] flex items-center justify-center p-0 sm:p-4 select-none font-sans antialiased relative">
      
      {/* Cartão Central com Textura Floral em Relevo e Tons Verde Oliva da Cartela */}
      <div className="h-full w-full max-w-md max-h-[100dvh] relative flex flex-col justify-between px-6 py-4 overflow-hidden shadow-2xl bg-[#FCFDF9] sm:border sm:border-[#7A8C4B]/35 sm:rounded-3xl sm:h-[96vh]">
        
        {/* Fundo de Relevo Floral Esculpido com Folhagens Verde Oliva */}
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none -z-10 opacity-95"
          style={{ backgroundImage: `url('/wedding_olive_texture_bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-radial from-[#FCFDF9]/30 via-[#FCFDF9]/60 to-[#FCFDF9]/85 pointer-events-none -z-10" />

        {/* 1. Nomes dos Noivos */}
        <div className="pt-1 text-center relative z-10">
          <h1 className="font-cursive text-6xl sm:text-7xl text-[#3F4D27] leading-[1.05] drop-shadow-xs tracking-wide">
            Jéssica <br />
            <span className="text-4xl sm:text-5xl font-serif italic text-[#7A8C4B]">&</span> Júlio
          </h1>

          {/* Ornamento Clássico Delicado */}
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent via-[#7A8C4B]/50 to-transparent" />
            <span className="text-[#7A8C4B] text-xs font-serif tracking-widest">✦ ❦ ✦</span>
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent via-[#7A8C4B]/50 to-transparent" />
          </div>
        </div>

        {/* 2. Benção dos Pais */}
        <div className="text-center my-auto py-1 relative z-10 px-2">
          <p className="font-allura text-3xl sm:text-4xl text-[#3F4D27] leading-tight mb-2 tracking-wide font-medium">
            com a bênção de seus pais...
          </p>
          
          <div className="grid grid-cols-2 gap-4 max-w-[370px] mx-auto text-[10.5px] sm:text-[11.5px] font-cinzel uppercase tracking-[0.06em] text-[#1E2711]">
            
            {/* Coluna 1: Pais da Noiva */}
            <div className="text-center flex flex-col justify-between space-y-2.5">
              {/* Mãe */}
              <div className="border-b border-[#7A8C4B]/20 pb-1.5">
                <span className="block font-bold text-[#1E2711] leading-tight">
                  {eventDetails.paisNoiva.mae}
                </span>
              </div>
              
              {/* Pai */}
              <div className="pt-0.5">
                <span className="block font-bold text-[#1E2711] leading-tight">
                  {eventDetails.paisNoiva.pai}
                </span>
                <span className="block text-[#5B6C38] text-[9px] sm:text-[9.5px] tracking-widest lowercase italic font-serif mt-0.5">
                  (em memória)
                </span>
              </div>
            </div>

            {/* Coluna 2: Pais do Noivo */}
            <div className="text-center flex flex-col justify-between space-y-2.5">
              {/* Mãe */}
              <div className="border-b border-[#7A8C4B]/20 pb-1.5">
                <span className="block font-bold text-[#1E2711] leading-tight">
                  {eventDetails.paisNoivo.mae}
                </span>
              </div>
              
              {/* Pai */}
              <div className="pt-0.5">
                <span className="block font-bold text-[#1E2711] leading-tight">
                  {eventDetails.paisNoivo.pai}
                </span>
                <span className="block text-[#5B6C38] text-[9px] sm:text-[9.5px] tracking-widest lowercase italic font-serif mt-0.5">
                  (em memória)
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Frase de Convite */}
        <div className="text-center my-auto relative z-10">
          <p className="font-serif italic text-[13px] sm:text-[14.5px] text-[#2F3A1D] font-semibold tracking-wide">
            Convidam para a celebração do seu casamento
          </p>
        </div>

        {/* 4. BLOCO DE DATA: 14 DE NOVEMBRO DE 2026 ÀS 15:30 */}
        <div className="my-auto py-1 text-center relative z-10">
          <div className="bg-white/85 backdrop-blur-xs border border-[#7A8C4B]/35 rounded-2xl py-2 px-4 shadow-[0_4px_16px_rgba(107,122,66,0.12)] max-w-[310px] mx-auto">
            
            {/* Mês em Destaque */}
            <div className="flex items-center justify-center gap-2 mb-0.5">
              <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#7A8C4B]/40" />
              <span className="font-cinzel text-xs sm:text-sm font-bold text-[#3F4D27] tracking-[0.28em] uppercase">
                {eventDetails.month}
              </span>
              <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#7A8E65]/40" />
            </div>

            {/* Linha Central: SÁBADO | 14 | 15:30H */}
            <div className="flex items-center justify-center gap-3 my-0.5">
              <div className="text-right flex-1">
                <span className="font-cinzel text-[10.5px] sm:text-[11.5px] font-semibold text-[#6B7A42] tracking-widest uppercase block">
                  {eventDetails.dayOfWeek}
                </span>
              </div>

              <div className="h-7 w-[1.5px] bg-[#7A8C4B]/45 shrink-0" />

              <div className="px-1">
                <span className="font-serif text-5xl sm:text-6xl font-light text-[#2F3A1D] leading-none tracking-tight block">
                  {eventDetails.day}
                </span>
              </div>

              <div className="h-7 w-[1.5px] bg-[#7A8C4B]/45 shrink-0" />

              <div className="text-left flex-1">
                <span className="font-cinzel text-[10.5px] sm:text-[11.5px] font-semibold text-[#6B7A42] tracking-widest block">
                  {eventDetails.time}
                </span>
              </div>
            </div>

            {/* Ano Centralizado */}
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#7A8C4B]/40" />
              <span className="font-cinzel text-xs sm:text-sm font-bold text-[#3F4D27] tracking-[0.24em]">
                {eventDetails.year}
              </span>
              <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#7A8C4B]/40" />
            </div>
          </div>
        </div>

        {/* 5. Frase "Clique para mais detalhes" + 4 BOTÕES MAIORES */}
        <div className="pb-2 text-center pt-1 relative z-10">
          <p className="font-allura text-3xl sm:text-4xl text-[#3F4D27] leading-none mb-3 font-medium">
            Clique para mais detalhes
          </p>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 max-w-[360px] mx-auto items-start">
            {circleButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={async () => {
                  setActiveModal(btn.id);
                  if (btn.id === 'rsvp') {
                    const latest = await api.getConvidados();
                    setGuestList(latest);
                  }
                }}
                className="flex flex-col items-center group cursor-pointer outline-none transition-all duration-300 active:scale-95"
              >
                {/* Botão com Aro em Tom Verde Oliva Mais Escuro e Fundo Suave */}
                <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-[#3F4D27] via-[#556734] to-[#3F4D27] shadow-[0_6px_16px_rgba(47,58,29,0.30)] group-hover:shadow-[0_8px_24px_rgba(47,58,29,0.50)] group-hover:scale-105 transition-all duration-300">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FCFDF9] border border-[#3F4D27]/40 flex items-center justify-center group-hover:bg-[#EFF3E4] transition-colors">
                    {btn.icon}
                  </div>
                </div>

                {/* Rótulo em Fonte Aumentada e Cor Oliva Escura Mais Nítida */}
                <span className="text-[12px] sm:text-[13px] font-serif font-medium italic text-[#242D15] group-hover:text-[#3F4D27] text-center leading-tight mt-1.5 transition-colors">
                  {btn.label}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ================= MODAIS DE AÇÃO COM A PALETA VERDE OLIVA ================= */}

      {/* Modal 1: Local da Cerimônia */}
      {activeModal === 'cerimonia' && (
        <div className="fixed inset-0 z-50 bg-[#1D2513]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FCFDF9] rounded-3xl p-5 sm:p-6 w-full max-w-sm border border-[#7A8C4B]/40 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/5 text-[#6B7A42] hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[#7A8C4B]/20">
              <div className="w-10 h-10 rounded-full bg-[#6B7A42] flex items-center justify-center text-white shadow-md">
                <Church className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#3F4D27]">Local da Cerimônia</h3>
                <span className="text-[10px] text-[#6B7A42] font-sans-clean font-bold uppercase tracking-wider">Início pontual às {eventDetails.time}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#7A8C4B]/25 mb-4 shadow-xs space-y-1.5">
              <strong className="block text-sm font-cinzel font-bold text-[#3F4D27]">{eventConfig.ceremonyVenue}</strong>
              <p className="text-xs text-[#5B6C38] leading-relaxed font-sans-clean">{eventConfig.ceremonyAddress}</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard(eventConfig.ceremonyAddress, 'cerimonia')}
                className="w-full py-2.5 rounded-xl bg-white border border-[#7A8C4B]/30 text-[#5B6C38] font-sans-clean font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#F5F7EE] transition-colors"
              >
                {copiedCerimonia ? <Check className="w-4 h-4 text-[#6B7A42]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCerimonia ? 'Endereço Copiado!' : 'Copiar Endereço'}</span>
              </button>

              <a
                href={eventConfig.ceremonyMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#3F4D27] text-white font-sans-clean font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#D8E2CE]" />
                <span>Abrir no Google Maps</span>
              </a>

              <a
                href={eventConfig.ceremonyWazeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#6B7A42] text-white font-sans-clean font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#5B6C38] transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Abrir no Waze</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Local do Buffet */}
      {activeModal === 'buffet' && (
        <div className="fixed inset-0 z-50 bg-[#1D2513]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FCFDF9] rounded-3xl p-5 sm:p-6 w-full max-w-sm border border-[#7A8C4B]/40 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/5 text-[#6B7A42] hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[#7A8C4B]/20">
              <div className="w-10 h-10 rounded-full bg-[#6B7A42] flex items-center justify-center text-white shadow-md">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#3F4D27]">Local do Buffet</h3>
                <span className="text-[10px] text-[#6B7A42] font-sans-clean font-bold uppercase tracking-wider">Festa e Recepção</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#7A8C4B]/25 mb-4 shadow-xs space-y-1.5">
              <strong className="block text-sm font-cinzel font-bold text-[#3F4D27]">{eventConfig.buffetVenue}</strong>
              <p className="text-xs text-[#5B6C38] leading-relaxed font-sans-clean">{eventConfig.buffetAddress}</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard(eventConfig.buffetAddress, 'buffet')}
                className="w-full py-2.5 rounded-xl bg-white border border-[#7A8C4B]/30 text-[#5B6C38] font-sans-clean font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#F5F7EE] transition-colors"
              >
                {copiedBuffet ? <Check className="w-4 h-4 text-[#6B7A42]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedBuffet ? 'Endereço Copiado!' : 'Copiar Endereço'}</span>
              </button>

              <a
                href={eventConfig.buffetMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#3F4D27] text-white font-sans-clean font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#D8E2CE]" />
                <span>Abrir no Google Maps</span>
              </a>

              <a
                href={eventConfig.buffetWazeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#6B7A42] text-white font-sans-clean font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#5B6C38] transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Abrir no Waze</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Confirmação de Presença (RSVP) */}
      {activeModal === 'rsvp' && (
        <div className="fixed inset-0 z-50 bg-[#1D2513]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FCFDF9] rounded-3xl p-6 w-full max-w-sm border border-[#7A8C4B]/40 shadow-2xl relative">
            <button
              onClick={() => { setActiveModal(null); setRsvpSuccess(false); }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/5 text-[#6B7A42] hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-[#6B7A42] flex items-center justify-center text-white shadow-md">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#3F4D27]">Confirmação de Presença</h3>
                <span className="text-[10px] text-[#6B7A42] font-sans-clean font-bold uppercase tracking-wider">RSVP Oficial</span>
              </div>
            </div>

            {rsvpSuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 bg-[#EEF2E3] text-[#6B7A42] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-cinzel text-lg font-bold text-[#3F4D27]">Presença Confirmada!</h4>
                <p className="text-xs text-[#5B6C38] font-sans-clean font-medium">
                  <strong>{rsvpConfirmedName}</strong>, sua presença foi confirmada com muito sucesso!
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => setRsvpSuccess(false)}
                    className="w-full py-3 rounded-xl border border-[#7A8C4B]/40 text-[#6B7A42] font-sans-clean font-bold text-xs cursor-pointer hover:bg-[#F5F7EE]"
                  >
                    Confirmar outro acompanhante
                  </button>
                  <button
                    onClick={() => { setActiveModal(null); setRsvpSuccess(false); }}
                    className="w-full py-3 rounded-xl bg-[#6B7A42] text-white font-sans-clean font-bold text-xs shadow-md cursor-pointer hover:bg-[#5B6C38]"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-3.5">
                <div className="relative">
                  <label className="block text-xs font-sans-clean font-bold text-[#3F4D27] mb-1">
                    Digite seu Nome Completo:
                  </label>
                  
                  <input
                    type="text"
                    value={rsvpNome}
                    onChange={(e) => {
                      setRsvpNome(e.target.value);
                      setSelectedGuest(null);
                      if (rsvpError) setRsvpError('');
                    }}
                    placeholder="Ex: Maria Eduarda Silva"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#7A8C4B]/35 outline-none text-xs text-[#2F3A1D] font-medium focus:border-[#6B7A42] shadow-2xs"
                    disabled={rsvpLoading}
                    autoFocus
                  />

                  {/* Lista de Sugestões de Busca Conforme Digita */}
                  {rsvpNome.trim().length >= 2 && !selectedGuest && (
                    <div className="mt-1.5 max-h-40 overflow-y-auto bg-white rounded-xl border border-[#7A8C4B]/35 shadow-lg divide-y divide-[#7A8C4B]/15 z-20">
                      {guestList.filter(g => g.nome.toLowerCase().includes(rsvpNome.toLowerCase().trim())).length > 0 ? (
                        guestList
                          .filter(g => g.nome.toLowerCase().includes(rsvpNome.toLowerCase().trim()))
                          .map((g) => (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => {
                                setRsvpNome(g.nome);
                                setSelectedGuest(g);
                              }}
                              className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#EEF2E3] transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-[#2F3A1D]">{g.nome}</span>
                                {g.confirmado && (
                                  <span className="text-[9px] text-[#3F4D27] bg-[#EEF2E3] px-1.5 py-0.2 rounded font-bold">
                                    Já confirmado
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#6B7A42] font-bold">Selecionar →</span>
                            </button>
                          ))
                      ) : (
                        <div className="px-3 py-2 text-[11px] text-[#5B6C38]">
                          Nome não encontrado na pré-lista. Você pode continuar e confirmar normalmente!
                        </div>
                      )}
                    </div>
                  )}

                  {selectedGuest && (
                    <div className="mt-1.5 p-2 rounded-lg bg-[#EEF2E3] border border-[#7A8C4B]/40 flex items-center justify-between text-xs">
                      <span className="font-bold text-[#3F4D27]">✓ Convidado Selecionado: {selectedGuest.nome}</span>
                      <button 
                        type="button" 
                        onClick={() => setSelectedGuest(null)}
                        className="text-[10px] text-red-600 font-bold underline cursor-pointer"
                      >
                        Trocar
                      </button>
                    </div>
                  )}

                  {rsvpError && <p className="text-[10px] text-red-600 font-bold mt-1">{rsvpError}</p>}
                </div>

                <p className="text-[10px] text-[#6B7A42] font-sans-clean bg-[#EEF2E3] p-2.5 rounded-xl leading-relaxed">
                  Caso queira confirmar para familiares ou acompanhantes, envie um nome por vez.
                </p>

                <button
                  type="submit"
                  disabled={rsvpLoading}
                  className="w-full py-3.5 rounded-xl bg-[#6B7A42] hover:bg-[#5B6C38] text-white font-sans-clean font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {rsvpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5 text-[#D8E2CE]" />}
                  <span>{rsvpLoading ? 'Confirmando...' : 'Confirmar Presença'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal 4: Opção de Presente (Pix Sincronizado) */}
      {activeModal === 'presentes' && (
        <div className="fixed inset-0 z-50 bg-[#1D2513]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FCFDF9] rounded-3xl p-6 w-full max-w-sm border border-[#7A8C4B]/40 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/5 text-[#6B7A42] hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-[#6B7A42] flex items-center justify-center text-white shadow-md">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#3F4D27]">Opção de Presente</h3>
                <span className="text-[10px] text-[#6B7A42] font-sans-clean font-bold uppercase tracking-wider">Transferência Pix</span>
              </div>
            </div>

            <p className="text-xs text-[#5B6C38] font-sans-clean leading-relaxed mb-4 font-medium">
              Sua presença é nosso maior presente! Se desejar nos presentear de forma prática para o início da nossa vida a dois:
            </p>

            <div className="bg-white p-4 rounded-2xl border border-[#7A8C4B]/25 space-y-3 mb-4 shadow-xs">
              <div>
                <span className="block text-[10px] font-sans-clean uppercase font-bold text-[#6B7A42] mb-1.5 tracking-wider">Chave Pix</span>
                <div className="flex items-center justify-between gap-2 bg-[#EEF2E3] px-3.5 py-2.5 rounded-xl border border-[#7A8C4B]/25">
                  <span className="text-xs font-semibold text-[#2F3A1D] select-all truncate">{eventConfig.pixKey}</span>
                  <button
                    onClick={() => copyToClipboard(eventConfig.pixKey, 'pix')}
                    className="px-3 py-1.5 rounded-lg bg-[#6B7A42] text-white text-xs font-sans-clean font-bold flex items-center gap-1 shrink-0 hover:bg-[#5B6C38] transition-colors cursor-pointer shadow-2xs"
                  >
                    {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPix ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="text-xs text-[#5B6C38] font-sans-clean pt-2 border-t border-[#7A8C4B]/20 flex justify-between font-medium">
                <span>Favorecidos:</span>
                <strong className="text-[#2F3A1D]">{eventConfig.pixTitular}</strong>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-xl bg-[#6B7A42] hover:bg-[#5B6C38] text-white font-sans-clean font-bold text-xs tracking-wider uppercase shadow-sm cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
