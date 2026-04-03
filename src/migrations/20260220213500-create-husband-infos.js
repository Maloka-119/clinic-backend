'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HusbandInfos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'Patients', key: 'id' },
        onDelete: 'CASCADE'
      },
      name: { type: Sequelize.STRING, allowNull: false },
      job: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      bloodType: { type: Sequelize.ENUM('A','B','AB','O'), allowNull: true },
      rhFactor: { type: Sequelize.ENUM('+','-'), allowNull: true },
      semenAnalysisResult: { type: Sequelize.TEXT, allowNull: true },
      marriageDate: { type: Sequelize.DATE, allowNull: true },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('HusbandInfos');
  }
};