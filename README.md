# 💒 Site de Casamento — Júlio & Jéssica

Site completo para o casamento de Júlio e Jéssica, conectado ao banco de dados **Neon PostgreSQL** e com painel administrativo exclusivo para os noivos.

Desenvolvido em **React + Vite**, integrado com **Neon PostgreSQL** e pronto para deploy em 1 clique na **Vercel**.

---

## 🚀 Tecnologias

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend / API:** Vercel Serverless Functions / Node.js Express (`/api`)
- **Banco de Dados:** Neon PostgreSQL (Serverless)
- **Deploy:** Vercel

---

## ✨ Funcionalidades

1. **Página Principal dos Convidados:**
   - Monograma e design elegante com paleta de casamento.
   - Contagem regressiva em tempo real até o grande dia (14/11/2026).
   - **Área de Data & Localização estruturada:**
     - Data, horário da cerimônia e festa.
     - Endereço com botões de rota direta para **Google Maps** e **Waze**, além de botão para copiar endereço.
     - Informações de Traje (*Dress Code*) e dicas do local.
   - **Confirmação de Presença (RSVP):**
     - Salva o nome diretamente na tabela `Convidados` do Neon.
     - Animação festiva de confetes ao confirmar.
   - **Mural de Mensagens & Fotos:**
     - Envio de recados e fotos dos convidados para os noivos (tabela `mensagens`).
     - Feed em tempo real de mensagens recebidas.

2. **Painel de Administração dos Noivos (`Área dos Noivos`):**
   - Acesso seguro protegido por senha (`julioejessica2026`).
   - Resumo com métricas de confirmações e mensagens.
   - Gerenciamento completo da lista de convidados (busca rápida, inclusão manual e exclusão).
   - **Exportação da lista de convidados em CSV / Excel**.
   - Moderação e exclusão de mensagens ou fotos do mural.

---

## 🛠️ Instalação e Uso Local

### 1. Clone o repositório:
```bash
git clone https://github.com/JuOlene/Julio-e-Jessica.git
cd Julio-e-Jessica
```

### 2. Instale as dependências:
```bash
npm install
```

### 3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:
```env
DATABASE_URL=postgresql://usuario:senha@host/neondb?sslmode=require
ADMIN_PASSWORD=julioejessica2026
```

### 4. Inicie a aplicação:
```bash
npm run dev
```
Acesse no seu navegador: `http://localhost:3000`

---

## 🌐 Deploy na Vercel

1. Importe o repositório na **Vercel**.
2. O **Framework Preset** será automaticamente detectado como **Vite**.
3. Em **Settings > Environment Variables**, adicione:
   - `DATABASE_URL`: String de conexão do seu banco no Neon.
   - `ADMIN_PASSWORD`: Senha de acesso para a Área dos Noivos.
4. Clique em **Deploy**.
