import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  X, Lock, KeyRound, Users, MessageSquare, Download, Trash2, 
  Plus, Search, CheckCircle, RefreshCw, AlertCircle, LogOut, Heart 
} from 'lucide-react';

export default function AdminModal({ isOpen, onClose, onDataChanged }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('convidados'); // 'convidados' | 'mensagens'

  // Dados
  const [stats, setStats] = useState({ totalConvidados: 0, totalMensagens: 0 });
  const [convidados, setConvidados] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Filtros e Formulários
  const [searchTerm, setSearchTerm] = useState('');
  const [novoConvidado, setNovoConvidado] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Ao abrir ou autenticar, carregar dados
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAllData();
    }
  }, [isOpen, isAuthenticated]);

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
      console.error('Erro ao carregar dados do admin:', err);
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
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message || 'Erro ao adicionar convidado');
    }
  };

  const handleDeleteConvidado = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja remover ${nome} da lista de convidados?`)) {
      try {
        await api.deleteConvidado(id);
        setActionMessage('Convidado removido com sucesso!');
        setTimeout(() => setActionMessage(''), 3000);
        await loadAllData();
        if (onDataChanged) onDataChanged();
      } catch (err) {
        alert(err.message || 'Erro ao excluir convidado');
      }
    }
  };

  const handleDeleteMensagem = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja apagar a mensagem de ${nome}?`)) {
      try {
        await api.deleteMensagem(id);
        setActionMessage('Mensagem excluída com sucesso!');
        setTimeout(() => setActionMessage(''), 3000);
        await loadAllData();
        if (onDataChanged) onDataChanged();
      } catch (err) {
        alert(err.message || 'Erro ao excluir mensagem');
      }
    }
  };

  const handleExportCSV = () => {
    if (convidados.length === 0) {
      alert('Nenhum convidado para exportar.');
      return;
    }

    const headers = 'ID,Nome do Convidado\n';
    const rows = convidados.map(c => `"${c.id}","${c.nome.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob(["\ufeff" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Lista_Convidados_Casamento_Jessica_e_Julio.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isOpen) return null;

  const filteredConvidados = convidados.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-wedding-gold/30">
        
        {/* Header do Modal */}
        <div className="bg-wedding-charcoal text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-wedding-gold/20 text-wedding-gold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold">Painel dos Noivos</h2>
              <p className="text-xs text-white/60">Gestão do Casamento de Jéssica & Júlio</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs text-white/70 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                title="Sair do painel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo do Modal */}
        {!isAuthenticated ? (
          /* Tela de Login */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 bg-wedding-gold-light text-wedding-gold-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <KeyRound className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-wedding-charcoal mb-2">Acesso Restrito</h3>
            <p className="text-sm text-wedding-charcoal/70 mb-6">
              Digite a senha dos noivos para gerenciar os convidados e mensagens.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha de acesso"
                  className="w-full px-4 py-3 rounded-xl border border-wedding-sand focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 outline-none text-center text-sm"
                  autoFocus
                />
                {loginError && (
                  <p className="text-xs text-red-500 mt-2 font-medium">{loginError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-wedding-gold hover:bg-wedding-gold-dark text-white font-medium text-sm tracking-wider uppercase shadow transition-all"
              >
                Entrar no Painel
              </button>
            </form>
            <p className="text-[11px] text-wedding-charcoal/50 mt-4">
              Senha padrão: <code className="bg-wedding-sand/40 px-1.5 py-0.5 rounded">julioejessica2026</code>
            </p>
          </div>
        ) : (
          /* Painel Autenticado */
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            
            {/* Notificação de Ação */}
            {actionMessage && (
              <div className="p-3 bg-green-50 text-green-700 rounded-xl border border-green-200 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>{actionMessage}</span>
              </div>
            )}

            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-wedding-cream border border-wedding-gold/20 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-wedding-gold-dark font-semibold">
                    Presenças Confirmadas
                  </span>
                  <p className="text-3xl font-bold font-serif text-wedding-charcoal mt-1">
                    {stats.totalConvidados}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-wedding-gold-light text-wedding-gold-dark flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-wedding-cream border border-wedding-gold/20 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-wedding-gold-dark font-semibold">
                    Recados no Mural
                  </span>
                  <p className="text-3xl font-bold font-serif text-wedding-charcoal mt-1">
                    {stats.totalMensagens}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-wedding-rose/50 text-wedding-rose-dark flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Abas */}
            <div className="flex items-center justify-between border-b border-wedding-sand pb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('convidados')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'convidados'
                      ? 'bg-wedding-gold text-white shadow'
                      : 'text-wedding-charcoal/70 hover:bg-wedding-sand/40'
                  }`}
                >
                  Lista de Convidados ({convidados.length})
                </button>
                <button
                  onClick={() => setActiveTab('mensagens')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'mensagens'
                      ? 'bg-wedding-gold text-white shadow'
                      : 'text-wedding-charcoal/70 hover:bg-wedding-sand/40'
                  }`}
                >
                  Mural de Mensagens ({mensagens.length})
                </button>
              </div>

              <button
                onClick={loadAllData}
                className="p-2 text-wedding-gold-dark hover:bg-wedding-gold-light rounded-lg transition-colors"
                title="Atualizar dados"
              >
                <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Conteúdo da Aba: CONVIDADOS */}
            {activeTab === 'convidados' && (
              <div className="space-y-4">
                {/* Ações: Busca, Adicionar Manual e Exportar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Buscar por nome..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-wedding-cream border border-wedding-sand focus:border-wedding-gold outline-none"
                    />
                    <Search className="w-4 h-4 text-wedding-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleExportCSV}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-wedding-sage-dark text-white text-xs font-semibold hover:bg-wedding-sage transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar Excel / CSV</span>
                    </button>
                  </div>
                </div>

                {/* Formulário Rápido para Adicionar Convidado */}
                <form onSubmit={handleAddConvidado} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Adicionar convidado manualmente..."
                    value={novoConvidado}
                    onChange={(e) => setNovoConvidado(e.target.value)}
                    className="flex-1 px-4 py-2 text-xs rounded-xl border border-wedding-sand focus:border-wedding-gold outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-wedding-charcoal text-white text-xs font-semibold hover:bg-wedding-charcoal/90 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </form>

                {/* Tabela de Convidados */}
                <div className="border border-wedding-sand rounded-2xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-wedding-cream border-b border-wedding-sand text-wedding-charcoal/70 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4 w-16">#</th>
                        <th className="py-3 px-4">Nome do Convidado</th>
                        <th className="py-3 px-4 text-right w-24">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-wedding-sand/40">
                      {filteredConvidados.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-8 text-wedding-charcoal/50">
                            Nenhum convidado encontrado.
                          </td>
                        </tr>
                      ) : (
                        filteredConvidados.map((c, index) => (
                          <tr key={c.id} className="hover:bg-wedding-gold-light/20 transition-colors">
                            <td className="py-3 px-4 text-wedding-charcoal/60 font-mono">{index + 1}</td>
                            <td className="py-3 px-4 font-medium text-wedding-charcoal">{c.nome}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeleteConvidado(c.id, c.nome)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remover convidado"
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

            {/* Conteúdo da Aba: MENSAGENS */}
            {activeTab === 'mensagens' && (
              <div className="space-y-4">
                {mensagens.length === 0 ? (
                  <p className="text-center py-12 text-wedding-charcoal/50 text-xs">
                    Nenhuma mensagem registrada ainda.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mensagens.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 rounded-2xl bg-wedding-cream/60 border border-wedding-sand flex flex-col justify-between"
                      >
                        <div>
                          {msg.foto && (
                            <img
                              src={msg.foto}
                              alt={`Foto de ${msg.nome}`}
                              className="w-full h-36 object-cover rounded-xl mb-3"
                            />
                          )}
                          <p className="text-xs italic text-wedding-charcoal/90 font-serif mb-3">
                            "{msg.mensagens}"
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-wedding-sand/40">
                          <span className="font-semibold text-xs text-wedding-gold-dark">{msg.nome}</span>
                          <button
                            onClick={() => handleDeleteMensagem(msg.id, msg.nome)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir recado"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
