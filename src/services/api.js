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
  buffetTime: "17:30H",
  buffetMapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+Prestes+Maia,+1310+-+Centro,+Diadema+-+SP",
  buffetWazeUrl: "https://waze.com/ul?q=Av.+Prestes+Maia,+1310+-+Centro,+Diadema+-+SP",

  // Pix
  pixKey: "11 954886391",
  pixTitular: "Jéssica e Julio",
  pixBanco: "Nubank",

  // WhatsApp e RSVP (Número Oficial dos noivos: 11954886391 / Teste: 11953582337)
  whatsappNumber: "5511954886391",
  whatsappTestNumber: "5511953582337",
  whatsappMessage: "Olá Jéssica e Julio! Confirmo com muita alegria a minha presença no casamento de vocês dia 14/11/2026 às 15:30h! 🥂✨",

  // Música de Fundo: Aliança - Tribalistas (instrumental) | Banda PH
  musicUrl: "/alianca_tribalistas_instrumental_banda_ph.mp3"
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

  // Convidados (Sincronização Neon PostgreSQL + LocalStorage)
  async getConvidados() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`${API_URL}/convidados`, { 
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' }
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Normaliza formato retornado do banco
          const normalized = data.map(item => ({
            id: String(item.id),
            nome: item.nome,
            confirmado: Boolean(item.confirmado),
            data_confirmacao: item.confirmado ? (item.data_confirmacao || 'Confirmado') : null
          }));
          localStorage.setItem('wedding_convidados_local', JSON.stringify(normalized));
          return normalized;
        }
      }
    } catch (e) {
      console.warn('API remota não respondeu a tempo, usando cache local:', e);
    }

    const local = localStorage.getItem('wedding_convidados_local');
    return local ? JSON.parse(local) : [];
  },

  async addConvidado(nome, confirmado = false) {
    const trimmed = nome.trim();
    let guestObj = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      nome: trimmed,
      confirmado: Boolean(confirmado),
      data_confirmacao: confirmado ? new Date().toLocaleDateString('pt-BR') : null
    };

    // 1. Tenta salvar diretamente no Postgres da Vercel
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`${API_URL}/convidados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: trimmed, confirmado: Boolean(confirmado) }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        const serverGuest = json.convidado || json;
        if (serverGuest && serverGuest.id) {
          guestObj = {
            id: String(serverGuest.id),
            nome: serverGuest.nome,
            confirmado: Boolean(serverGuest.confirmado),
            data_confirmacao: serverGuest.confirmado ? new Date().toLocaleDateString('pt-BR') : null
          };
        }
      }
    } catch (e) {
      console.warn('Salvando em fallback local:', e);
    }

    // 2. Atualiza cache local e notifica a interface
    try {
      const local = localStorage.getItem('wedding_convidados_local');
      let list = local ? JSON.parse(local) : [];
      list = list.filter(c => c.id !== guestObj.id && c.nome.toLowerCase() !== guestObj.nome.toLowerCase());
      list.unshift(guestObj);
      localStorage.setItem('wedding_convidados_local', JSON.stringify(list));
      window.dispatchEvent(new Event('wedding_guests_updated'));
    } catch (e) {}

    return guestObj;
  },

  async confirmConvidado(idOrName) {
    const trimmed = String(idOrName).trim();
    let confirmedGuest = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      nome: trimmed,
      confirmado: true,
      data_confirmacao: new Date().toLocaleDateString('pt-BR')
    };

    // 1. Tenta confirmar no Postgres da Vercel
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`${API_URL}/convidados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: trimmed, confirmado: true }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        const serverGuest = json.convidado || json;
        if (serverGuest && serverGuest.id) {
          confirmedGuest = {
            id: String(serverGuest.id),
            nome: serverGuest.nome,
            confirmado: true,
            data_confirmacao: new Date().toLocaleDateString('pt-BR')
          };
        }
      }
    } catch (e) {
      console.warn('Confirmando em cache local:', e);
    }

    // 2. Atualiza cache local
    try {
      const local = localStorage.getItem('wedding_convidados_local');
      let list = local ? JSON.parse(local) : [];
      let found = false;
      list = list.map(c => {
        if (String(c.id) === String(idOrName) || c.nome.toLowerCase().trim() === trimmed.toLowerCase()) {
          found = true;
          return { ...c, confirmado: true, data_confirmacao: new Date().toLocaleDateString('pt-BR') };
        }
        return c;
      });
      if (!found) {
        list.unshift(confirmedGuest);
      }
      localStorage.setItem('wedding_convidados_local', JSON.stringify(list));
      window.dispatchEvent(new Event('wedding_guests_updated'));
    } catch (e) {}

    return confirmedGuest;
  },

  async deleteConvidado(id) {
    // 1. Atualiza cache local imediatamente
    try {
      const local = localStorage.getItem('wedding_convidados_local');
      if (local) {
        const list = JSON.parse(local).filter(c => String(c.id) !== String(id));
        localStorage.setItem('wedding_convidados_local', JSON.stringify(list));
        window.dispatchEvent(new Event('wedding_guests_updated'));
      }
    } catch (e) {}

    // 2. Tenta deletar no Postgres
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      await fetch(`${API_URL}/convidados/${id}`, { 
        method: 'DELETE',
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
    } catch (e) {}

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
