const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Visit = sequelize.define('Visit', {
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
    clinicBranchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'ClinicBranches', key: 'id' },
        onDelete: 'CASCADE'
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Checkup or Consultation'
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bloodSugar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bloodPressure: {
        type: DataTypes.STRING,
        allowNull: true
    },
    babyWeight: {
        type: DataTypes.STRING,
        allowNull: true
    },
    babyAgeWeeks: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    requiredTests: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'تحاليل مطلوبه'
    },
    previousTestResults: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'نتيجه التحاليل السابقه'
    }
}, {
    tableName: 'Visits',
    timestamps: true
});

module.exports = Visit;
