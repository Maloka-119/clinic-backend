Clinic.hasMany(User, { foreignKey: 'clinicId' });
User.belongsTo(Clinic, { foreignKey: 'clinicId' });

Clinic.hasMany(Patient, { foreignKey: 'clinicId' });
Patient.belongsTo(Clinic, { foreignKey: 'clinicId' });

Patient.hasOne(HusbandInfo, { foreignKey: 'patientId' });
HusbandInfo.belongsTo(Patient, { foreignKey: 'patientId' });

Patient.hasMany(Visit, { foreignKey: 'patientId' });
Visit.belongsTo(Patient, { foreignKey: 'patientId' });

User.hasMany(Visit, { foreignKey: 'employeeId' });
Visit.belongsTo(User, { foreignKey: 'employeeId' });
Patient.hasOne(HusbandInfo, { foreignKey: 'patientId' });
HusbandInfo.belongsTo(Patient);

Patient.hasMany(DeliveryHistory, { foreignKey: 'patientId' });
DeliveryHistory.belongsTo(Patient);

Patient.hasMany(Visit, { foreignKey: 'patientId' });
Visit.belongsTo(Patient);

Visit.hasOne(GynecologyVisitDetails, { foreignKey: 'visitId' });
GynecologyVisitDetails.belongsTo(Visit);