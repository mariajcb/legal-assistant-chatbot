'use strict';

exports.seed = function(knex) {
  return knex('applicants').del()
    .then(() => {
      return knex('applicants').insert([{
        id: 1,
        user_name: 'Karen Page',
        phone_number: '555-555-5555',
        current_job: 'office assistant',
        years_of_experience: 3,
        job_vacancy: 'legal assistant'
      }]);
    });
};
