'use strict';

module.exports = (sequelize, DataTypes) => {
  const QuestionSet = sequelize.define(
    'QuestionSet',
    {
      question_set_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
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
    },
    {
      tableName: 'question_sets',
      timestamps: false,
    }
  );

  QuestionSet.associate = (models) => {
    QuestionSet.belongsTo(models.User, { foreignKey: 'host_user_id', as: 'host' });
    QuestionSet.hasMany(models.GameSession, { foreignKey: 'question_set_id' });
  };

  return QuestionSet;
};
