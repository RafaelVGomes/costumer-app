import knex, { Knex } from 'knex';

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite',
  },
  useNullAsDefault: true,
};

const db: Knex = knex(config);

async function initializeDatabase(): Promise<void> {
  // Tabela de motoristas
  const driversExists = await db.schema.hasTable('drivers');
  if (!driversExists) {
    await db.schema.createTable('drivers', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.decimal('price_per_km', 5, 2).notNullable();
    });
  }

  // Tabela de viagens
  const ridesExists = await db.schema.hasTable('rides');
  if (!ridesExists) {
    await db.schema.createTable('rides', (table) => {
      table.increments('id').primary();
      table.integer('customer_id').notNullable();
      table.string('origin').notNullable();
      table.string('destination').notNullable();
      table.integer('driver_id').references('id').inTable('drivers');
      table.float('distance').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }
}


initializeDatabase().catch((err) =>
  console.error('Database initialization error:', err)
);


export { db, initializeDatabase };
