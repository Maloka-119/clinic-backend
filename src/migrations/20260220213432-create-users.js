'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      clinicId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Clinics', key: 'id' },
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      clinicBranchId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'ClinicBranches', key: 'id' },
        onDelete: 'SET NULL'
      },
      role: {
        type: Sequelize.ENUM('ADMIN', 'OWNER', 'EMPLOYEE', 'PATIENT'),
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  }
};