'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Visits', 'type', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Visits', 'reason', { type: Sequelize.STRING, allowNull: true });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Visits', 'reason');
    await queryInterface.removeColumn('Visits', 'type');
  }
};
