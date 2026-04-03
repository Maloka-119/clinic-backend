'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Patients', 'title', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Patients', 'bloodType', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Patients', 'rhFactor', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Patients', 'chronicIllnessesOrFamilyHistory', { type: Sequelize.TEXT, allowNull: true });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Patients', 'chronicIllnessesOrFamilyHistory');
    await queryInterface.removeColumn('Patients', 'rhFactor');
    await queryInterface.removeColumn('Patients', 'bloodType');
    await queryInterface.removeColumn('Patients', 'title');
  }
};
