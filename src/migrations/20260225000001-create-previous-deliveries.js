'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PreviousDeliveries', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Patients', key: 'id' },
        onDelete: 'CASCADE'
      },
      deliveryDate: { type: Sequelize.DATEONLY, allowNull: true },
      deliveryType: { type: Sequelize.STRING, allowNull: true },
      babyGender: { type: Sequelize.STRING, allowNull: true },
      complications: { type: Sequelize.TEXT, allowNull: true },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      dateOfEntry: { type: Sequelize.DATEONLY, allowNull: false },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('PreviousDeliveries');
  }
};
