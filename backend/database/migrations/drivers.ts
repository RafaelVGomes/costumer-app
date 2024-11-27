import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('drivers')
  if (!exists) {
    await knex.schema.createTable('drivers', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.string('vehicle').notNullable();
      table.float('rating').notNullable();
      table.float('rate_per_km').notNullable();
      table.integer('min_distance').notNullable();
    });

    // Fixtures
    await knex('drivers').insert([
      {
        id: 1,
        name: 'Homer Simpson',
        description:
          'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio.',
        vehicle: 'Plymouth Valiant 1973',
        rating: 2.0,
        rate_per_km: 2.5,
        min_distance: 1,
      },
      {
        id: 2,
        name: 'Dominic Toretto',
        description:
          'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino.',
        vehicle: 'Dodge Charger R/T 1970',
        rating: 4.0,
        rate_per_km: 5.0,
        min_distance: 5,
      },
      {
        id: 3,
        name: 'James Bond',
        description:
          'Boa noite, sou James Bond. À sua disposição para um passeio suave e discreto.',
        vehicle: 'Aston Martin DB5 clássico',
        rating: 5.0,
        rate_per_km: 10.0,
        min_distance: 10,
      },
    ]);
  }
}

export async function down(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('drivers')
  if (exists) {
    await knex.schema.dropTable('drivers');
  }
}
