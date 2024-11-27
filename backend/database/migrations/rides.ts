import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('rides');
  if (!exists) {
    await knex.schema.createTable('rides', (table) => {
      table.increments('id').primary();
      table.string('customer_id').notNullable();
      table.string('origin').nullable();
      table.string('destination').nullable();
      table.string('driver_id').references('id').inTable('drivers');
      table.string('driver_name').notNullable();
      table.float('distance').notNullable();
      table.decimal('value', 10, 2).nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('rides');
}
