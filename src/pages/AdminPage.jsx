import React, { useState, useEffect } from 'react';
import { api, DEFAULT_CONFIG } from '../services/api';
import {
  Lock, Users, Download, Trash2, Search, CheckCircle2, 
  RefreshCw, LogOut, Home, Sparkles, Calendar, Eye, EyeOff,
  X, UserCheck, ChevronRight, FileSpreadsheet, Menu,
  Plus, Clock, MapPin, Gift, Church, Utensils, Save, Edit3, Settings
} from 'lucide-react';

export default function AdminPage({ onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // activeTab: 'resumo' | 'convidados' | 'locais' | 'pix'
  const [activeTab, setActiveTab] = useState('resumo');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Convidados
  const [convidados, setConvidados] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [newConvidadoNome, setNewConvidadoNome] = useState('');
  const [addingConvidado, setAddingConvidado] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Configurações Editáveis (Localização & Pix)
  const [config, setConfig] = useState(() => api.getConfig());
  const [savingConfig, setSavingConfig] = useState(false);

  // Contador de dias restantes para o casamento: 14/11/2026 às 17:30
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const target = new Date('2026-11-14T17:30:00').getTime();
    const now = new Date().getTime();
    const diff = target - now;
    if (diff > 0) {
      setDaysLeft(Math.floor(diff / (1000 * 60 * 60 * 24)));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
      setConfig(api.getConfig());
    }

    const handleSync = () => {
      if (isAuthenticated) {
        loadAllData();
      }
    };
    window.addEventListener('wedding_guests_updated', handleSync);
    window.addEventListener('wedding_config_updated', () => setConfig(api.getConfig()));
    return () => {
      window.removeEventListener('wedding_guests_updated', handleSync);
      window.removeEventListener('wedding_config_updated', () => setConfig(api.getConfig()));
    };
  }, [isAuthenticated]);

  const handleGoHome = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.hash = '';
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await api.adminLogin(password);
      if (res.success) {
        setIsAuthenticated(true);
        setPassword('');
        setActiveTab('resumo');
      }
    } catch (err) {
      setLoginError(err.message || 'Senha incorreta. Tente novamente.');
    }
  };

  const loadAllData = async () => {
    setLoadingData(true);
    try {
      const convData = await api.getConvidados();
      setConvidados(convData);
      setConfig(api.getConfig());
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSaveLocations = (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const updatedConfig = {
        ...config,
        ceremonyMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.ceremonyAddress)}`,
        ceremonyWazeUrl: `https://waze.com/ul?q=${encodeURIComponent(config.ceremonyAddress)}`,
        buffetMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.buffetAddress)}`,
        buffetWazeUrl: `https://waze.com/ul?q=${encodeURIComponent(config.buffetAddress)}`,
      };
      api.saveConfig(updatedConfig);
      setConfig(updatedConfig);
      setSavingConfig(false);
      setActionMessage('Endereços salvos com sucesso!');
      setActiveTab('resumo');
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert(err.message);
      setSavingConfig(false);
    }
  };

  const handleSavePix = (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      api.saveConfig(config);
      setSavingConfig(false);
      setActionMessage('Informações do Pix salvas com sucesso!');
      setActiveTab('resumo');
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert(err.message);
      setSavingConfig(false);
    }
  };

  const handleAddConvidado = async (e) => {
    e.preventDefault();
    if (!newConvidadoNome.trim()) return;
    setAddingConvidado(true);
    try {
      const added = await api.addConvidado(newConvidadoNome.trim(), false); // Cadastra como pendente/aguardando
      setConvidados(prev => [added, ...prev.filter(c => c.id !== added.id)]);
      setNewConvidadoNome('');
      setActionMessage(`"${added.nome}" adicionado à lista (Aguardando confirmação)!`);
      setTimeout(() => setActionMessage(''), 4000);
      await loadAllData();
    } catch (err) {
      alert(err.message || 'Erro ao adicionar convidado.');
    } finally {
      setAddingConvidado(false);
    }
  };

  const handleDeleteConvidado = async (id, nome) => {
    try {
      setConvidados(prev => prev.filter(c => String(c.id) !== String(id)));
      await api.deleteConvidado(id);
      setActionMessage(`"${nome}" removido da lista.`);
      setTimeout(() => setActionMessage(''), 4000);
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    if (convidados.length === 0) {
      alert('Nenhum convidado cadastrado para exportar.');
      return;
    }
    const headers = 'ID,Nome do Convidado,Status,Data de Confirmacao\n';
    const rows = convidados.map(c => 
      `"${c.id}","${c.nome.replace(/"/g, '""')}","${c.confirmado ? 'Confirmado' : 'Aguardando'}","${c.data_confirmacao || '-'}"`
    ).join('\n');
    const blob = new Blob(["\ufeff" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Lista_Convidados_Jessica_e_Julio.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredConvidados = convidados.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCadastrados = convidados.length;
  const totalConfirmados = convidados.filter(c => c.confirmado).length;
  const totalPendentes = convidados.filter(c => !c.confirmado).length;

  /* ─────────────────────────────────────────────────────────────
     TELA DE LOGIN
  ───────────────────────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F7EE] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url('/wedding_embossed_luxury_bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F7EE]/80 via-[#FCFDF9]/85 to-[#F5F7EE]/95 pointer-events-none" />

        <div className="w-full max-w-md bg-[#FCFDF9] rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-[#7A8C4B]/35 animate-fadeIn">
          <div className="pt-10 pb-5 px-8 text-center relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF2E3] border border-[#7A8C4B]/30 flex items-center justify-center mx-auto mb-3 shadow-xs text-[#6B7A42]">
              <Lock className="w-6 h-6" />
            </div>

            <span className="text-[10px] uppercase tracking-[0.25em] text-[#6B7A42] font-bold block mb-1">Acesso Privado</span>
            <h1 className="font-cursive text-5xl text-[#3F4D27] my-0 font-normal">
              Jessica & Julio
            </h1>
            <p className="text-xs text-[#5B6C38] font-medium tracking-wide mt-1">
              Painel de Administração Oficial
            </p>
          </div>

          <div className="px-8 pb-10 relative z-10">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#3F4D27] mb-2">
                  Senha dos Noivos
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha de acesso"
                    className="w-full pl-4 pr-11 py-3.5 rounded-xl bg-white border border-[#7A8C4B]/35 focus:border-[#6B7A42] focus:ring-2 focus:ring-[#6B7A42]/20 outline-none text-xs font-medium text-[#2F3A1D] shadow-xs transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5B6C38] hover:text-[#3F4D27] transition-colors p-1 cursor-pointer"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {loginError && (
                  <div className="mt-2.5 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-2">
                    <span>⚠️ {loginError}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#6B7A42] hover:bg-[#5B6C38] text-white font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Entrar no Painel
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-[#7A8C4B]/25 text-center">
              <a
                href="#inicio"
                onClick={() => { window.location.hash = ''; }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7A42] hover:text-[#3F4D27] transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Voltar para o Convite Oficial</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     PAINEL AUTENTICADO
  ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F5F7EE] text-[#2F3A1D] font-sans relative overflow-x-hidden select-none">
      
      {/* Topbar Nobre em Verde Oliva */}
      <header className="bg-[#3F4D27] text-white px-4 sm:px-8 py-3.5 sticky top-0 z-40 shadow-md border-b border-[#7A8C4B]/35">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#6B7A42] hover:bg-[#5B6C38] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
              title="Abrir Menu"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
            </button>

            <button
              onClick={() => setActiveTab('resumo')}
              className="flex items-center gap-2 text-left cursor-pointer"
            >
              <span className="font-cursive text-2xl sm:text-3xl text-[#EEF2E3] font-normal leading-none">
                Jessica & Julio
              </span>
              <span className="hidden md:inline-block ml-2 px-2 py-0.5 rounded-full bg-[#6B7A42]/40 border border-[#7A8C4B]/35 text-[9px] uppercase font-bold tracking-widest text-[#EEF2E3]">
                Painel Geral
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#inicio"
              onClick={() => { window.location.hash = ''; }}
              className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl font-semibold transition-all border border-white/10"
              title="Abrir o convite"
            >
              <Home className="w-3.5 h-3.5 text-[#D8E2CE]" />
              <span className="hidden sm:inline">Ver Convite</span>
            </a>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-1 text-xs text-red-200 hover:text-white bg-red-900/30 hover:bg-red-800/50 px-3 py-1.5 rounded-xl font-semibold transition-all border border-red-500/20 cursor-pointer"
              title="Sair"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Lateral */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-xs sm:max-w-sm bg-[#FCFDF9] shadow-2xl border-r border-[#7A8C4B]/35 flex flex-col justify-between relative z-10 overflow-hidden">
              
              <div>
                <div className="p-5 bg-[#3F4D27] text-white flex items-center justify-between border-b border-[#7A8C4B]/35">
                  <div>
                    <h3 className="font-cursive text-2xl text-[#EEF2E3] leading-tight">
                      Jessica & Julio
                    </h3>
                    <p className="text-[9px] text-[#D8E2CE] uppercase tracking-widest font-bold">
                      Gerenciamento Completo
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7A42] block mb-1">
                    Módulos de Gestão
                  </span>

                  <button
                    onClick={() => { setActiveTab('resumo'); setIsDrawerOpen(false); }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'resumo'
                        ? 'bg-[#6B7A42] text-white border-[#6B7A42] shadow-xs'
                        : 'bg-white hover:bg-[#EEF2E3] text-[#2F3A1D] border-[#7A8C4B]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-bold text-xs">Visão Geral</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => { setActiveTab('convidados'); setIsDrawerOpen(false); }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'convidados'
                        ? 'bg-[#6B7A42] text-white border-[#6B7A42] shadow-xs'
                        : 'bg-white hover:bg-[#EEF2E3] text-[#2F3A1D] border-[#7A8C4B]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-4 h-4" />
                      <span className="font-bold text-xs">Lista de Convidados</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20">
                      {totalConfirmados}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('locais'); setConfig(api.getConfig()); setIsDrawerOpen(false); }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'locais'
                        ? 'bg-[#6B7A42] text-white border-[#6B7A42] shadow-xs'
                        : 'bg-white hover:bg-[#EEF2E3] text-[#2F3A1D] border-[#7A8C4B]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4" />
                      <span className="font-bold text-xs">Editar Locais (Cerimônia & Buffet)</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => { setActiveTab('pix'); setConfig(api.getConfig()); setIsDrawerOpen(false); }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'pix'
                        ? 'bg-[#6B7A42] text-white border-[#6B7A42] shadow-xs'
                        : 'bg-white hover:bg-[#EEF2E3] text-[#2F3A1D] border-[#7A8C4B]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Gift className="w-4 h-4" />
                      <span className="font-bold text-xs">Editar Chave Pix & Presentes</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-[#7A8C4B]/25">
                <button
                  onClick={() => { setIsAuthenticated(false); setIsDrawerOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair do Painel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {actionMessage && (
          <div className="p-3.5 bg-green-50 text-green-800 rounded-2xl border border-green-200 text-xs flex items-center gap-2 font-bold shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Abas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('resumo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'resumo' ? 'bg-[#6B7A42] text-white shadow-xs' : 'bg-white text-[#2F3A1D] border border-[#7A8C4B]/30'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('convidados')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'convidados' ? 'bg-[#6B7A42] text-white shadow-xs' : 'bg-white text-[#2F3A1D] border border-[#7A8C4B]/30'
            }`}
          >
            Convidados ({totalConfirmados})
          </button>
          <button
            onClick={() => { setActiveTab('locais'); setConfig(api.getConfig()); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'locais' ? 'bg-[#6B7A42] text-white shadow-xs' : 'bg-white text-[#2F3A1D] border border-[#7A8C4B]/30'
            }`}
          >
            Editar Locais
          </button>
          <button
            onClick={() => { setActiveTab('pix'); setConfig(api.getConfig()); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'pix' ? 'bg-[#6B7A42] text-white shadow-xs' : 'bg-white text-[#2F3A1D] border border-[#7A8C4B]/30'
            }`}
          >
            Editar Pix
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            TELA 1: RESUMO GERAL
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'resumo' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-[#3F4D27] rounded-3xl p-6 text-white shadow-lg border border-[#7A8C4B]/35 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B7A42]/50 border border-[#7A8C4B]/40 text-[10px] font-bold uppercase tracking-widest text-[#D8E2CE] mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Casamento Oficial
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                  Olá, Jessica & Julio! ❤️
                </h2>
                <p className="text-xs text-white/80 mt-1 max-w-lg">
                  Controle os convidados, edite os locais da cerimônia e buffet e gerencie a chave Pix em tempo real.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs px-5 py-3 rounded-2xl border border-white/15 flex items-center gap-3 shrink-0 shadow-inner">
                <Calendar className="w-7 h-7 text-[#D8E2CE]" />
                <div className="text-left">
                  <span className="block text-2xl font-serif font-bold text-[#EEF2E3]">{daysLeft} Dias</span>
                  <span className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">14/11/2026 às 17:30h</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div 
                onClick={() => setActiveTab('convidados')}
                className="bg-[#FCFDF9] rounded-3xl p-5 border border-[#7A8C4B]/35 shadow-xs hover:shadow-md transition-all cursor-pointer hover:border-[#6B7A42]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-[#6B7A42]">Presenças Confirmadas</span>
                  <UserCheck className="w-5 h-5 text-[#6B7A42]" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#3F4D27]">
                  {totalConfirmados} <span className="text-sm font-sans font-normal text-[#5B6C38]">/ {totalCadastrados}</span>
                </div>
                <p className="text-[11px] text-[#5B6C38] mt-1">
                  {totalPendentes > 0 ? `${totalPendentes} aguardando confirmação` : 'Todos confirmaram'}
                </p>
              </div>

              <div 
                onClick={() => { setActiveTab('locais'); setConfig(api.getConfig()); }}
                className="bg-[#FCFDF9] rounded-3xl p-5 border border-[#7A8C4B]/35 shadow-xs hover:shadow-md transition-all cursor-pointer hover:border-[#6B7A42]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-[#6B7A42]">Locais</span>
                  <MapPin className="w-5 h-5 text-[#6B7A42]" />
                </div>
                <div className="font-serif text-lg font-bold text-[#3F4D27] truncate">{config.ceremonyVenue}</div>
                <p className="text-[11px] text-[#5B6C38] mt-1">Alterar endereços de igreja e buffet</p>
              </div>

              <div 
                onClick={() => { setActiveTab('pix'); setConfig(api.getConfig()); }}
                className="bg-[#FCFDF9] rounded-3xl p-5 border border-[#7A8C4B]/35 shadow-xs hover:shadow-md transition-all cursor-pointer hover:border-[#6B7A42]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-[#6B7A42]">Chave Pix</span>
                  <Gift className="w-5 h-5 text-[#6B7A42]" />
                </div>
                <div className="font-serif text-xs font-bold text-[#3F4D27] truncate">{config.pixKey}</div>
                <p className="text-[11px] text-[#5B6C38] mt-1">Alterar dados da conta bancária</p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TELA 2: LISTA DE CONVIDADOS (ORGANIZAR LISTA)
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'convidados' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-[#FCFDF9] rounded-3xl p-5 border border-[#7A8C4B]/35 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#3F4D27]">Organizar Lista de Convidados ({totalCadastrados})</h2>
                  <p className="text-xs text-[#5B6C38]">Visualize, busque por nome, organize e exporte a lista oficial</p>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 rounded-xl bg-[#6B7A42] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#5B6C38] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Planilha Excel</span>
                </button>
              </div>

              <div className="pt-2">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar convidado por nome..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#7A8C4B]/35 outline-none text-xs text-[#2F3A1D] font-medium focus:border-[#6B7A42] shadow-2xs"
                  />
                  <Search className="w-4 h-4 text-[#5B6C38] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="bg-[#FCFDF9] rounded-3xl p-5 border border-[#7A8C4B]/35 shadow-sm">
              {filteredConvidados.length === 0 ? (
                <div className="text-center py-10 text-[#5B6C38] text-xs">
                  Nenhum convidado encontrado.
                </div>
              ) : (
                <div className="divide-y divide-[#7A8C4B]/20">
                  {filteredConvidados.map((c, index) => (
                    <div key={c.id} className="py-3 flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-[11px] font-bold text-[#5B6C38]">#{index + 1}</span>
                        <div>
                          <strong className="block text-sm font-serif text-[#2F3A1D]">{c.nome}</strong>
                          {c.confirmado ? (
                            <span className="text-[10px] text-[#3F4D27] bg-[#EEF2E3] border border-[#7A8C4B]/40 px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="w-3 h-3 text-[#6B7A42]" />
                              Presença Confirmada
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#786128] bg-[#FFF8E7] border border-[#E0CF97] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-[#B88E28]" />
                              Aguardando Confirmação
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-[#5B6C38] hidden sm:inline font-medium">
                          {c.confirmado ? (c.data_confirmacao || 'Confirmado') : 'Pendente'}
                        </span>
                        <button
                          onClick={() => handleDeleteConvidado(c.id, c.nome)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remover convidado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TELA 3: EDITAR LOCAIS
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'locais' && (
          <div className="bg-[#FCFDF9] rounded-3xl p-6 border border-[#7A8C4B]/35 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#3F4D27] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#6B7A42]" />
                <span>Editar Endereços dos Locais</span>
              </h2>
              <p className="text-xs text-[#5B6C38] mt-1">
                Ao alterar os endereços aqui, o convite e os botões do Google Maps e Waze serão atualizados automaticamente para os convidados.
              </p>
            </div>

            <form onSubmit={handleSaveLocations} className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-[#7A8C4B]/30 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#7A8C4B]/20">
                  <Church className="w-4 h-4 text-[#6B7A42]" />
                  <h3 className="font-cinzel text-xs font-bold text-[#3F4D27] uppercase">Cerimônia Religiosa</h3>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3F4D27] mb-1">Nome da Igreja / Local:</label>
                  <input
                    type="text"
                    value={config.ceremonyVenue}
                    onChange={(e) => setConfig({ ...config, ceremonyVenue: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FCFDF9] border border-[#7A8C4B]/35 text-xs font-medium text-[#2F3A1D] outline-none focus:border-[#6B7A42]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3F4D27] mb-1">Endereço Completo:</label>
                  <input
                    type="text"
                    value={config.ceremonyAddress}
                    onChange={(e) => setConfig({ ...config, ceremonyAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FCFDF9] border border-[#7A8C4B]/35 text-xs font-medium text-[#2F3A1D] outline-none focus:border-[#6B7A42]"
                  />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#7A8C4B]/30 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#7A8C4B]/20">
                  <Utensils className="w-4 h-4 text-[#6B7A42]" />
                  <h3 className="font-cinzel text-xs font-bold text-[#3F4D27] uppercase">Buffet e Recepção</h3>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3F4D27] mb-1">Nome do Buffet / Espaço:</label>
                  <input
                    type="text"
                    value={config.buffetVenue}
                    onChange={(e) => setConfig({ ...config, buffetVenue: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FCFDF9] border border-[#7A8C4B]/35 text-xs font-medium text-[#2F3A1D] outline-none focus:border-[#6B7A42]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3F4D27] mb-1">Endereço Completo:</label>
                  <input
                    type="text"
                    value={config.buffetAddress}
                    onChange={(e) => setConfig({ ...config, buffetAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FCFDF9] border border-[#7A8C4B]/35 text-xs font-medium text-[#2F3A1D] outline-none focus:border-[#6B7A42]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingConfig}
                className="w-full py-3.5 rounded-xl bg-[#6B7A42] hover:bg-[#5B6C38] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{savingConfig ? 'Salvando...' : 'Salvar Alterações de Locais'}</span>
              </button>
            </form>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TELA 4: EDITAR PIX
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'pix' && (
          <div className="bg-[#FCFDF9] rounded-3xl p-6 border border-[#7A8C4B]/35 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#3F4D27] flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#6B7A42]" />
                <span>Editar Opção de Presente (Pix)</span>
              </h2>
              <p className="text-xs text-[#5B6C38] mt-1">
                Altere a chave Pix e o nome do titular exibidos no botão "Opção de presente" do convite.
              </p>
            </div>

            <form onSubmit={handleSavePix} className="bg-white p-5 rounded-2xl border border-[#7A8C4B]/30 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#3F4D27] mb-1">Chave Pix (E-mail, CPF, Celular ou Aleatória):</label>
                <input
                  type="text"
                  value={config.pixKey}
                  onChange={(e) => setConfig({ ...config, pixKey: e.target.value })}
                  placeholder="Ex: casamentojulioejessica@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FCFDF9] border border-[#7A8C4B]/35 text-xs font-medium text-[#2F3A1D] outline-none focus:border-[#6B7A42]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3F4D27] mb-1">Nome dos Titulares / Favorecidos:</label>
                <input
                  type="text"
                  value={config.pixTitular}
                  onChange={(e) => setConfig({ ...config, pixTitular: e.target.value })}
                  placeholder="Ex: Jessica e Julio"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FCFDF9] border border-[#7A8C4B]/35 text-xs font-medium text-[#2F3A1D] outline-none focus:border-[#6B7A42]"
                />
              </div>

              <button
                type="submit"
                disabled={savingConfig}
                className="w-full py-3.5 rounded-xl bg-[#6B7A42] hover:bg-[#5B6C38] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
              >
                <Save className="w-4 h-4" />
                <span>{savingConfig ? 'Salvando...' : 'Salvar Dados do Pix'}</span>
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
