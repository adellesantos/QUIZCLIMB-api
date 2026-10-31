'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const existing = await queryInterface.sequelize.query(
      'SELECT COUNT(*) AS count FROM "question_sets" WHERE title = $1',
      { bind: ['General Knowledge Set'], type: Sequelize.QueryTypes.SELECT }
    );
    if (Number(existing[0].count) > 0) {
      return;
    }

    await queryInterface.bulkInsert('question_sets', [
      {
        title: 'General Knowledge Set',
        host_user_id: 1,
      },
      {
        title: 'Science and Nature Set',
        host_user_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('question_sets', null, {});
  },
};
