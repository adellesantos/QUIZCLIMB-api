'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create question_sets table (Module 1 resource)
    await queryInterface.createTable('question_sets', {
      question_set_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      host_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });

    // Add host_user_id to game_sessions (session host ownership)
    await queryInterface.addColumn('game_sessions', 'host_user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add question_set_id to game_sessions (session uses a question set)
    await queryInterface.addColumn('game_sessions', 'question_set_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'question_sets',
        key: 'question_set_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Replace OPEN/CLOSED status check with LOBBY/RUNNING/CLOSED
    await queryInterface.sequelize.query(`
      ALTER TABLE "game_sessions"
      DROP CONSTRAINT IF EXISTS game_sessions_status_check;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "game_sessions"
      ADD CONSTRAINT game_sessions_status_check
      CHECK ("status" IN ('LOBBY', 'RUNNING', 'CLOSED'));
    `);

    // Add unique nickname per session
    await queryInterface.addConstraint('players', {
      fields: ['session_id', 'nickname'],
      type: 'unique',
      name: 'players_session_id_nickname_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('players', 'players_session_id_nickname_unique');

    await queryInterface.sequelize.query(`
      ALTER TABLE "game_sessions"
      DROP CONSTRAINT IF EXISTS game_sessions_status_check;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "game_sessions"
      ADD CONSTRAINT game_sessions_status_check
      CHECK ("status" IN ('OPEN', 'CLOSED'));
    `);

    await queryInterface.removeColumn('game_sessions', 'question_set_id');
    await queryInterface.removeColumn('game_sessions', 'host_user_id');
    await queryInterface.dropTable('question_sets');
  },
};
