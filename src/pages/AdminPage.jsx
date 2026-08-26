import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Lock, KeyRound, Users, MessageSquare, Download, Trash2,
  Plus, Search, CheckCircle2, RefreshCw, LogOut, Heart,
  Home, Sparkles, Image as ImageIcon, Calendar, Eye, EyeOff,
  Maximize2, X, Clock, PartyPopper, UserCheck, ShieldCheck
} from 'lucide-react';
import { FloralBackgroundLayer, FloralCorner, CrossHeartIcon } from '../components/FloralDecorations';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('convidados');

  const [stats, setStats] = useState({ totalConvidados: 0, totalMensagens: 0 });
  const [convidados, setConvidados] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [novoConvidado, setNovoConvidado] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Contador de dias restantes para o casamento
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const target = new Date('2026-11-14T16:00:00').getTime();
    const now = new Date().getTime();
    const diff = target - now;
    if (diff > 0) {
      setDaysLeft(Math.floor(diff / (1000 * 60 * 60 * 24)));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadAllData();
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await api.adminLogin(password);
      if (res.success) {
        setIsAuthenticated(true);
        setPassword('');
      }
    } catch (err) {
      setLoginError(err.message || 'Senha incorreta. Tente novamente.');
    }
  };

  const loadAllData = async () => {
    setLoadingData(true);
    try {
      const [statsData, convData, msgData] = await Promise.all([
        api.getAdminStats(),
        api.getConvidados(),
        api.getMensagens()
      ]);
      setStats(statsData);
      setConvidados(convData);
      setMensagens(msgData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddConvidado = async (e) => {
    e.preventDefault();
    if (!novoConvidado.trim()) return;
    try {
      await api.addConvidado(novoConvidado.trim());
      setNovoConvidado('');
      setActionMessage(`"${novoConvidado.trim()}" adicionado à lista de presença!`);
      setTimeout(() => setActionMessage(''), 4000);
      await loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteConvidado = async (id, nome) => {
    if (window.confirm(`Deseja remover "${nome}" da lista de convidados?`)) {
      try {
        await api.deleteConvidado(id);
        setActionMessage(`"${nome}" removido com sucesso.`);
        setTimeout(() => setActionMessage(''), 4000);
        await loadAllData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleDeleteMensagem = async (id, nome) => {
    if (window.confirm(`Deseja excluir a mensagem enviada por "${nome}"?`)) {
      try {
        await api.deleteMensagem(id);
        setActionMessage(`Mensagem de "${nome}" excluída.`);
        setTimeout(() => setActionMessage(''), 4000);
        await loadAllData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleExportCSV = () => {
    if (convidados.length === 0) {
      alert('Nenhum convidado confirmado para exportar.');
      return;
    }
    const headers = 'ID,Nome do Convidado\n';
    const rows = convidados.map(c => `"${c.id}","${c.nome.replace(/"/g, '""')}"`).join('\n');
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

  const fotosCount = mensagens.filter(m => m.foto).length;

  /* ─────────────────────────────────────────────────────────────
     TELA DE LOGIN LUXUOSA
  ───────────────────────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1C201D] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background com relevo floral clássico */}
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url('/relevo_floral_wide.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C201D]/80 via-[#1C201D]/90 to-[#1C201D] pointer-events-none" />

        <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-[#C5A880]/40 animate-fadeIn">
          <FloralCorner className="-top-8 -right-8 w-40 h-40 opacity-25" position="top-right" />
          <FloralCorner className="-bottom-8 -left-8 w-40 h-40 opacity-25" position="bottom-left" />

          {/* Header de Boas-Vindas */}
          <div className="pt-10 pb-6 px-8 text-center relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#F7F3EC] border border-[#C5A880]/40 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CrossHeartIcon className="w-8 h-10 text-[#8C6B38]" />
            </div>

            <span className="text-xs uppercase tracking-widest text-[#8C6B38] font-bold">Acesso Privado</span>
            <h1 className="font-cursive text-5xl text-[#2D312E] my-1 font-normal">
              Jéssica & Júlio
            </h1>
            <p className="text-xs text-[#5A605B] font-semibold tracking-wide">
              Painel Exclusivo dos Noivos
            </p>
          </div>

          {/* Formulário de Login */}
          <div className="px-8 pb-10 relative z-10">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D312E] mb-2">
                  Senha de Acesso dos Noivos
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full pl-4 pr-11 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#C5A880]/40 focus:border-[#8C6B38] focus:ring-2 focus:ring-[#8C6B38]/20 outline-none text-sm font-medium text-[#2D312E] shadow-sm transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C6B38] hover:text-[#6D5228] transition-colors p-1"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {loginError && (
                  <div className="mt-2.5 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-2 animate-shake">
                    <span>⚠️ {loginError}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#8C6B38] hover:bg-[#6D5228] text-white font-bold text-sm tracking-wider uppercase shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                Entrar no Painel
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#C5A880]/20 text-center">
              <a
                href="#inicio"
                onClick={() => { window.location.hash = '#inicio'; }}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6B38] hover:text-[#6D5228] transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Voltar para o site público</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     PAINEL AUTENTICADO PREMIUM
  ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F7F3EC] font-sans relative overflow-x-hidden">
      {/* Camada Floral de Fundo */}
      <FloralBackgroundLayer className="opacity-40" />

      {/* Topbar Nobre */}
      <header className="bg-[#2D312E] text-white px-4 sm:px-8 py-4 sticky top-0 z-40 shadow-xl border-b border-[#C5A880]/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
              <CrossHeartIcon className="w-5 h-6 text-[#C5A880]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cursive text-2xl sm:text-3xl text-[#E8DCCF] font-normal leading-none">
                  Jéssica & Júlio
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#8C6B38]/30 border border-[#C5A880]/30 text-[10px] uppercase font-bold tracking-widest text-[#E8DCCF]">
                  Portal dos Noivos
                </span>
              </div>
              <p className="text-[11px] text-white/60 font-medium">
                14 de Novembro de 2026 • Espaço Villa Jardins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#inicio"
              onClick={() => { window.location.hash = '#inicio'; }}
              className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl font-semibold transition-all border border-white/10"
              title="Abrir o site público dos convidados"
            >
              <Home className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden md:inline">Ver Site Público</span>
            </a>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-1.5 text-xs text-red-200 hover:text-white bg-red-900/30 hover:bg-red-800/50 px-3.5 py-2 rounded-xl font-semibold transition-all border border-red-500/20 cursor-pointer"
              title="Encerrar sessão"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 relative z-10">
        
        {/* Banner de Boas-Vindas dos Noivos */}
        <div className="bg-gradient-to-r from-[#2D312E] via-[#3B413D] to-[#2D312E] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#C5A880]/30">
          <FloralCorner className="-top-10 -right-10 w-48 h-48 opacity-20" position="top-right" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8C6B38]/30 border border-[#C5A880]/40 text-xs font-bold tracking-wider uppercase text-[#E8DCCF] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Contagem Regressiva</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
                Olá, Jéssica & Júlio! ❤️
              </h2>
              <p className="text-sm text-white/80 mt-1 max-w-xl font-medium">
                Aqui vocês acompanham em tempo real todas as presenças confirmadas e as mensagens carinhosas que os convidados estão enviando para vocês.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 shrink-0 shadow-inner">
              <Calendar className="w-8 h-8 text-[#C5A880]" />
              <div>
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#E8DCCF]">
                  {daysLeft} Dias
                </span>
                <span className="text-xs uppercase tracking-wider text-white/70 font-semibold">
                  para o grande dia
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Cards de Métricas Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Convidados */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-[#C5A880]/35 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6B38]">Presenças</span>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F3EC] border border-[#C5A880]/30 text-[#8C6B38] flex items-center justify-center shadow-xs">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="font-serif text-4xl font-bold text-[#1C201D] mb-1">
              {stats.totalConvidados}
            </div>
            <p className="text-xs text-[#5A605B] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span>Confirmados na lista</span>
            </p>
          </div>

          {/* Card 2: Recados */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-[#B87D7A]/40 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B87D7A]">Mensagens</span>
              <div className="w-12 h-12 rounded-2xl bg-[#FDF5F5] border border-[#B87D7A]/30 text-[#B87D7A] flex items-center justify-center shadow-xs">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
            <div className="font-serif text-4xl font-bold text-[#1C201D] mb-1">
              {stats.totalMensagens}
            </div>
            <p className="text-xs text-[#5A605B] font-semibold flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-[#B87D7A] fill-[#B87D7A]" />
              <span>Recados enviados</span>
            </p>
          </div>

          {/* Card 3: Fotos */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-[#8C6B38]/35 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6B38]">Fotos Anexadas</span>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F3EC] border border-[#C5A880]/30 text-[#8C6B38] flex items-center justify-center shadow-xs">
                <ImageIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="font-serif text-4xl font-bold text-[#1C201D] mb-1">
              {fotosCount}
            </div>
            <p className="text-xs text-[#5A605B] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6B38]" />
              <span>Memórias registradas</span>
            </p>
          </div>

          {/* Card 4: Status do Evento */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-[#5A605B]/30 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A605B]">Data & Horário</span>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F3EC] border border-[#C5A880]/30 text-[#5A605B] flex items-center justify-center shadow-xs">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="font-serif text-2xl font-bold text-[#1C201D] mb-1">
              16:00h
            </div>
            <p className="text-xs text-[#5A605B] font-semibold">
              14/11/2026 • Sábado
            </p>
          </div>
        </div>

        {/* Notificação Temporária de Ação */}
        {actionMessage && (
          <div className="p-4 bg-green-50 text-green-800 rounded-2xl border border-green-200 text-sm flex items-center gap-2.5 shadow-sm font-semibold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Navegação por Abas Estilizada */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/85 backdrop-blur-md p-2 rounded-2xl border border-[#C5A880]/30 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('convidados')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'convidados'
                  ? 'bg-[#8C6B38] text-white shadow-md'
                  : 'text-[#2D312E] hover:bg-[#F7F3EC] font-semibold'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Lista de Convidados ({convidados.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('mensagens')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'mensagens'
                  ? 'bg-[#8C6B38] text-white shadow-md'
                  : 'text-[#2D312E] hover:bg-[#F7F3EC] font-semibold'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Recados & Fotos ({mensagens.length})</span>
            </button>
          </div>

          <button
            onClick={loadAllData}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#8C6B38] hover:bg-[#F7F3EC] transition-colors border border-[#C5A880]/30 cursor-pointer"
            title="Atualizar dados do servidor"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span>{loadingData ? 'Atualizando...' : 'Atualizar Dados'}</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            ABA 1: LISTA DE CONVIDADOS
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'convidados' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Barra de Ações Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Campo de Busca */}
              <div className="relative md:col-span-1">
                <input
                  type="text"
                  placeholder="Buscar convidado por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl bg-white border border-[#C5A880]/30 focus:border-[#8C6B38] focus:ring-2 focus:ring-[#8C6B38]/20 outline-none font-medium shadow-sm"
                />
                <Search className="w-4 h-4 text-[#8C6B38] absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Formulário Rápido de Adição */}
              <form onSubmit={handleAddConvidado} className="flex gap-2 md:col-span-1">
                <input
                  type="text"
                  placeholder="Adicionar nome manualmente..."
                  value={novoConvidado}
                  onChange={(e) => setNovoConvidado(e.target.value)}
                  className="flex-1 px-4 py-3 text-sm rounded-2xl border border-[#C5A880]/30 bg-white focus:border-[#8C6B38] focus:ring-2 focus:ring-[#8C6B38]/20 outline-none font-medium shadow-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-[#2D312E] hover:bg-[#1A1C1A] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md transition-all"
                >
                  <Plus className="w-4 h-4 text-[#C5A880]" />
                  <span>Adicionar</span>
                </button>
              </form>

              {/* Botão de Exportar CSV */}
              <div className="md:col-span-1 flex justify-end">
                <button
                  onClick={handleExportCSV}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#8C6B38] hover:bg-[#6D5228] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Planilha Excel (CSV)</span>
                </button>
              </div>
            </div>

            {/* Tabela de Convidados Estilizada */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#C5A880]/35 shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-[#FDFBF7] border-b border-[#C5A880]/20 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6B38]">
                  Exibindo {filteredConvidados.length} de {convidados.length} convidados
                </span>
                {searchTerm && (
                  <span className="text-xs text-[#5A605B] font-medium">
                    Filtrando por: "<strong>{searchTerm}</strong>"
                  </span>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F7F3EC] border-b border-[#C5A880]/20 text-[#2D312E]">
                    <tr>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold w-16 text-center">#</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold">Convidado Confirmado</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-center">Status</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-right w-28">Remover</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DCCF]/50">
                    {filteredConvidados.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-16 text-[#5A605B] text-sm font-medium">
                          <Users className="w-12 h-12 text-[#C5A880]/50 mx-auto mb-3" />
                          <p>Nenhum convidado encontrado com esse nome.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredConvidados.map((c, index) => (
                        <tr key={c.id} className="hover:bg-[#FDFBF7] transition-colors group">
                          <td className="py-4 px-6 text-center text-[#8C6B38] font-mono text-xs font-bold">
                            {index + 1}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#F7F3EC] border border-[#C5A880]/40 text-[#8C6B38] font-serif font-bold text-sm flex items-center justify-center shadow-xs">
                                {c.nome ? c.nome.charAt(0).toUpperCase() : 'C'}
                              </div>
                              <span className="font-bold text-base text-[#2D312E]">{c.nome}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                              <span>Confirmado</span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteConvidado(c.id, c.nome)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                              title={`Remover ${c.nome}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            ABA 2: MURAL DE RECADOS & FOTOS
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'mensagens' && (
          <div className="space-y-6 animate-fadeIn">
            {mensagens.length === 0 ? (
              <div className="text-center py-20 bg-white/95 rounded-3xl border border-[#C5A880]/35 shadow-md max-w-lg mx-auto p-8">
                <Sparkles className="w-12 h-12 text-[#C5A880]/60 mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold text-[#2D312E] mb-2">
                  Ainda não há recados registrados
                </h3>
                <p className="text-[#5A605B] font-medium text-sm">
                  Assim que os convidados deixarem votos ou fotos pelo site, elas aparecerão aqui exclusivamente para vocês!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mensagens.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#C5A880]/35 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Foto anexada */}
                      {msg.foto ? (
                        <div className="relative group/img overflow-hidden bg-[#1C201D]">
                          <img
                            src={msg.foto}
                            alt={`Foto de ${msg.nome}`}
                            className="w-full h-56 object-cover group-hover/img:scale-105 transition-transform duration-500 cursor-pointer"
                            onClick={() => setSelectedPhoto({ src: msg.foto, autor: msg.nome })}
                          />
                          <button
                            onClick={() => setSelectedPhoto({ src: msg.foto, autor: msg.nome })}
                            className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-xl text-xs flex items-center gap-1 backdrop-blur-sm transition-all"
                            title="Expandir Foto"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Ampliar</span>
                          </button>
                        </div>
                      ) : (
                        <div className="h-3 bg-gradient-to-r from-[#8C6B38] via-[#C5A880] to-[#B87D7A]" />
                      )}

                      {/* Conteúdo da Mensagem */}
                      <div className="p-6">
                        <p className="text-base text-[#2D312E] font-serif italic leading-relaxed whitespace-pre-wrap font-medium">
                          "{msg.mensagens}"
                        </p>
                      </div>
                    </div>

                    {/* Rodapé do Card */}
                    <div className="px-6 py-4 bg-[#FDFBF7] border-t border-[#C5A880]/20 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#F7F3EC] border border-[#C5A880]/40 text-[#8C6B38] font-serif font-bold text-xs flex items-center justify-center">
                          {msg.nome ? msg.nome.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <span className="font-bold text-sm text-[#2D312E]">{msg.nome}</span>
                      </div>

                      <button
                        onClick={() => handleDeleteMensagem(msg.id, msg.nome)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Excluir mensagem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Foto em Alta Resolução */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="max-w-4xl max-h-[90vh] bg-[#1C201D] rounded-3xl overflow-hidden border border-[#C5A880]/40 shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#2D312E] flex items-center justify-between border-b border-white/10 text-white">
              <span className="font-serif font-bold text-base">Foto enviada por: {selectedPhoto.autor}</span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center overflow-auto">
              <img
                src={selectedPhoto.src}
                alt={`Foto de ${selectedPhoto.autor}`}
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
