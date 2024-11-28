import knex, { Knex } from 'knex';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const databasePath = path.resolve(__dirname, '../database.sqlite');

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: databasePath,
  },
  useNullAsDefault: true,
};

const db: Knex = knex(config);

async function initializeDatabase(): Promise<void> {
  try {
    if (!fs.existsSync(databasePath)) {
      console.log('Banco de dados não encontrado. Criando arquivo...');
      fs.writeFileSync(databasePath, '');

      console.log('Criando tabelas...');
      execSync('npx knex migrate:up drivers.ts', { encoding: 'utf-8', });
      console.log('Tabela drivers criada...');
      execSync('npx knex migrate:up rides.ts', { encoding: 'utf-8' });
      console.log('Tabela rides criada...');
      console.log('Banco de dados criado.');
    }
  } catch (error) {
    console.log('BD Error:', error);
  }
}

export { db, initializeDatabase };
