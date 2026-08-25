# 💒 Site de Casamento — Júlio & Jéssica

Site completo para o casamento de Júlio e Jéssica, conectado ao banco de dados **Neon PostgreSQL** e com painel administrativo exclusivo para os noivos.

---

## 📁 Estrutura do Projeto

O repositório é organizado no formato Full Stack com pastas separadas para o frontend e backend:

```
Casamento Julio e Jessica/
├── client/                 # Frontend (React + Vite + Tailwind CSS)
│   ├── public/             # Arquivos públicos e ícones
│   ├── src/
│   │   ├── components/     # Componentes da interface (Hero, RSVP, Mural, etc.)
│   │   ├── pages/          # Páginas (Home, Admin)
│   │   └── services/       # Integração com a API
│   ├── .env.example        # Exemplo de variáveis de ambiente do client
│   └── package.json
│
├── server/                 # Backend (Node.js + Express + PostgreSQL)
│   ├── src/
│   │   ├── config/         # Conexão com o banco de dados Neon
│   │   ├── routes/         # Rotas da API (convidados, mensagens, admin)
│   │   └── index.js        # Ponto de entrada do servidor Express
│   ├── .env.example        # Exemplo de variáveis de ambiente do server
│   └── package.json
│
├── .gitignore              # Ignora node_modules, dist e arquivos .env
├── package.json            # Scripts facilitadores na raiz
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

- **Frontend (`/client`):** React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend (`/server`):** Node.js, Express, PostgreSQL (`pg`), CORS, Dotenv
- **Banco de Dados:** Neon PostgreSQL (Serverless)

---

## 📋 Funcionalidades

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

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- Node.js instalado (v18+)
- Conta/Banco configurado no [Neon](https://neon.tech)

### 2. Instalação das Dependências

Instale as dependências de ambos os projetos:
```bash
# Na raiz:
npm run install:all

# Ou manualmente em cada pasta:
cd client && npm install
cd ../server && npm install
```

### 3. Configurar as Variáveis de Ambiente

No diretório `server/`, crie um arquivo `.env` baseado no `.env.example`:
```env
PORT=5000
DATABASE_URL=sua_connection_string_do_neon_aqui
ADMIN_PASSWORD=sua_senha_de_admin
```

*(Opcional)* No diretório `client/`, caso vá apontar para uma API remota, configure o `.env`:
```env
VITE_API_URL=/api
```

### 4. Executar o Backend:
```bash
cd server
npm run dev
# Servidor disponível em: http://localhost:5000
```

### 5. Executar o Frontend:
```bash
cd client
npm run dev
# Aplicação disponível em: http://localhost:3000
```
