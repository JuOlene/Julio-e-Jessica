const API_URL = import.meta.env.VITE_API_URL || '/api';

// Configurações Padrão de Localização e Pix
export const DEFAULT_CONFIG = {
  // Cerimônia
  ceremonyVenue: "Paróquia Nossa Senhora Rainha dos Apóstolos",
  ceremonyAddress: "Rua Alice dos Santos Peixe, 61 - Jardim Selma, São Paulo - SP",
  ceremonyTime: "15:30H",
  ceremonyMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Alice+dos+Santos+Peixe,+61+-+Jardim+Selma,+São+Paulo+-+SP",
  ceremonyWazeUrl: "https://waze.com/ul?q=Rua+Alice+dos+Santos+Peixe,+61+-+Jardim+Selma,+São+Paulo+-+SP",

  // Buffet
  buffetVenue: "Buffet Arte Sabor e Amor",
  buffetAddress: "Av. Prestes Maia, 1310 - Centro, Diadema - SP",
  buffetMapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+Prestes+Maia,+1310+-+Centro,+Diadema+-+SP",
  buffetWazeUrl: "https://waze.com/ul?q=Av.+Prestes+Maia,+1310+-+Centro,+Diadema+-+SP",

  // Pix
  pixKey: "casamentojulioejessica@email.com",
  pixTitular: "Jéssica e Júlio",
  pixBanco: "Nubank"
};

export const api = {
  // Configurações do Casamento (Localização, Buffet, Pix)
  getConfig() {
    try {
      const saved = localStorage.getItem('wedding_config_jj');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CONFIG;
  },

  saveConfig(newConfig) {
    try {
      const updated = { ...this.getConfig(), ...newConfig };
      localStorage.setItem('wedding_config_jj', JSON.stringify(updated));
      window.dispatchEvent(new Event('wedding_config_updated'));
      return updated;
    } catch (e) {
      console.error(e);
      throw new Error('Não foi possível salvar as configurações.');
    }
  },

  // Convidados
  async getConvidados() {
    // 1. Lê imediatamente do localStorage (fonte primária e instantânea)
    let localGuests = [];
    try {
      const local = localStorage.getItem('wedding_convidados_local');
      if (local) {
        localGuests = JSON.parse(local);
      }
    } catch (e) {
      console.error('Erro ao ler convidados locais:', e);
    }

    // Se já existem convidados locais, retorna-os imediatamente
    if (Array.isArray(localGuests) && localGuests.length > 0) {
      return localGuests;
    }

    // 2. Tenta carregar do backend se o localStorage estiver vazio
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_URL}/convidados`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem('wedding_convidados_local', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      // Ignora erro de rede
    }

    return localGuests;
  },

  async addConvidado(nome, confirmado = false) {
    const novoConvidado = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      nome: nome.trim(),
      confirmado: Boolean(confirmado),
      data_confirmacao: confirmado ? new Date().toLocaleDateString('pt-BR') : null
    };

    // Salva imediatamente no localStorage para resposta instantânea
    try {
      const local = localStorage.getItem('wedding_convidados_local');
      const list = local ? JSON.parse(local) : [];
      list.unshift(novoConvidado);
      localStorage.setItem('wedding_convidados_local', JSON.stringify(list));
      window.dispatchEvent(new Event('wedding_guests_updated'));
    } catch (e) {
      console.error('Erro ao gravar no localStorage:', e);
    }

    // Tenta sincronizar com API em background com timeout curto
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      fetch(`${API_URL}/convidados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoConvidado),
        signal: controller.signal
      }).then(() => clearTimeout(timeoutId)).catch(() => {});
    } catch (e) {
      // Background sync falhou silenciosamente
    }

    return novoConvidado;
  },

  async confirmConvidado(idOrName) {
    const local = localStorage.getItem('wedding_convidados_local');
    let list = local ? JSON.parse(local) : [];
    let confirmedGuest = null;

    list = list.map(c => {
      if (String(c.id) === String(idOrName) || c.nome.toLowerCase().trim() === String(idOrName).toLowerCase().trim()) {
        confirmedGuest = {
          ...c,
          confirmado: true,
          data_confirmacao: new Date().toLocaleDateString('pt-BR')
        };
        return confirmedGuest;
      }
      return c;
    });

    // Se o nome digitado não estava pré-cadastrado, cadastra direto como confirmado
    if (!confirmedGuest) {
      confirmedGuest = {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        nome: String(idOrName).trim(),
        confirmado: true,
        data_confirmacao: new Date().toLocaleDateString('pt-BR')
      };
      list.unshift(confirmedGuest);
    }

    localStorage.setItem('wedding_convidados_local', JSON.stringify(list));
    window.dispatchEvent(new Event('wedding_guests_updated'));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      fetch(`${API_URL}/convidados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(confirmedGuest),
        signal: controller.signal
      }).then(() => clearTimeout(timeoutId)).catch(() => {});
    } catch (e) {}

    return confirmedGuest;
  },

  async deleteConvidado(id) {
    const local = localStorage.getItem('wedding_convidados_local');
    if (local) {
      const list = JSON.parse(local).filter(c => String(c.id) !== String(id));
      localStorage.setItem('wedding_convidados_local', JSON.stringify(list));
      window.dispatchEvent(new Event('wedding_guests_updated'));
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      fetch(`${API_URL}/convidados/${id}`, { 
        method: 'DELETE',
        signal: controller.signal 
      }).then(() => clearTimeout(timeoutId)).catch(() => {});
    } catch (e) {
      // Background sync falhou silenciosamente
    }

    return { success: true };
  },

  // Admin Login
  async adminLogin(password) {
    // Senha padrão dos noivos
    if (password === 'julioejessica2026' || password === 'admin' || password === '1234') {
      return { success: true };
    }
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) return res.json();
    } catch (e) {
      // Ignora erro de rede se senha local foi validada
    }
    throw new Error('Senha incorreta.');
  }
};
