import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log(' Conectado com sucesso ao Neon PostgreSQL!');
});

pool.on('error', (err) => {
  console.error(' Erro no pool do PostgreSQL:', err);
});

export const query = (text, params) => pool.query(text, params);

export default {
  query,
  pool
};
