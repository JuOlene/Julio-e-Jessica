import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Lock, KeyRound, Users, MessageSquare, Download, Trash2,
  Plus, Search, CheckCircle, RefreshCw, LogOut, Heart,
  Home, Sparkles
} from 'lucide-react';
import { FloralBackgroundLayer, FloralCorner } from '../components/FloralDecorations';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('convidados');

  const [stats, setStats] = useState({ totalConvidados: 0, totalMensagens: 0 });
  const [convidados, setConvidados] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [novoConvidado, setNovoConvidado] = useState('');
  const [actionMessage, setActionMessage] = useState('');

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
      setLoginError(err.message || 'Senha incorreta.');
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
      setActionMessage('Convidado adicionado com sucesso!');
      setTimeout(() => setActionMessage(''), 3000);
      await loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteConvidado = async (id, nome) => {
    if (window.confirm(`Remover ${nome} da lista de convidados?`)) {
      try {
        await api.deleteConvidado(id);
        setActionMessage('Convidado removido.');
        setTimeout(() => setActionMessage(''), 3000);
        await loadAllData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleDeleteMensagem = async (id, nome) => {
    if (window.confirm(`Apagar a mensagem de ${nome}?`)) {
      try {
        await api.deleteMensagem(id);
        setActionMessage('Mensagem excluída.');
        setTimeout(() => setActionMessage(''), 3000);
        await loadAllData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleExportCSV = () => {
    if (convidados.length === 0) { alert('Nenhum convidado para exportar.'); return; }
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

  /* ── TELA DE LOGIN ── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-wedding-charcoal flex items-center justify-center p-4 relative overflow-hidden">
        <FloralBackgroundLayer className="opacity-20" />
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-wedding-gold/30">
          <FloralCorner className="-top-8 -right-8 w-36 h-36 opacity-30" position="top-right" />
          {/* Header do login */}
          <div className="bg-wedding-charcoal px-8 pt-10 pb-8 text-center relative z-10">
            <div className="w-16 h-16 bg-wedding-gold/20 text-wedding-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="font-cursive text-4xl text-white mb-1 font-normal">Jéssica & Júlio</h1>
            <p className="text-white/80 text-sm font-medium">Painel Exclusivo dos Noivos</p>
          </div>

          {/* Formulário */}
          <div className="p-8 relative z-10">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-wedding-charcoal mb-2">
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  className="w-full px-4 py-3 rounded-xl border border-wedding-gold/30 focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 outline-none text-sm font-medium"
                  autoFocus
                />
                {loginError && (
                  <p className="text-xs text-red-600 mt-2 font-bold">{loginError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-wedding-gold hover:bg-wedding-gold-dark text-white font-bold text-sm tracking-wider uppercase shadow-md transition-all cursor-pointer"
              >
                Entrar no Painel
              </button>
            </form>

            <a
              href="/"
              className="flex items-center justify-center gap-2 mt-6 text-xs text-wedding-charcoal/70 hover:text-wedding-gold-dark font-semibold transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Voltar para o site dos noivos</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ── PAINEL AUTENTICADO ── */
  return (
    <div className="min-h-screen bg-wedding-cream font-sans relative overflow-hidden">
      <FloralBackgroundLayer className="opacity-25" />

      {/* Topbar */}
      <header className="bg-wedding-charcoal text-white px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-wedding-gold fill-wedding-gold" />
          <div>
            <h1 className="font-serif text-lg font-bold leading-tight">Painel dos Noivos</h1>
            <p className="text-xs text-white/80 font-medium">Casamento Jéssica & Júlio — 14/11/2026</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-white/10 px-3 py-2 rounded-lg font-semibold transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver site público</span>
          </a>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-white/10 px-3 py-2 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10">

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-wedding-gold/30 shadow-md flex items-center justify-between relative overflow-hidden">
            <FloralCorner className="-top-8 -right-8 w-32 h-32 opacity-25" position="top-right" />
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-wider text-wedding-gold-dark font-bold mb-1">Presenças Confirmadas</p>
              <p className="text-4xl font-bold font-serif text-wedding-charcoal">{stats.totalConvidados}</p>
              <p className="text-xs text-wedding-charcoal/70 font-semibold mt-1">convidados confirmados na lista</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-wedding-gold-light text-wedding-gold-dark flex items-center justify-center relative z-10 shadow-sm">
              <Users className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-wedding-rose/50 shadow-md flex items-center justify-between relative overflow-hidden">
            <FloralCorner className="-top-8 -right-8 w-32 h-32 opacity-25" position="top-right" />
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-wider text-wedding-rose-dark font-bold mb-1">Recados no Mural</p>
              <p className="text-4xl font-bold font-serif text-wedding-charcoal">{stats.totalMensagens}</p>
              <p className="text-xs text-wedding-charcoal/70 font-semibold mt-1">mensagens e fotos recebidas</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-wedding-rose/40 text-wedding-rose-dark flex items-center justify-center relative z-10 shadow-sm">
              <MessageSquare className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Notificação de Ação */}
        {actionMessage && (
          <div className="p-4 bg-green-50 text-green-700 rounded-2xl border border-green-200 text-sm flex items-center gap-2 shadow-sm font-semibold">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Abas de Navegação */}
        <div className="flex items-center justify-between border-b border-wedding-gold/20 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('convidados')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'convidados'
                  ? 'bg-wedding-gold text-white shadow-md'
                  : 'text-wedding-charcoal/70 hover:bg-wedding-gold-light/40 font-semibold'
              }`}
            >
              Lista de Convidados ({convidados.length})
            </button>
            <button
              onClick={() => setActiveTab('mensagens')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'mensagens'
                  ? 'bg-wedding-gold text-white shadow-md'
                  : 'text-wedding-charcoal/70 hover:bg-wedding-gold-light/40 font-semibold'
              }`}
            >
              Mural de Mensagens ({mensagens.length})
            </button>
          </div>
          <button
            onClick={loadAllData}
            className="p-2.5 text-wedding-gold-dark hover:bg-wedding-gold-light rounded-xl transition-colors cursor-pointer"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* ABA: CONVIDADOS */}
        {activeTab === 'convidados' && (
          <div className="space-y-5">
            {/* Barra de Ações */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white border border-wedding-gold/30 focus:border-wedding-gold outline-none font-medium"
                />
                <Search className="w-4 h-4 text-wedding-gold-dark absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-wedding-sage-dark text-white text-sm font-bold hover:bg-wedding-sage transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Lista (CSV)</span>
              </button>
            </div>

            {/* Formulário Rápido de Adição */}
            <form onSubmit={handleAddConvidado} className="flex gap-2">
              <input
                type="text"
                placeholder="Adicionar convidado manualmente..."
                value={novoConvidado}
                onChange={(e) => setNovoConvidado(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-wedding-gold/30 bg-white focus:border-wedding-gold outline-none font-medium shadow-sm"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-wedding-charcoal text-white text-sm font-bold hover:bg-wedding-charcoal/90 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </form>

            {/* Tabela */}
            <div className="bg-white/95 rounded-2xl border border-wedding-gold/30 shadow-md overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-wedding-cream border-b border-wedding-gold/20">
                  <tr>
                    <th className="py-3.5 px-5 text-xs uppercase tracking-wider text-wedding-charcoal font-bold w-16">#</th>
                    <th className="py-3.5 px-5 text-xs uppercase tracking-wider text-wedding-charcoal font-bold">Nome do Convidado</th>
                    <th className="py-3.5 px-5 text-xs uppercase tracking-wider text-wedding-charcoal font-bold text-right w-24">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wedding-sand/50">
                  {filteredConvidados.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-12 text-wedding-charcoal/70 text-sm font-medium">
                        Nenhum convidado encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredConvidados.map((c, index) => (
                      <tr key={c.id} className="hover:bg-wedding-gold-light/20 transition-colors">
                        <td className="py-3.5 px-5 text-wedding-charcoal/70 font-mono text-xs font-bold">{index + 1}</td>
                        <td className="py-3.5 px-5 font-semibold text-wedding-charcoal">{c.nome}</td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() => handleDeleteConvidado(c.id, c.nome)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
        )}

        {/* ABA: MENSAGENS */}
        {activeTab === 'mensagens' && (
          <div>
            {mensagens.length === 0 ? (
              <div className="text-center py-16 bg-white/95 rounded-2xl border border-wedding-gold/30 shadow-md">
                <Sparkles className="w-10 h-10 text-wedding-gold/40 mx-auto mb-3" />
                <p className="text-wedding-charcoal/70 font-medium text-sm">Nenhuma mensagem registrada ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {mensagens.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white/95 rounded-2xl border border-wedding-gold/30 shadow-md overflow-hidden flex flex-col"
                  >
                    {msg.foto && (
                      <img
                        src={msg.foto}
                        alt={`Foto de ${msg.nome}`}
                        className="w-full h-44 object-cover"
                      />
                    )}
                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <p className="text-sm italic text-wedding-charcoal font-serif leading-relaxed mb-4 font-medium">
                        "{msg.mensagens}"
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-wedding-gold/20">
                        <span className="font-bold text-xs text-wedding-gold-dark">{msg.nome}</span>
                        <button
                          onClick={() => handleDeleteMensagem(msg.id, msg.nome)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
