'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DeliveryHistories', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Patients', key: 'id' },
        onDelete: 'CASCADE'
      },
      deliveryDate: { type: Sequelize.DATE, allowNull: true },
      deliveryType: { type: Sequelize.ENUM('Normal','Cesarean'), allowNull: true },
      babyGender: { type: Sequelize.ENUM('Male','Female'), allowNull: true },
      complications: { type: Sequelize.TEXT, allowNull: true },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('DeliveryHistories');
  }
};