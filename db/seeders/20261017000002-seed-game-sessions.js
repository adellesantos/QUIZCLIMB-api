'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const existing = await queryInterface.sequelize.query(
      'SELECT COUNT(*) AS count FROM "game_sessions" WHERE session_code = $1',
      { bind: ['123456'], type: Sequelize.QueryTypes.SELECT }
    );
    if (Number(existing[0].count) > 0) {
      return;
    }

    await queryInterface.bulkInsert('game_sessions', [
      {
        session_code: '123456',
        started_at: new Date('2026-10-17T09:00:00Z'),
        ended_at: new Date('2026-10-17T10:30:00Z'),
        status: 'CLOSED',
      },
      {
        session_code: '789012',
        started_at: new Date('2026-10-18T14:00:00Z'),
        ended_at: null,
        status: 'OPEN',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('game_sessions', null, {});
  },
};
