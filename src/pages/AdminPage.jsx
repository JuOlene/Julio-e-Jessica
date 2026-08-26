import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Lock, KeyRound, Users, MessageSquare, Download, Trash2,
  Search, CheckCircle2, RefreshCw, LogOut, Heart,
  Home, Sparkles, Image as ImageIcon, Calendar, Eye, EyeOff,
  Maximize2, X, Clock, UserCheck, ChevronRight, FileSpreadsheet,
  Menu, ArrowLeft, LayoutDashboard, Clock3, AlertCircle
} from 'lucide-react';
import { FloralBackgroundLayer, FloralCorner, CrossHeartIcon } from '../components/FloralDecorations';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // activeTab: 'resumo', 'convidados', 'mensagens'
  const [activeTab, setActiveTab] = useState('resumo');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [stats, setStats] = useState({ 
    totalConvidados: 0, 
    totalConfirmados: 0, 
    totalPendentes: 0, 
    totalMensagens: 0 
  });
  const [convidados, setConvidados] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
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
        setActiveTab('resumo');
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
      alert('Nenhum convidado cadastrado para exportar.');
      return;
    }
    const headers = 'ID,Nome do Convidado,Status de Confirmacao\n';
    const rows = convidados.map(c => 
      `"${c.id}","${c.nome.replace(/"/g, '""')}","${c.confirmado ? 'Confirmado pelo Convidado' : 'Nao Confirmado'}"`
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

  const confirmadosCount = convidados.filter(c => c.confirmado).length;
  const pendentesCount = convidados.filter(c => !c.confirmado).length;
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
     PAINEL AUTENTICADO: TOPBAR LIMPA + CONTROLE EXCLUSIVO
  ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F7F3EC] font-sans relative overflow-x-hidden">
      {/* Camada Floral de Fundo */}
      <FloralBackgroundLayer className="opacity-40" />

      {/* Topbar Nobre e Limpa */}
      <header className="bg-[#2D312E] text-white px-4 sm:px-8 py-3.5 sticky top-0 z-40 shadow-xl border-b border-[#C5A880]/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Lado Esquerdo: Botão Hambúrguer + Monograma */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#8C6B38] hover:bg-[#6D5228] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer group"
              title="Abrir Menu Hamburguer"
            >
              <Menu className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-bold">Menu</span>
            </button>

            <button
              onClick={() => setActiveTab('resumo')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] hidden sm:flex">
                <CrossHeartIcon className="w-4 h-5 text-[#C5A880]" />
              </div>
              <div>
                <span className="font-cursive text-2xl sm:text-3xl text-[#E8DCCF] group-hover:text-white transition-colors font-normal leading-none">
                  Jéssica & Júlio
                </span>
                <span className="hidden md:inline-block ml-2 px-2 py-0.5 rounded-full bg-[#8C6B38]/30 border border-[#C5A880]/30 text-[9px] uppercase font-bold tracking-widest text-[#E8DCCF]">
                  Painel dos Noivos
                </span>
              </div>
            </button>
          </div>

          {/* Lado Direito: Links Essenciais (Ver Site & Sair) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#inicio"
              onClick={() => { window.location.hash = '#inicio'; }}
              className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl font-semibold transition-all border border-white/10"
              title="Abrir o site público dos convidados"
            >
              <Home className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">Ver Site</span>
            </a>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-1 text-xs text-red-200 hover:text-white bg-red-900/30 hover:bg-red-800/50 px-3.5 py-2 rounded-xl font-semibold transition-all border border-red-500/20 cursor-pointer"
              title="Encerrar sessão"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          DRAWER LATERAL (MENU HAMBÚRGUER RETRÁTIL)
      ───────────────────────────────────────────────────────────── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          {/* Backdrop Escurecido com Blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-sm bg-white/98 backdrop-blur-md shadow-2xl border-r border-[#C5A880]/40 flex flex-col justify-between relative z-10 overflow-hidden">
              <FloralCorner className="-top-8 -right-8 w-40 h-40 opacity-20" position="top-right" />
              <FloralCorner className="-bottom-8 -left-8 w-40 h-40 opacity-20" position="bottom-left" />

              {/* Topo do Menu Drawer */}
              <div>
                <div className="p-6 bg-[#2D312E] text-white flex items-center justify-between border-b border-[#C5A880]/30 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#8C6B38]/30 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
                      <CrossHeartIcon className="w-5 h-6 text-[#C5A880]" />
                    </div>
                    <div>
                      <h3 className="font-cursive text-2xl text-[#E8DCCF] font-normal leading-tight">
                        Jéssica & Júlio
                      </h3>
                      <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">
                        Menu dos Noivos
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Fechar menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Lista de Opções do Menu */}
                <div className="p-5 space-y-3 relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6B38] block mb-2 px-1">
                    Navegação do Painel
                  </span>

                  {/* Opção 1: Resumo Geral */}
                  <button
                    onClick={() => {
                      setActiveTab('resumo');
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'resumo'
                        ? 'bg-[#8C6B38] text-white border-[#8C6B38] shadow-md'
                        : 'bg-[#FDFBF7] hover:bg-[#F7F3EC] text-[#2D312E] border-[#C5A880]/30 hover:border-[#8C6B38]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        activeTab === 'resumo'
                          ? 'bg-white/20 text-white'
                          : 'bg-white text-[#8C6B38] border border-[#C5A880]/30 shadow-xs'
                      }`}>
                        <LayoutDashboard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-tight">Resumo Geral</h4>
                        <p className={`text-xs mt-0.5 ${activeTab === 'resumo' ? 'text-white/80' : 'text-[#5A605B]'}`}>
                          Visão inicial & métricas
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${activeTab === 'resumo' ? 'text-white' : 'text-gray-400'}`} />
                  </button>

                  {/* Opção 2: Lista de Convidados */}
                  <button
                    onClick={() => {
                      setActiveTab('convidados');
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'convidados'
                        ? 'bg-[#8C6B38] text-white border-[#8C6B38] shadow-md'
                        : 'bg-[#FDFBF7] hover:bg-[#F7F3EC] text-[#2D312E] border-[#C5A880]/30 hover:border-[#8C6B38]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        activeTab === 'convidados'
                          ? 'bg-white/20 text-white'
                          : 'bg-white text-[#8C6B38] border border-[#C5A880]/30 shadow-xs'
                      }`}>
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-tight">Lista de Convidados</h4>
                        <p className={`text-xs mt-0.5 ${activeTab === 'convidados' ? 'text-white/80' : 'text-[#5A605B]'}`}>
                          {confirmadosCount} confirmados • {pendentesCount} não confirmados
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      activeTab === 'convidados'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F7F3EC] text-[#8C6B38] border border-[#C5A880]/30'
                    }`}>
                      {convidados.length}
                    </span>
                  </button>

                  {/* Opção 3: Mural de Mensagens */}
                  <button
                    onClick={() => {
                      setActiveTab('mensagens');
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'mensagens'
                        ? 'bg-[#8C6B38] text-white border-[#8C6B38] shadow-md'
                        : 'bg-[#FDFBF7] hover:bg-[#F7F3EC] text-[#2D312E] border-[#C5A880]/30 hover:border-[#8C6B38]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        activeTab === 'mensagens'
                          ? 'bg-white/20 text-white'
                          : 'bg-white text-[#B87D7A] border border-[#B87D7A]/30 shadow-xs'
                      }`}>
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-tight">Recados & Fotos</h4>
                        <p className={`text-xs mt-0.5 ${activeTab === 'mensagens' ? 'text-white/80' : 'text-[#5A605B]'}`}>
                          Votos privados e memórias
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      activeTab === 'mensagens'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#FDF5F5] text-[#B87D7A] border border-[#B87D7A]/30'
                    }`}>
                      {mensagens.length}
                    </span>
                  </button>

                  <div className="pt-3 border-t border-[#C5A880]/20 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6B38] block px-1">
                      Ações Rápidas
                    </span>

                    {/* Exportar CSV */}
                    <button
                      onClick={() => {
                        handleExportCSV();
                        setIsDrawerOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white hover:bg-[#FDFBF7] text-[#2D312E] text-xs font-bold transition-all border border-[#C5A880]/30 shadow-xs cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-green-700 shrink-0" />
                      <span>Exportar Planilha Excel (CSV)</span>
                    </button>

                    {/* Atualizar Dados */}
                    <button
                      onClick={() => {
                        loadAllData();
                        setIsDrawerOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white hover:bg-[#FDFBF7] text-[#8C6B38] text-xs font-bold transition-all border border-[#C5A880]/30 shadow-xs cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 text-[#8C6B38] shrink-0 ${loadingData ? 'animate-spin' : ''}`} />
                      <span>Sincronizar Dados em Tempo Real</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Rodapé do Menu Drawer */}
              <div className="p-5 bg-[#FDFBF7] border-t border-[#C5A880]/20 space-y-2.5 relative z-10">
                <a
                  href="#inicio"
                  onClick={() => {
                    window.location.hash = '#inicio';
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-gray-50 text-[#2D312E] text-xs font-bold uppercase tracking-wider transition-colors border border-[#C5A880]/30 shadow-xs"
                >
                  <Home className="w-4 h-4 text-[#8C6B38]" />
                  <span>Ir para o Site dos Convidados</span>
                </a>

                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider transition-colors border border-red-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Sair do Painel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 relative z-10">
        
        {/* Notificação Temporária de Ação */}
        {actionMessage && (
          <div className="p-4 bg-green-50 text-green-800 rounded-2xl border border-green-200 text-sm flex items-center gap-2.5 shadow-sm font-semibold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TELA 1: RESUMO INICIAL (Banner + 4 Métricas + Cards de Acesso)
            APARECE SOMENTE QUANDO activeTab === 'resumo'
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'resumo' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Banner de Boas-Vindas dos Noivos */}
            <div className="bg-gradient-to-r from-[#2D312E] via-[#3B413D] to-[#2D312E] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#C5A880]/30 text-center sm:text-left">
              <FloralCorner className="-top-10 -right-10 w-48 h-48 opacity-20" position="top-right" />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8C6B38]/30 border border-[#C5A880]/40 text-xs font-bold tracking-wider uppercase text-[#E8DCCF] mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Contagem Regressiva</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
                    Olá, Jéssica & Júlio! ❤️
                  </h2>
                  <p className="text-sm text-white/80 mt-1 max-w-xl font-medium">
                    Aqui vocês acompanham em tempo real as confirmações de presença enviadas pelos convidados e os recados carinhosos recebidos.
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 shrink-0 shadow-inner">
                  <Calendar className="w-8 h-8 text-[#C5A880]" />
                  <div className="text-left">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Card 1: Presenças Confirmadas */}
              <div 
                onClick={() => setActiveTab('convidados')}
                className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-[#C5A880]/35 shadow-md hover:shadow-xl transition-all relative overflow-hidden cursor-pointer hover:border-[#8C6B38] group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C6B38]">Presenças</span>
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F3EC] border border-[#C5A880]/30 text-[#8C6B38] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>
                <div className="font-serif text-4xl font-bold text-[#1C201D] mb-1">
                  {confirmadosCount}
                </div>
                <p className="text-xs text-[#5A605B] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  <span>Confirmados ({pendentesCount} não confirmados)</span>
                </p>
              </div>

              {/* Card 2: Recados */}
              <div 
                onClick={() => setActiveTab('mensagens')}
                className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-[#B87D7A]/40 shadow-md hover:shadow-xl transition-all relative overflow-hidden cursor-pointer hover:border-[#B87D7A] group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B87D7A]">Mensagens</span>
                  <div className="w-12 h-12 rounded-2xl bg-[#FDF5F5] border border-[#B87D7A]/30 text-[#B87D7A] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
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
              <div 
                onClick={() => setActiveTab('mensagens')}
                className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-[#8C6B38]/35 shadow-md hover:shadow-xl transition-all relative overflow-hidden cursor-pointer hover:border-[#8C6B38] group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C6B38]">Fotos Anexadas</span>
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F3EC] border border-[#C5A880]/30 text-[#8C6B38] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
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

              {/* Card 4: Data & Horário */}
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

            {/* 2 Cartões Grandes de Acesso Separado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Card de Entrada para Lista de Convidados */}
              <div 
                onClick={() => setActiveTab('convidados')}
                className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#C5A880]/35 shadow-lg hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
              >
                <FloralCorner className="-top-8 -right-8 w-36 h-36 opacity-25" position="top-right" />
                
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#F7F3EC] border border-[#C5A880]/40 text-[#8C6B38] flex items-center justify-center mb-5 sm:mb-6 shadow-xs group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7" />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-widest text-[#8C6B38] block mb-1">
                    Módulo de Presenças
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D312E] mb-2 group-hover:text-[#8C6B38] transition-colors">
                    Lista de Convidados
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A605B] font-medium leading-relaxed mb-6">
                    Acompanhe em tempo real quem confirmou presença no site e quem ainda não confirmou, ou baixe a planilha para o buffet.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#C5A880]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-800 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      {confirmadosCount} Confirmados
                    </span>
                    {pendentesCount > 0 && (
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        {pendentesCount} Não Confirmados
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-[#8C6B38] group-hover:translate-x-1 transition-transform">
                    <span>Acessar Lista</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Card de Entrada para Recados & Fotos */}
              <div 
                onClick={() => setActiveTab('mensagens')}
                className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#B87D7A]/40 shadow-lg hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
              >
                <FloralCorner className="-top-8 -right-8 w-36 h-36 opacity-25" position="top-right" />
                
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#FDF5F5] border border-[#B87D7A]/40 text-[#B87D7A] flex items-center justify-center mb-5 sm:mb-6 shadow-xs group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-7 h-7" />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-widest text-[#B87D7A] block mb-1">
                    Livro de Memórias
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D312E] mb-2 group-hover:text-[#B87D7A] transition-colors">
                    Recados & Fotos
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A605B] font-medium leading-relaxed mb-6">
                    Veja todas as mensagens carinhosas e fotos que os convidados enviaram exclusivamente para vocês guardarem de recordação.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#B87D7A]/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B87D7A] bg-[#FDF5F5] px-3.5 py-1.5 rounded-full border border-[#B87D7A]/30">
                    {mensagens.length} Recados • {fotosCount} Fotos
                  </span>
                  <div className="flex items-center gap-1 text-sm font-bold text-[#B87D7A] group-hover:translate-x-1 transition-transform">
                    <span>Acessar Recados</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Banner de Ações Rápidas no Resumo */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[#C5A880]/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-6 h-6 text-green-700 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-[#2D312E]">Exportação dos Dados</h4>
                  <p className="text-xs text-[#5A605B] font-medium">Baixe a relação completa com a lista de todos os convidados e status de presença.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={loadAllData}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F7F3EC] hover:bg-[#E8DCCF]/50 text-[#8C6B38] text-xs font-bold uppercase tracking-wider transition-colors border border-[#C5A880]/30 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
                  <span>Sincronizar</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#8C6B38] hover:bg-[#6D5228] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Planilha</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TELA 2: LISTA DE CONVIDADOS E STATUS REAL DE CONFIRMAÇÃO
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'convidados' && (
          <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-8 border border-[#C5A880]/35 shadow-lg">
              
              {/* Header do Módulo com Botão de Voltar ao Resumo */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-[#C5A880]/20 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('resumo')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#F7F3EC] hover:bg-[#E8DCCF]/60 text-[#8C6B38] border border-[#C5A880]/30 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider"
                    title="Voltar ao Resumo"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar ao Resumo</span>
                  </button>

                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C6B38] mb-0.5">
                      <Users className="w-4 h-4" />
                      <span>Módulo de Presenças</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D312E]">
                      Lista de Convidados
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5A605B] font-medium">
                      <strong className="text-green-700 font-bold">{confirmadosCount} confirmados</strong> e <strong className="text-amber-700 font-bold">{pendentesCount} não confirmados</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={loadAllData}
                    className="p-3 rounded-2xl bg-[#F7F3EC] hover:bg-[#E8DCCF]/50 text-[#8C6B38] border border-[#C5A880]/30 transition-all cursor-pointer shadow-xs"
                    title="Atualizar lista"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#8C6B38] hover:bg-[#6D5228] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar CSV</span>
                  </button>
                </div>
              </div>

              {/* Barra de Busca Centralizada */}
              <div className="mb-6">
                <div className="relative flex items-center bg-[#FDFBF7] border border-[#C5A880]/35 rounded-2xl p-1.5 focus-within:border-[#8C6B38] focus-within:ring-2 focus-within:ring-[#8C6B38]/20 transition-all shadow-xs">
                  <Search className="w-4 h-4 text-[#8C6B38] ml-2.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="Buscar convidado por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 min-w-0 bg-transparent pl-2.5 pr-2 py-2 text-sm outline-none font-medium text-[#2D312E]"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="p-1.5 mr-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
                      title="Limpar busca"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Lista Centralizada de Convidados com Status Verdadeiro */}
              <div className="rounded-2xl border border-[#C5A880]/30 overflow-hidden shadow-xs">
                <div className="px-5 py-3.5 bg-[#FDFBF7] border-b border-[#C5A880]/20 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs font-bold text-[#8C6B38] text-center sm:text-left">
                  <span>Exibindo {filteredConvidados.length} de {convidados.length} convidados</span>
                  {searchTerm && (
                    <span className="text-[#5A605B]">Filtrado por: "{searchTerm}"</span>
                  )}
                </div>

                {/* Linhas de Convidados */}
                <div className="divide-y divide-[#E8DCCF]/50 bg-white">
                  {filteredConvidados.length === 0 ? (
                    <div className="text-center py-16 px-4 text-[#5A605B]">
                      <Users className="w-12 h-12 text-[#C5A880]/50 mx-auto mb-3" />
                      <p className="text-sm font-medium">Nenhum convidado cadastrado.</p>
                    </div>
                  ) : (
                    filteredConvidados.map((c, index) => (
                      <div 
                        key={c.id} 
                        className="p-4 sm:px-6 sm:py-4 flex items-center justify-between gap-3 hover:bg-[#FDFBF7] transition-colors"
                      >
                        {/* Lado Esquerdo: Número + Avatar + Nome */}
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs font-mono font-bold text-[#8C6B38] w-6 text-center shrink-0">
                            {index + 1}
                          </span>
                          
                          <div className={`w-10 h-10 rounded-full border font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-xs ${
                            c.confirmado 
                              ? 'bg-green-50 border-green-300 text-green-800' 
                              : 'bg-amber-50 border-amber-300 text-amber-800'
                          }`}>
                            {c.nome ? c.nome.charAt(0).toUpperCase() : 'C'}
                          </div>

                          <div className="min-w-0">
                            <span className="font-bold text-sm sm:text-base text-[#2D312E] block truncate">
                              {c.nome}
                            </span>
                            
                            {/* Badge Mobile: Exibe exatamente o status real */}
                            <div className="sm:hidden mt-0.5">
                              {c.confirmado ? (
                                <span className="text-[10px] text-green-700 font-bold uppercase flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                                  <span>Presença confirmada</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-amber-700 font-bold uppercase flex items-center gap-1">
                                  <Clock3 className="w-3 h-3 text-amber-600" />
                                  <span>Não confirmou presença ainda</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Lado Direito: Badge Desktop + Botão de Exclusão */}
                        <div className="flex items-center gap-3 shrink-0">
                          {c.confirmado ? (
                            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-300 text-green-800 text-xs font-bold shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                              <span>Confirmado pelo Convidado</span>
                            </span>
                          ) : (
                            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold shadow-xs">
                              <Clock3 className="w-3.5 h-3.5 text-amber-600" />
                              <span>Não Confirmado</span>
                            </span>
                          )}

                          <button
                            onClick={() => handleDeleteConvidado(c.id, c.nome)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title={`Remover ${c.nome}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TELA 3: MURAL DE RECADOS & FOTOS (CENTRALIZADA & OTIMIZADA PARA CELULAR)
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'mensagens' && (
          <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-8 border border-[#C5A880]/35 shadow-lg">
              
              {/* Header do Módulo com Botão de Voltar ao Resumo */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-[#C5A880]/20 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('resumo')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#FDF5F5] hover:bg-[#FDF0F0] text-[#B87D7A] border border-[#B87D7A]/30 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider"
                    title="Voltar ao Resumo"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar ao Resumo</span>
                  </button>

                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B87D7A] mb-0.5">
                      <MessageSquare className="w-4 h-4" />
                      <span>Livro de Memórias & Votos</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D312E]">
                      Recados e Fotos dos Convidados
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5A605B] font-medium">
                      Total de {mensagens.length} mensagens e {fotosCount} fotos recebidas.
                    </p>
                  </div>
                </div>

                <button
                  onClick={loadAllData}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#F7F3EC] hover:bg-[#E8DCCF]/50 text-[#8C6B38] border border-[#C5A880]/30 transition-all cursor-pointer text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
                  <span>Atualizar</span>
                </button>
              </div>

              {mensagens.length === 0 ? (
                <div className="text-center py-20 bg-[#FDFBF7] rounded-3xl border border-[#C5A880]/30 p-8 max-w-md mx-auto">
                  <Sparkles className="w-12 h-12 text-[#C5A880]/60 mx-auto mb-3" />
                  <h4 className="font-serif text-2xl font-bold text-[#2D312E] mb-2">
                    Nenhum recado recebido até o momento
                  </h4>
                  <p className="text-[#5A605B] text-sm font-medium">
                    Assim que os convidados deixarem mensagens ou fotos pelo site, elas aparecerão aqui exclusivamente para vocês!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {mensagens.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-white rounded-3xl border border-[#C5A880]/30 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
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
                              title="Ampliar Foto"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>Ampliar</span>
                            </button>
                          </div>
                        ) : (
                          <div className="h-3 bg-gradient-to-r from-[#8C6B38] via-[#C5A880] to-[#B87D7A]" />
                        )}

                        {/* Conteúdo da Mensagem */}
                        <div className="p-5 sm:p-6">
                          <p className="text-sm sm:text-base text-[#2D312E] font-serif italic leading-relaxed whitespace-pre-wrap font-medium">
                            "{msg.mensagens}"
                          </p>
                        </div>
                      </div>

                      {/* Rodapé do Card */}
                      <div className="px-5 py-4 bg-[#FDFBF7] border-t border-[#C5A880]/20 flex items-center justify-between">
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
