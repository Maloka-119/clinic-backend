const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ClinicBranch = sequelize.define('ClinicBranch', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clinicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Clinics', key: 'id' },
        onDelete: 'CASCADE'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'ClinicBranches',
    timestamps: true
});

module.exports = ClinicBranch;