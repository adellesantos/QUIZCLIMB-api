'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      question_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      option_a: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      option_b: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      option_c: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      option_d: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      correct_option: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE "questions"
      ADD CONSTRAINT questions_correct_option_check
      CHECK ("correct_option" IN ('A', 'B', 'C', 'D'));
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "questions"
      ADD CONSTRAINT questions_points_check
      CHECK ("points" > 0);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('questions');
  },
};
