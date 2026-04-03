const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Patient = sequelize.define('Patient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contactInfo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Mrs or Miss'
    },
    bloodType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rhFactor: {
        type: DataTypes.STRING,
        allowNull: true
    },
    chronicIllnessesOrFamilyHistory: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    clinicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Clinics', key: 'id' },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'Patients',
    timestamps: true
});

module.exports = Patient;
