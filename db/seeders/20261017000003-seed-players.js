'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const sessions = await queryInterface.sequelize.query(
      'SELECT session_id FROM "game_sessions" WHERE session_code = $1',
      { bind: ['123456'], type: Sequelize.QueryTypes.SELECT }
    );
    if (sessions.length === 0) {
      return;
    }
    const sessionId = sessions[0].session_id;

    const users = await queryInterface.sequelize.query(
      'SELECT user_id FROM "users" ORDER BY user_id LIMIT 4',
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (users.length < 4) {
      return;
    }

    const existing = await queryInterface.sequelize.query(
      'SELECT COUNT(*) AS count FROM "players" WHERE session_id = $1',
      { bind: [sessionId], type: Sequelize.QueryTypes.SELECT }
    );
    if (Number(existing[0].count) > 0) {
      return;
    }

    await queryInterface.bulkInsert('players', [
      {
        session_id: sessionId,
        user_id: users[0].user_id,
        nickname: 'QuizMaster',
        score: 85,
        completed: true,
        finished_at: new Date('2026-10-17T10:00:00Z'),
      },
      {
        session_id: sessionId,
        user_id: users[1].user_id,
        nickname: 'Brainiac',
        score: 85,
        completed: true,
        finished_at: new Date('2026-10-17T10:05:00Z'),
      },
      {
        session_id: sessionId,
        user_id: users[2].user_id,
        nickname: 'A very long nickname for testing purposes',
        score: 70,
        completed: true,
        finished_at: new Date('2026-10-17T10:10:00Z'),
      },
      {
        session_id: sessionId,
        user_id: users[3].user_id,
        nickname: 'Incomplete',
        score: 0,
        completed: false,
        finished_at: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('players', null, {});
  },
};
