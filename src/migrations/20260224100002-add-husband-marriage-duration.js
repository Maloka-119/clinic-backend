'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('HusbandInfos', 'marriageDuration', { type: Sequelize.STRING, allowNull: true });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('HusbandInfos', 'marriageDuration');
  }
};
