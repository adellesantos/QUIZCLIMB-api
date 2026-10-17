'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_sessions', {
      session_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      session_code: {
        type: Sequelize.STRING(6),
        allowNull: false,
        unique: true,
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'OPEN',
      },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE "game_sessions"
      ADD CONSTRAINT game_sessions_session_code_check
      CHECK ("session_code" ~ '^[1-9][0-9]{5}$');
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "game_sessions"
      ADD CONSTRAINT game_sessions_status_check
      CHECK ("status" IN ('OPEN', 'CLOSED'));
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('game_sessions');
  },
};
