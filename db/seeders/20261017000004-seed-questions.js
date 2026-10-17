'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const existing = await queryInterface.sequelize.query(
      'SELECT COUNT(*) AS count FROM "questions" WHERE question_text = $1',
      { bind: ['What is the capital of the Philippines?'], type: Sequelize.QueryTypes.SELECT }
    );
    if (Number(existing[0].count) > 0) {
      return;
    }

    await queryInterface.bulkInsert('questions', [
      {
        question_text: 'What is the capital of the Philippines?',
        option_a: 'Cebu',
        option_b: 'Manila',
        option_c: 'Davao',
        option_d: 'Baguio',
        correct_option: 'B',
        points: 1,
      },
      {
        question_text: 'Which planet is known as the Red Planet?',
        option_a: 'Venus',
        option_b: 'Earth',
        option_c: 'Mars',
        option_d: 'Jupiter',
        correct_option: 'C',
        points: 1,
      },
      {
        question_text: 'Who wrote Romeo and Juliet?',
        option_a: 'Charles Dickens',
        option_b: 'William Shakespeare',
        option_c: 'Jane Austen',
        option_d: 'Mark Twain',
        correct_option: 'B',
        points: 2,
      },
      {
        question_text: 'What is the largest ocean on Earth?',
        option_a: 'Atlantic Ocean',
        option_b: 'Indian Ocean',
        option_c: 'Arctic Ocean',
        option_d: 'Pacific Ocean',
        correct_option: 'D',
        points: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('questions', null, {});
  },
};
