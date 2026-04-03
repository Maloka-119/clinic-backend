'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Patients', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: { type: Sequelize.STRING, allowNull: false },
      age: { type: Sequelize.INTEGER, allowNull: true },
      gender: { type: Sequelize.STRING, allowNull: true },
      contactInfo: { type: Sequelize.STRING, allowNull: true },
      clinicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Clinics', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Patients');
  }
};