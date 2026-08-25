const API_URL = import.meta.env.VITE_API_URL || '/api';


export const api = {
  // Convidados
  async getConvidados() {
    const res = await fetch(`${API_URL}/convidados`);
    if (!res.ok) throw new Error('Erro ao buscar lista de convidados');
    return res.json();
  },

  async addConvidado(nome) {
    const res = await fetch(`${API_URL}/convidados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao confirmar presença');
    return data;
  },

  async deleteConvidado(id) {
    const res = await fetch(`${API_URL}/convidados/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao excluir convidado');
    return data;
  },

  // Mensagens do Mural
  async getMensagens() {
    const res = await fetch(`${API_URL}/mensagens`);
    if (!res.ok) throw new Error('Erro ao buscar mensagens do mural');
    return res.json();
  },

  async addMensagem({ nome, mensagens, foto }) {
    const res = await fetch(`${API_URL}/mensagens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, mensagens, foto })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao enviar mensagem');
    return data;
  },

  async deleteMensagem(id) {
    const res = await fetch(`${API_URL}/mensagens/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao excluir mensagem');
    return data;
  },

  // Admin
  async adminLogin(password) {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Senha incorreta');
    return data;
  },

  async getAdminStats() {
    const res = await fetch(`${API_URL}/admin/stats`);
    if (!res.ok) throw new Error('Erro ao carregar estatísticas');
    return res.json();
  }
};
