'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('PreviousDeliveries', 'babyWeightAtBirth', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('PreviousDeliveries', 'babyWeightAtBirth');
  }
};
