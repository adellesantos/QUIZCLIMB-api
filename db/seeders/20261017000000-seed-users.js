'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const existing = await queryInterface.sequelize.query(
      'SELECT COUNT(*) AS count FROM "users" WHERE email = $1',
      { bind: ['juan.delacruz@test.test'], type: Sequelize.QueryTypes.SELECT }
    );
    if (Number(existing[0].count) > 0) {
      return;
    }

    await queryInterface.bulkInsert('users', [
      {
        school_id: '2099-0001',
        full_name: 'Juan Dela Cruz',
        email: 'juan.delacruz@test.test',
        role: 'HOST',
      },
      {
        school_id: '2099-0002',
        full_name: 'Maria Santos',
        email: 'maria.santos@test.test',
        role: 'PLAYER',
      },
      {
        school_id: '2099-0003',
        full_name: 'Jose Rizal',
        email: 'jose.rizal@test.test',
        role: 'PLAYER',
      },
      {
        school_id: '2099-0004',
        full_name: 'Andres Bonifacio',
        email: 'andres.bonifacio@test.test',
        role: 'ADMIN',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
