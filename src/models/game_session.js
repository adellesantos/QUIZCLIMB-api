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
        defaultValue: 'OPEN',
      },
    },
    {
      tableName: 'game_sessions',
      timestamps: false,
    }
  );

  GameSession.associate = (models) => {
    GameSession.hasMany(models.Player, { foreignKey: 'session_id' });
  };

  return GameSession;
};
