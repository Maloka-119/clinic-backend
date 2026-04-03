const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const toBoolean = require('../utils/toBoolean');

const Clinic = sequelize.define('Clinic', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    type: {
        type: DataTypes.ENUM('GYNECOLOGY', 'GENERAL'),
        allowNull: false
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        // Normalize DB values (boolean/0/1/'0'/'1') into a real boolean.
        get() {
            return toBoolean(this.getDataValue('isActive'));
        },
        set(value) {
            this.setDataValue('isActive', toBoolean(value));
        }
    }

}, {
    tableName: 'Clinics',
    timestamps: true
});

module.exports = Clinic;