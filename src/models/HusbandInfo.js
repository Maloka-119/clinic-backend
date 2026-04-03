const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

/**
 * HusbandInfo Model
 * Stores information about the husband of married patients
 * One-to-One relationship with Patient
 */
const HusbandInfo = sequelize.define('HusbandInfo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Reference to patient
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'Patients', key: 'id' },
        onDelete: 'CASCADE'
    },
    // Husband details
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    job: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bloodType: {
        type: DataTypes.ENUM('A', 'B', 'AB', 'O'),
        allowNull: true
    },
    rhFactor: {
        type: DataTypes.ENUM('+', '-'),
        allowNull: true
    },
    // Semen analysis result
    semenAnalysisResult: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Results from semen analysis test'
    },
    // Marriage date
    marriageDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    marriageDuration: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'HusbandInfos',
    timestamps: true
});

module.exports = HusbandInfo;
