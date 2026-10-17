'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('players', {
      player_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'game_sessions',
          key: 'session_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      finished_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint('players', {
      fields: ['session_id', 'user_id'],
      type: 'unique',
      name: 'players_session_id_user_id_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('players');
  },
};
