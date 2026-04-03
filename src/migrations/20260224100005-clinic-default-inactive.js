'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Clinics', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Clinics', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  }
};
