'use strict';

module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    'Question',
    {
      question_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      question_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      option_a: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      option_b: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      option_c: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      option_d: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      correct_option: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: 'questions',
      timestamps: false,
    }
  );

  return Question;
};
