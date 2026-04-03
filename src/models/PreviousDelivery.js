const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PreviousDelivery = sequelize.define('PreviousDelivery', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Patients', key: 'id' },
        onDelete: 'CASCADE'
    },
    deliveryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    deliveryType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    babyGender: {
        type: DataTypes.STRING,
        allowNull: true
    },
    babyWeightAtBirth: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Baby weight at birth (e.g. 3.2 kg)'
    },
    complications: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
    },
    dateOfEntry: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    tableName: 'PreviousDeliveries',
    timestamps: true
});

module.exports = PreviousDelivery;
