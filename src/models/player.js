'use strict';

module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define(
    'Player',
    {
      player_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'game_sessions',
          key: 'session_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      finished_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'players',
      timestamps: false,
    }
  );

  Player.associate = (models) => {
    Player.belongsTo(models.User, { foreignKey: 'user_id' });
    Player.belongsTo(models.GameSession, { foreignKey: 'session_id' });
  };

  return Player;
};
