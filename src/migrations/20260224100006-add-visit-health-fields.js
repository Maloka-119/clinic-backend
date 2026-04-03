'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Visits', 'bloodSugar', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Visits', 'bloodPressure', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Visits', 'babyWeight', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Visits', 'babyAgeWeeks', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('Visits', 'requiredTests', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('Visits', 'previousTestResults', { type: Sequelize.TEXT, allowNull: true });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Visits', 'previousTestResults');
    await queryInterface.removeColumn('Visits', 'requiredTests');
    await queryInterface.removeColumn('Visits', 'babyAgeWeeks');
    await queryInterface.removeColumn('Visits', 'babyWeight');
    await queryInterface.removeColumn('Visits', 'bloodPressure');
    await queryInterface.removeColumn('Visits', 'bloodSugar');
  }
};
