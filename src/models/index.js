const sequelize = require('../config/db');

const Clinic = require('./Clinic');
const ClinicBranch = require('./ClinicBranch');
const User = require('./User');
const Patient = require('./Patient');
const Visit = require('./Visit');
const HusbandInfo = require('./HusbandInfo');
const DeliveryHistory = require('./DeliveryHistory');
const PreviousDelivery = require('./PreviousDelivery');
const GynecologyVisitDetails = require('./GynecologyVisitDetails');

// Clinic <-> ClinicBranch
Clinic.hasMany(ClinicBranch, { foreignKey: 'clinicId' });
ClinicBranch.belongsTo(Clinic, { foreignKey: 'clinicId' });

// Clinic <-> User (owners, admins, employees)
Clinic.hasMany(User, { foreignKey: 'clinicId' });
User.belongsTo(Clinic, { foreignKey: 'clinicId' });

// ClinicBranch <-> User (employees at branch)
ClinicBranch.hasMany(User, { foreignKey: 'clinicBranchId' });
User.belongsTo(ClinicBranch, { foreignKey: 'clinicBranchId' });

// Clinic <-> Patient
Clinic.hasMany(Patient, { foreignKey: 'clinicId' });
Patient.belongsTo(Clinic, { foreignKey: 'clinicId' });

// Patient <-> Visit
Patient.hasMany(Visit, { foreignKey: 'patientId' });
Visit.belongsTo(Patient, { foreignKey: 'patientId' });

// ClinicBranch <-> Visit
ClinicBranch.hasMany(Visit, { foreignKey: 'clinicBranchId' });
Visit.belongsTo(ClinicBranch, { foreignKey: 'clinicBranchId' });

// User (employee) <-> Visit
User.hasMany(Visit, { foreignKey: 'employeeId' });
Visit.belongsTo(User, { foreignKey: 'employeeId' });

// Patient <-> HusbandInfo (optional one-to-one)
Patient.hasOne(HusbandInfo, { foreignKey: 'patientId' });
HusbandInfo.belongsTo(Patient, { foreignKey: 'patientId' });

// Patient <-> DeliveryHistory
Patient.hasMany(DeliveryHistory, { foreignKey: 'patientId' });
DeliveryHistory.belongsTo(Patient, { foreignKey: 'patientId' });

// Patient <-> PreviousDeliveries (one-to-many)
Patient.hasMany(PreviousDelivery, { foreignKey: 'patientId' });
PreviousDelivery.belongsTo(Patient, { foreignKey: 'patientId' });
// Creator (User) <-> PreviousDelivery
User.hasMany(PreviousDelivery, { foreignKey: 'createdBy' });
PreviousDelivery.belongsTo(User, { foreignKey: 'createdBy', as: 'Creator' });

// Visit <-> GynecologyVisitDetails
Visit.hasOne(GynecologyVisitDetails, { foreignKey: 'visitId' });
GynecologyVisitDetails.belongsTo(Visit, { foreignKey: 'visitId' });

module.exports = {
    sequelize,
    Clinic,
    ClinicBranch,
    User,
    Patient,
    Visit,
    HusbandInfo,
    DeliveryHistory,
    PreviousDelivery,
    GynecologyVisitDetails
};
