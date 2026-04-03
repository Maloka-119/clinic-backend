const sequelize = require('../config/db'); 
const { DataTypes } = require('sequelize'); 
const GynecologyVisitDetails = sequelize.define('GynecologyVisitDetails', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    visitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'Visits', key: 'id' },
        onDelete: 'CASCADE'
    },

    bloodPressure: DataTypes.STRING,
    bloodSugar: DataTypes.STRING,

    pregnancyWeek: DataTypes.INTEGER,
    babyWeight: {
        type: DataTypes.STRING,
        allowNull: true
    },

    visitType: {
        type: DataTypes.ENUM(
            'Bleeding',
            'Pregnancy Follow-up',
            'Postpartum Follow-up',
            'Infertility',
            'Tumor'
        )
    }

}, {
    tableName: 'GynecologyVisitDetails',
    timestamps: true
});

module.exports = GynecologyVisitDetails;