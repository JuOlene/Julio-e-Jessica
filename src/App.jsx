import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Compass, 
  Check, 
  Gift, 
  Copy, 
  Send, 
  X, 
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

  // Pix State
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedCerimonia, setCopiedCerimonia] = useState(false);
  const [copiedBuffet, setCopiedBuffet] = useState(false);

  // Redirecionamento Direto para o WhatsApp para Confirmação de Presença
  const handleOpenWhatsAppRsvp = () => {
    const rawNumber = (eventConfig.whatsappNumber || DEFAULT_CONFIG.whatsappNumber || '5511954886391').replace(/\D/g, '');
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
      mae: "SEVERINA OLEGARIO DA SILVA",
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
    loadConfig();
    window.addEventListener('wedding_config_updated', loadConfig);
    return () => {
      window.removeEventListener('wedding_config_updated', loadConfig);
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

  // 4 Botões Circulares com Novos Símbolos Elegantes (Igreja/Alianças/Brinde/Presente Clássico)
  const circleButtons = [
    {
      id: 'cerimonia',
      label: 'Cerimônia',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8 text-[#3F4D27] group-hover:scale-110 transition-transform">
          {/* Símbolo Clássico da Igreja com Cruz e Portal */}
          <path d="M12 2v4M10 4h4" />
          <path d="M4 11 12 5l8 6v10H4z" />
          <path d="M9 21v-5a3 3 0 0 1 6 0v5" />
          <circle cx="12" cy="11" r="1.5" />
        </svg>
      )
    },
    {
      id: 'buffet',
      label: 'Buffet',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8 text-[#3F4D27] group-hover:scale-110 transition-transform">
          {/* Taças de Celebração e Brinde */}
          <path d="M7 3v6a4 4 0 0 0 4 4v7M17 3v6a4 4 0 0 1-4 4v7" />
          <path d="M5 20h14" />
          <path d="M5 3h6M13 3h6" />
        </svg>
      )
    },
    {
      id: 'rsvp',
      label: 'Presença',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8 text-[#3F4D27] group-hover:scale-110 transition-transform">
          {/* Selo Clássico com Check de Confirmação */}
          <path d="M12 2l2.4 2.8 3.7-.3 1.3 3.4 3.4 1.4-.4 3.7L24 15.4l-2.4 2.8.3 3.7-3.4 1.3-1.4 3.4-3.7-.4L12 24l-2.4-2.8-3.7.3-1.3-3.4-3.4-1.4.4-3.7L0 12.6l2.4-2.8-.3-3.7 3.4-1.3 1.4-3.4 3.7.4L12 2z" className="opacity-20 fill-[#7A8C4B]/20" />
          <path d="M9 12l2.2 2.5L16 9" strokeWidth="2.2" />
        </svg>
      )
    },
    {
      id: 'presentes',
      label: 'Opção de presente',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8 text-[#3F4D27] group-hover:scale-110 transition-transform">
          {/* Caixa de Presente Delicada com Laço de Fita */}
          <rect x="3" y="9" width="18" height="12" rx="2" />
          <path d="M12 9v12" />
          <path d="M3 14h18" />
          <path d="M12 9c-2-3-5.5-3-5.5 0s3.5 3 5.5 0c2 3 5.5 3 5.5 0s-3.5-3-5.5 0z" />
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

      {/* Cartão Central com Fundo do Modelo (Ondas Sálvia e Ramos) - Revelado com Suavidade */}
      <div className={`w-full max-w-lg min-h-[100dvh] sm:min-h-0 sm:h-[96vh] relative flex flex-col justify-center items-center shadow-[0_20px_60px_rgba(47,58,29,0.18)] bg-[#FAF8F5] sm:rounded-3xl overflow-y-auto no-scrollbar overflow-hidden p-4 sm:p-6 transition-all duration-1000 ${
        isEnvelopeOpened ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
      }`}>
        
        {/* Imagem Original Restaurada com a Arte Exata */}
        <img 
          src="/sage_original_nogold.jpg" 
          alt="Modelo Original Jessica & Julio" 
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none -z-0"
        />

        {/* Toque de cor aquarela sálvia no Canto Superior Direito */}
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-72 sm:h-72 bg-[radial-gradient(circle_at_top_right,_rgba(110,135,70,0.45)_0%,_rgba(135,155,95,0.30)_35%,_rgba(160,180,120,0.15)_60%,_transparent_80%)] pointer-events-none z-0 mix-blend-multiply" />

        {/* Toque de cor aquarela sálvia no Canto Inferior Esquerdo */}
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-72 sm:h-72 bg-[radial-gradient(circle_at_bottom_left,_rgba(110,135,70,0.45)_0%,_rgba(135,155,95,0.30)_35%,_rgba(160,180,120,0.15)_60%,_transparent_80%)] pointer-events-none z-0 mix-blend-multiply" />

        {/* Suavização das bordas e harmonia de leitura suave */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(250,248,245,0.50)_100%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/40 via-transparent to-[#FAF8F5]/45 pointer-events-none z-0" />

        {/* Conteúdo Fluido com Escala Aumentada para Visualização no Mobile */}
        <div className="w-full h-full relative z-10 flex flex-col justify-between items-center text-center px-4 sm:px-8 py-4 sm:py-7 max-w-[440px] mx-auto">

          {/* 1. Nomes dos Noivos - Grande e Destacado */}
          <div className="pt-2 sm:pt-1 text-center relative z-10 w-full">
            <h1 className="font-cursive text-5xl sm:text-7xl text-[#283516] leading-[1.08] drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)] tracking-wide">
              Jessica <br />
              <span className="text-3xl sm:text-4xl font-serif italic text-[#5E7139]">&</span> Julio
            </h1>

            {/* Ornamento Clássico Delicado */}
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-[#5E7139]/60 to-transparent" />
              <span className="text-[#5E7139] text-xs font-serif tracking-widest">✦ ❦ ✦</span>
              <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-[#5E7139]/60 to-transparent" />
            </div>
          </div>

          {/* 2. Benção dos Pais - Alinhamento de Altura Perfeito e Simétrico no Celular */}
          <div className="text-center my-2 sm:my-auto py-1 relative z-10 px-1 w-full max-w-[390px]">
            <p className="font-allura text-2xl sm:text-3xl text-[#283516] leading-tight mb-2 tracking-wide font-medium drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]">
              com a bênção de seus pais...
            </p>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-[11.5px] sm:text-[13px] font-cinzel uppercase tracking-[0.03em] sm:tracking-[0.05em] text-[#1A230F]">
              
              {/* Coluna 1: Pais da Noiva */}
              <div className="text-center flex flex-col justify-start space-y-2">
                {/* Linha das Mães com altura fixa exata */}
                <div className="border-b border-[#5E7139]/30 pb-1.5 h-[46px] sm:h-[48px] flex items-center justify-center">
                  <span className="block font-bold text-[#1A230F] leading-snug break-words drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] text-center">
                    {eventDetails.paisNoiva.mae}
                  </span>
                </div>
                {/* Linha dos Pais (Austin e Julio) com altura fixa e alinhamento idêntico */}
                <div className="pt-0.5 h-[52px] sm:h-[54px] flex flex-col justify-start items-center">
                  <span className="block font-bold text-[#1A230F] leading-snug break-words drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] text-center">
                    {eventDetails.paisNoiva.pai}
                  </span>
                  <span className="block text-[#4B5A2C] text-[10px] sm:text-[10.5px] tracking-widest lowercase italic font-serif mt-0.5 font-semibold">
                    (em memória)
                  </span>
                </div>
              </div>

              {/* Coluna 2: Pais do Noivo */}
              <div className="text-center flex flex-col justify-start space-y-2">
                {/* Linha das Mães com altura fixa exata */}
                <div className="border-b border-[#5E7139]/30 pb-1.5 h-[46px] sm:h-[48px] flex items-center justify-center">
                  <span className="block font-bold text-[#1A230F] leading-snug break-words drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] text-center">
                    {eventDetails.paisNoivo.mae}
                  </span>
                </div>
                {/* Linha dos Pais (Austin e Julio) com altura fixa e alinhamento idêntico */}
                <div className="pt-0.5 h-[52px] sm:h-[54px] flex flex-col justify-start items-center">
                  <span className="block font-bold text-[#1A230F] leading-snug break-words drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] text-center">
                    {eventDetails.paisNoivo.pai}
                  </span>
                  <span className="block text-[#4B5A2C] text-[10px] sm:text-[10.5px] tracking-widest lowercase italic font-serif mt-0.5 font-semibold">
                    (em memória)
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Frase de Convite - Maior e Mais Nítida */}
          <div className="text-center my-1.5 sm:my-auto relative z-10 w-full px-2">
            <p className="font-serif italic text-[14px] sm:text-[16px] text-[#242F16] font-semibold tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]">
              Convidam para a celebração do seu casamento
            </p>
          </div>

          {/* 4. BLOCO DE DATA: 14 DE NOVEMBRO DE 2026 ÀS 17:30 - Mais Imponente */}
          <div className="my-2 sm:my-auto py-1 text-center relative z-10 w-full">
            <div className="bg-[#FAF8F5]/90 backdrop-blur-xs border border-[#7A8C4B]/40 rounded-2xl py-2.5 px-4 sm:px-6 shadow-[0_4px_16px_rgba(47,58,29,0.09)] max-w-[340px] sm:max-w-[360px] mx-auto transition-all">
              
              {/* Mês em Destaque */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#7A8C4B]/50" />
                <span className="font-cinzel text-xs sm:text-sm font-bold text-[#283516] tracking-[0.24em] sm:tracking-[0.28em] uppercase">
                  {eventDetails.month}
                </span>
                <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#7A8C4B]/50" />
              </div>

              {/* Linha Central: SÁBADO | 14 | 17:30H */}
              <div className="flex items-center justify-center gap-3 my-0.5">
                <div className="text-right flex-1">
                  <span className="font-cinzel text-[11px] sm:text-[12.5px] font-bold text-[#47572B] tracking-wider uppercase block">
                    {eventDetails.dayOfWeek}
                  </span>
                </div>

                <div className="h-8 w-[1.5px] bg-[#7A8C4B]/45 shrink-0" />

                <div className="px-1.5">
                  <span className="font-serif text-4xl sm:text-6xl font-light text-[#1B2410] leading-none tracking-tight block">
                    {eventDetails.day}
                  </span>
                </div>

                <div className="h-8 w-[1.5px] bg-[#7A8C4B]/45 shrink-0" />

                <div className="text-left flex-1">
                  <span className="font-cinzel text-[11px] sm:text-[12.5px] font-bold text-[#47572B] tracking-wider block">
                    {eventDetails.time}
                  </span>
                </div>
              </div>

              {/* Ano Centralizado */}
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#7A8C4B]/50" />
                <span className="font-cinzel text-xs sm:text-sm font-bold text-[#283516] tracking-[0.22em] sm:tracking-[0.26em]">
                  {eventDetails.year}
                </span>
                <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#7A8C4B]/50" />
              </div>
            </div>
          </div>

          {/* 5. Frase "Clique para mais detalhes" + 4 BOTÕES MAIORES NO CELULAR */}
          <div className="pb-2 text-center pt-2 relative z-10 w-full">
            <p className="font-allura text-2xl sm:text-4xl text-[#283516] leading-none mb-3 font-medium drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]">
              Clique para mais detalhes
            </p>

            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-[380px] mx-auto items-start">
              {circleButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => {
                    setActiveModal(btn.id);
                  }}
                  className="flex flex-col items-center group cursor-pointer outline-none transition-all duration-300 active:scale-95"
                >
                  {/* Botão com Aro Aumentado e Ícone Bem Visível */}
                  <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-[#3F4D27] via-[#556734] to-[#3F4D27] shadow-[0_5px_16px_rgba(47,58,29,0.25)] group-hover:shadow-[0_8px_24px_rgba(47,58,29,0.48)] group-hover:scale-105 transition-all duration-300">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FAF8F5] border border-[#3F4D27]/30 flex items-center justify-center group-hover:bg-[#EFF3E4] transition-colors">
                      {btn.icon}
                    </div>
                  </div>

                  {/* Rótulo Maior e em Alto Contraste */}
                  <span className="text-[12px] sm:text-[13.5px] font-serif font-bold italic text-[#1A230F] group-hover:text-[#3F4D27] text-center leading-tight mt-1.5 transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)]">
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
              <div className="w-11 h-11 rounded-full bg-[#6B7A42] flex items-center justify-center text-white shadow-md">
                <Church className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#3F4D27]">Local da Cerimônia</h3>
                <span className="text-[10.5px] text-[#6B7A42] font-sans-clean font-bold uppercase tracking-wider">Início pontual às {eventDetails.time}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#7A8C4B]/25 mb-4 shadow-xs space-y-1.5">
              <strong className="block text-sm font-cinzel font-bold text-[#3F4D27]">{eventConfig.ceremonyVenue}</strong>
              <p className="text-xs text-[#5B6C38] leading-relaxed font-sans-clean">{eventConfig.ceremonyAddress}</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard(eventConfig.ceremonyAddress, 'cerimonia')}
                className="w-full py-3 rounded-xl bg-white border border-[#7A8C4B]/30 text-[#5B6C38] font-sans-clean font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#F5F7EE] transition-colors"
              >
                {copiedCerimonia ? <Check className="w-4 h-4 text-[#6B7A42]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCerimonia ? 'Endereço Copiado!' : 'Copiar Endereço'}</span>
              </button>

              <a
                href={eventConfig.ceremonyMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-[#3F4D27] text-white font-sans-clean font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#D8E2CE]" />
                <span>Abrir no Google Maps</span>
              </a>

              <a
                href={eventConfig.ceremonyWazeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-[#6B7A42] text-white font-sans-clean font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#5B6C38] transition-colors"
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
              <div className="w-11 h-11 rounded-full bg-[#6B7A42] flex items-center justify-center text-white shadow-md">
                <Utensils className="w-6 h-6" />
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
                className="w-full py-3 rounded-xl bg-white border border-[#7A8C4B]/30 text-[#5B6C38] font-sans-clean font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#F5F7EE] transition-colors"
              >
                {copiedBuffet ? <Check className="w-4 h-4 text-[#6B7A42]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedBuffet ? 'Endereço Copiado!' : 'Copiar Endereço'}</span>
              </button>

              <a
                href={eventConfig.buffetMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-[#3F4D27] text-white font-sans-clean font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#D8E2CE]" />
                <span>Abrir no Google Maps</span>
              </a>

              <a
                href={eventConfig.buffetWazeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-[#6B7A42] text-white font-sans-clean font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#5B6C38] transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Abrir no Waze</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Confirmação de Presença (RSVP via WhatsApp Direto) */}
      {activeModal === 'rsvp' && (
        <div className="fixed inset-0 z-50 bg-[#1D2513]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FCFDF9] rounded-3xl p-6 sm:p-7 w-full max-w-sm border border-[#7A8C4B]/40 shadow-2xl relative text-center">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/5 text-[#6B7A42] hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="py-2 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-[#EEF2E3] text-[#6B7A42] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Send className="w-7 h-7 text-[#6B7A42]" />
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

              <div className="p-3.5 bg-[#EEF2E3] rounded-2xl border border-[#7A8C4B]/25 text-left text-xs font-serif italic text-[#2F3A1D] leading-relaxed">
                "{eventConfig.whatsappMessage || DEFAULT_CONFIG.whatsappMessage}"
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  onClick={() => {
                    handleOpenWhatsAppRsvp();
                    setActiveModal(null);
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
          </div>
        </div>
      )}

      {/* Modal 4: Opção de Presente (Pix Sincronizado: 11 954886391) */}
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
                  <span className="text-sm font-bold text-[#2F3A1D] select-all tracking-wide">{eventConfig.pixKey}</span>
                  <button
                    onClick={() => copyToClipboard(eventConfig.pixKey, 'pix')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#6B7A42] text-white text-xs font-sans-clean font-bold flex items-center gap-1.5 shrink-0 hover:bg-[#5B6C38] transition-colors cursor-pointer shadow-2xs"
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
