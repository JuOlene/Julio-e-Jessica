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
import EnvelopeIntro from './components/EnvelopeIntro';

export default function App() {
  const [activeModal, setActiveModal] = useState(null); // 'cerimonia' | 'buffet' | 'rsvp' | 'presentes' | null
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);

  // Configurações Dinâmicas dos Locais e Pix
  const [eventConfig, setEventConfig] = useState(DEFAULT_CONFIG);

  // Áudio de Fundo Automático sem Botão
  const [musicStarted, setMusicStarted] = useState(false);

  useEffect(() => {
    const audio = new Audio(eventConfig.musicUrl || DEFAULT_CONFIG.musicUrl);
    audio.loop = true;
    audio.volume = 0.45;

    const playAudio = () => {
      audio.play().then(() => {
        setMusicStarted(true);
        window.removeEventListener('click', playAudio);
        window.removeEventListener('touchstart', playAudio);
        window.removeEventListener('scroll', playAudio);
      }).catch(() => {
        // Bloqueado pelo navegador até primeira interação
      });
    };

    // Tenta tocar automaticamente ao carregar
    playAudio();

    // Toca imediatamente no primeiro toque/clique/scroll do usuário caso autoplay seja bloqueado
    window.addEventListener('click', playAudio);
    window.addEventListener('touchstart', playAudio);
    window.addEventListener('scroll', playAudio);

    return () => {
      audio.pause();
      window.removeEventListener('click', playAudio);
      window.removeEventListener('touchstart', playAudio);
      window.removeEventListener('scroll', playAudio);
    };
  }, [eventConfig.musicUrl]);

  // Countdown State: 14/11/2026 às 17:30
  const weddingDate = '2026-11-14T17:30:00';
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

  // Redirecionamento Direto para o WhatsApp para Confirmação de Presença
  const handleOpenWhatsAppRsvp = () => {
    const rawNumber = (eventConfig.whatsappNumber || DEFAULT_CONFIG.whatsappNumber || '5511999999999').replace(/\D/g, '');
    const defaultMsg = eventConfig.whatsappMessage || DEFAULT_CONFIG.whatsappMessage;
    const encodedMsg = encodeURIComponent(defaultMsg);
    const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank');
  };

  // Informações Fixas da Data & Famílias
  const eventDetails = {
    month: "NOVEMBRO",
    dayOfWeek: "SÁBADO",
    day: "14",
    year: "2026",
    time: "17:30H",

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
    <div className="min-h-[100dvh] w-full bg-[#ECE8E1] text-[#2F3A1D] flex items-center justify-center p-0 sm:p-4 select-none font-sans antialiased relative">
      
      {/* TELA DE ABERTURA EM FORMATO DE ENVELOPE DE CASAMENTO */}
      {!isEnvelopeOpened && (
        <EnvelopeIntro 
          onOpen={() => {
            setIsEnvelopeOpened(true);
          }} 
        />
      )}

      {/* Cartão Central com Fundo do Modelo (Ondas Sálvia, Moldura Dourada e Ramos) - Revelado com Suavidade */}
      <div className={`w-full max-w-lg min-h-[100dvh] sm:min-h-0 sm:h-[96vh] relative flex flex-col justify-center items-center shadow-[0_20px_60px_rgba(47,58,29,0.18)] bg-[#FAF8F5] sm:rounded-3xl overflow-y-auto no-scrollbar overflow-hidden p-3.5 sm:p-6 transition-all duration-1000 ${
        isEnvelopeOpened ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
      }`}>
        
        {/* Imagem Original Restaurada com a Arte Exata (sem a moldura retangular dourada) */}
        <img 
          src="/sage_original_nogold.jpg" 
          alt="Modelo Original Jessica & Julio" 
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none -z-0"
        />

        {/* Toque de cor aquarela sálvia bem visível no Canto Superior Direito */}
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-72 sm:h-72 bg-[radial-gradient(circle_at_top_right,_rgba(110,135,70,0.45)_0%,_rgba(135,155,95,0.30)_35%,_rgba(160,180,120,0.15)_60%,_transparent_80%)] pointer-events-none z-0 mix-blend-multiply" />

        {/* Toque de cor aquarela sálvia bem visível no Canto Inferior Esquerdo */}
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-72 sm:h-72 bg-[radial-gradient(circle_at_bottom_left,_rgba(110,135,70,0.45)_0%,_rgba(135,155,95,0.30)_35%,_rgba(160,180,120,0.15)_60%,_transparent_80%)] pointer-events-none z-0 mix-blend-multiply" />

        {/* Suavização das bordas e harmonia de leitura suave */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(250,248,245,0.50)_100%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/40 via-transparent to-[#FAF8F5]/45 pointer-events-none z-0" />

        {/* Conteúdo Fluido com Escala Ampliada e Centralizado com Perfeição */}
        <div className="w-full h-full relative z-10 flex flex-col justify-between items-center text-center px-5 sm:px-8 py-5 sm:py-7 max-w-[420px] mx-auto">

          {/* 1. Nomes dos Noivos - Ampliado e Destacado */}
          <div className="pt-2 sm:pt-1 text-center relative z-10 w-full">
            <h1 className="font-cursive text-5xl sm:text-7xl text-[#283516] leading-[1.08] drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] tracking-wide">
              Jessica <br />
              <span className="text-3xl sm:text-4xl font-serif italic text-[#5E7139]">&</span> Julio
            </h1>

            {/* Ornamento Clássico Delicado */}
            <div className="flex items-center justify-center gap-2 mt-1 sm:mt-1">
              <span className="h-[1px] w-9 bg-gradient-to-r from-transparent via-[#5E7139]/50 to-transparent" />
              <span className="text-[#5E7139] text-xs font-serif tracking-widest">✦ ❦ ✦</span>
              <span className="h-[1px] w-9 bg-gradient-to-r from-transparent via-[#5E7139]/50 to-transparent" />
            </div>
          </div>

          {/* 2. Benção dos Pais - Tamanho Aumentado */}
          <div className="text-center my-2 sm:my-auto py-1 relative z-10 px-1 w-full max-w-[360px]">
            <p className="font-allura text-2xl sm:text-3xl text-[#283516] leading-tight mb-2 tracking-wide font-medium drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
              com a bênção de seus pais...
            </p>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-[11px] sm:text-[12.5px] font-cinzel uppercase tracking-[0.03em] sm:tracking-[0.05em] text-[#1A230F]">
              
              {/* Coluna 1: Pais da Noiva */}
              <div className="text-center flex flex-col justify-between space-y-1.5">
                <div className="border-b border-[#5E7139]/25 pb-1 min-h-[34px] flex items-center justify-center">
                  <span className="block font-bold text-[#1A230F] leading-tight break-words drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                    {eventDetails.paisNoiva.mae}
                  </span>
                </div>
                <div className="pt-0.5">
                  <span className="block font-bold text-[#1A230F] leading-tight break-words drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                    {eventDetails.paisNoiva.pai}
                  </span>
                  <span className="block text-[#4B5A2C] text-[9.5px] sm:text-[10px] tracking-widest lowercase italic font-serif mt-0.5">
                    (em memória)
                  </span>
                </div>
              </div>

              {/* Coluna 2: Pais do Noivo */}
              <div className="text-center flex flex-col justify-between space-y-1.5">
                <div className="border-b border-[#5E7139]/25 pb-1 min-h-[34px] flex items-center justify-center">
                  <span className="block font-bold text-[#1A230F] leading-tight break-words drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                    {eventDetails.paisNoivo.mae}
                  </span>
                </div>
                <div className="pt-0.5">
                  <span className="block font-bold text-[#1A230F] leading-tight break-words drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                    {eventDetails.paisNoivo.pai}
                  </span>
                  <span className="block text-[#4B5A2C] text-[9.5px] sm:text-[10px] tracking-widest lowercase italic font-serif mt-0.5">
                    (em memória)
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Frase de Convite - Fonte Enriquecida */}
          <div className="text-center my-1.5 sm:my-auto relative z-10 w-full px-2">
            <p className="font-serif italic text-[13px] sm:text-[15.5px] text-[#242F16] font-semibold tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
              Convidam para a celebração do seu casamento
            </p>
          </div>

          {/* 4. BLOCO DE DATA: 14 DE NOVEMBRO DE 2026 ÀS 17:30 - Escala Imponente */}
          <div className="my-2.5 sm:my-auto py-1 text-center relative z-10 w-full">
            <div className="bg-[#FAF8F5]/85 backdrop-blur-[2px] border border-[#7A8C4B]/40 rounded-2xl py-2.5 px-4 sm:px-6 shadow-[0_4px_16px_rgba(47,58,29,0.09)] max-w-[320px] sm:max-w-[340px] mx-auto transition-all">
              
              {/* Mês em Destaque */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#7A8C4B]/45" />
                <span className="font-cinzel text-xs sm:text-sm font-bold text-[#283516] tracking-[0.24em] sm:tracking-[0.28em] uppercase">
                  {eventDetails.month}
                </span>
                <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#7A8C4B]/45" />
              </div>

              {/* Linha Central: SÁBADO | 14 | 17:30H */}
              <div className="flex items-center justify-center gap-3 my-0.5">
                <div className="text-right flex-1">
                  <span className="font-cinzel text-[10.5px] sm:text-[12px] font-semibold text-[#526333] tracking-widest uppercase block">
                    {eventDetails.dayOfWeek}
                  </span>
                </div>

                <div className="h-7 w-[1.5px] bg-[#7A8C4B]/40 shrink-0" />

                <div className="px-1">
                  <span className="font-serif text-4xl sm:text-6xl font-light text-[#1B2410] leading-none tracking-tight block">
                    {eventDetails.day}
                  </span>
                </div>

                <div className="h-7 w-[1.5px] bg-[#7A8C4B]/40 shrink-0" />

                <div className="text-left flex-1">
                  <span className="font-cinzel text-[10.5px] sm:text-[12px] font-semibold text-[#526333] tracking-widest block">
                    {eventDetails.time}
                  </span>
                </div>
              </div>

              {/* Ano Centralizado */}
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#7A8C4B]/45" />
                <span className="font-cinzel text-xs sm:text-sm font-bold text-[#283516] tracking-[0.22em] sm:tracking-[0.24em]">
                  {eventDetails.year}
                </span>
                <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#7A8C4B]/45" />
              </div>
            </div>
          </div>

          {/* 5. Frase "Clique para mais detalhes" + 4 BOTÕES MAIORES */}
          <div className="pb-2.5 sm:pb-2 text-center pt-2 relative z-10 w-full">
            <p className="font-allura text-2xl sm:text-4xl text-[#283516] leading-none mb-2.5 font-medium drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
              Clique para mais detalhes
            </p>

            <div className="grid grid-cols-4 gap-2 sm:gap-3.5 max-w-[360px] mx-auto items-start">
              {circleButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={async () => {
                    setActiveModal(btn.id);
                  }}
                  className="flex flex-col items-center group cursor-pointer outline-none transition-all duration-300 active:scale-95"
                >
                  {/* Botão com Aro em Tom Verde Oliva Mais Escuro e Fundo Suave */}
                  <div className="relative p-[2.5px] sm:p-[3px] rounded-full bg-gradient-to-tr from-[#3F4D27] via-[#556734] to-[#3F4D27] shadow-[0_4px_14px_rgba(47,58,29,0.22)] group-hover:shadow-[0_8px_24px_rgba(47,58,29,0.48)] group-hover:scale-105 transition-all duration-300">
                    <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-[#FAF8F5] border border-[#3F4D27]/30 flex items-center justify-center group-hover:bg-[#EFF3E4] transition-colors">
                      {btn.icon}
                    </div>
                  </div>

                  {/* Rótulo em Fonte Aumentada e Cor Oliva Escura Mais Nítida */}
                  <span className="text-[11px] sm:text-[13px] font-serif font-medium italic text-[#1E2711] group-hover:text-[#3F4D27] text-center leading-tight mt-1.5 transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                    {btn.label}
                  </span>
                </button>
              ))}
            </div>
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

      {/* Modal 3: Confirmação de Presença (RSVP via WhatsApp) */}
      {activeModal === 'rsvp' && (
        <div className="fixed inset-0 z-50 bg-[#1D2513]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FCFDF9] rounded-3xl p-6 sm:p-8 w-full max-w-sm border border-[#7A8C4B]/40 shadow-2xl relative text-center">
            <button
              onClick={() => { setActiveModal(null); setRsvpSuccess(false); }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/5 text-[#6B7A42] hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {rsvpSuccess ? (
              <div className="py-2 space-y-3 animate-fadeIn">
                <div className="w-16 h-16 bg-[#EEF2E3] text-[#6B7A42] rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-9 h-9 text-[#6B7A42] animate-bounce" />
                </div>

                <span className="text-[10px] text-[#6B7A42] font-sans-clean font-bold uppercase tracking-widest block">
                  RSVP Oficial
                </span>
                
                <h3 className="font-cinzel text-xl font-bold text-[#3F4D27]">
                  Presença Confirmada!
                </h3>

                <p className="text-xs text-[#5B6C38] font-sans-clean leading-relaxed px-2">
                  Que alegria! Sua presença foi confirmada com sucesso junto aos noivos. Mal podemos esperar para celebrar esse dia tão especial juntos! ❤️✨
                </p>

                <div className="pt-3">
                  <button
                    onClick={() => { setActiveModal(null); setRsvpSuccess(false); }}
                    className="w-full py-3.5 rounded-xl bg-[#6B7A42] hover:bg-[#5B6C38] text-white font-sans-clean font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-2 space-y-4 animate-fadeIn">
                <div className="w-14 h-14 bg-[#EEF2E3] text-[#6B7A42] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <UserCheck className="w-7 h-7 text-[#6B7A42]" />
                </div>

                <div>
                  <span className="text-[10px] text-[#6B7A42] font-sans-clean font-bold uppercase tracking-widest block mb-1">
                    RSVP Oficial
                  </span>
                  <h3 className="font-cinzel text-lg font-bold text-[#3F4D27]">
                    Confirmar Presença
                  </h3>
                </div>

                <p className="text-xs text-[#5B6C38] font-sans-clean leading-relaxed px-2">
                  Clique no botão abaixo para abrir o WhatsApp dos noivos com sua mensagem de confirmação pronta para envio:
                </p>

                <div className="p-3 bg-[#EEF2E3] rounded-2xl border border-[#7A8C4B]/25 text-left text-xs font-serif italic text-[#2F3A1D] leading-relaxed">
                  "{eventConfig.whatsappMessage || DEFAULT_CONFIG.whatsappMessage}"
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    onClick={() => {
                      handleOpenWhatsAppRsvp();
                      setRsvpSuccess(true);
                      triggerConfetti();
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#6B7A42] hover:bg-[#5B6C38] text-white font-sans-clean font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4 text-[#D8E2CE]" />
                    <span>Enviar Confirmação no WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-2.5 rounded-xl text-[#7A8C4B] hover:text-[#3F4D27] font-sans-clean font-bold text-xs cursor-pointer transition-colors"
                  >
                    Voltar ao convite
                  </button>
                </div>
              </div>
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
