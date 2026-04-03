const sequelize = require('../config/db'); 
const { DataTypes } = require('sequelize'); 
const DeliveryHistory = sequelize.define('DeliveryHistory', {

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

    deliveryDate: DataTypes.DATE,

    deliveryType: {
        type: DataTypes.ENUM('Normal', 'Cesarean')
    },

    babyGender: {
        type: DataTypes.ENUM('Male', 'Female')
    },

    complications: DataTypes.TEXT

}, {
    tableName: 'DeliveryHistories',
    timestamps: true
});

module.exports = DeliveryHistory;