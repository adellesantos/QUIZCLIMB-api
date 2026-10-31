'use strict';

module.exports = (sequelize, DataTypes) => {
  const GameSession = sequelize.define(
    'GameSession',
    {
      session_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      session_code: {
        type: DataTypes.STRING(6),
        allowNull: false,
        unique: true,
      },
      started_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ended_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'LOBBY',
      },
      host_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      question_set_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'question_sets',
          key: 'question_set_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    },
    {
      tableName: 'game_sessions',
      timestamps: false,
    }
  );

  GameSession.associate = (models) => {
    GameSession.hasMany(models.Player, { foreignKey: 'session_id' });
    GameSession.belongsTo(models.User, { foreignKey: 'host_user_id', as: 'host' });
    GameSession.belongsTo(models.QuestionSet, { foreignKey: 'question_set_id', as: 'questionSet' });
  };

  return GameSession;
};
