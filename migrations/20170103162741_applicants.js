'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('applicants', (table) => {
    table.increments();
    table.string('user_name').notNullable().defaultTo('');
    table.string('phone_number').notNullable().defaultTo('');
    table.string('current_job').notNullable().defaultTo('');
    table.string('years_of_experience').notNullable().defaultTo('');
    table.string('job_vacancy').notNullable().defaultTo('');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('applicants');
};
