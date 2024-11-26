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
  if (!fs.existsSync(databasePath)) {
    console.log('Banco de dados não encontrado. Criando arquivo...');
    fs.writeFileSync(databasePath, '');
  }

  console.log('Verificando tabelas...');
  const hasTables = await db.schema.hasTable('rides');

  if (!hasTables) {
    console.log('Tabelas não encontradas. Aplicando migrations...');
    applyMigrations();
  } else {
    console.log('Banco de dados já configurado.');
  }
}

function applyMigrations(): void {
  try {
    const output = execSync('npx knex migrate:latest', { encoding: 'utf-8' });
    console.log(`Migrations aplicadas:\n${output}`);
  } catch (error) {
    console.error('Erro ao aplicar migrations:', error);
    process.exit(1);
  }
}

export { db, initializeDatabase };
