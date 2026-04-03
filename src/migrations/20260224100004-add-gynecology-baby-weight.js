'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('GynecologyVisitDetails', 'babyWeight', { type: Sequelize.STRING, allowNull: true });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('GynecologyVisitDetails', 'babyWeight');
  }
};
