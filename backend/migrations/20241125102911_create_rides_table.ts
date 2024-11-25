import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('rides', (table) => {
    table.increments('id').primary();
    table.integer('customer_id').notNullable();
    table.string('origin').notNullable();
    table.string('destination').notNullable();
    table.integer('driver_id').references('id').inTable('drivers');
    table.float('distance').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('rides');
}
