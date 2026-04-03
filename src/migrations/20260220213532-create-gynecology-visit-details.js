'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GynecologyVisitDetails', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      visitId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'Visits', key: 'id' },
        onDelete: 'CASCADE'
      },
      bloodPressure: { type: Sequelize.STRING, allowNull: true },
      bloodSugar: { type: Sequelize.STRING, allowNull: true },
      pregnancyWeek: { type: Sequelize.INTEGER, allowNull: true },
      visitType: {
        type: Sequelize.ENUM('Bleeding','Pregnancy Follow-up','Postpartum Follow-up','Infertility','Tumor'),
        allowNull: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('GynecologyVisitDetails');
  }
};