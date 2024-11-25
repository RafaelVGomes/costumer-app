import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('drivers', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.decimal('price_per_km', 5, 2).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('drivers');
}
