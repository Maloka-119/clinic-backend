'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Visits', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Patients', key: 'id' },
        onDelete: 'CASCADE'
      },
      clinicBranchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ClinicBranches', key: 'id' },
        onDelete: 'CASCADE'
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      notes: { type: Sequelize.TEXT, allowNull: true },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Visits');
  }
};