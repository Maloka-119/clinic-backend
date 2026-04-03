const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

const clinicController = require('../controllers/clinic.controller');
const branchController = require('../controllers/branch.controller');
const employeeController = require('../controllers/employee.controller');
const patientController = require('../controllers/patient.controller');
const visitController = require('../controllers/visit.controller');
const previousDeliveryController = require('../controllers/previousDelivery.controller');

// Clinics (Admin only for create/toggle; list can be for auth users)
router.post('/clinics', auth, role('ADMIN'), clinicController.createClinic);
router.get('/clinics', auth, clinicController.listClinics);
router.patch('/clinics/:id/toggle', auth, role('ADMIN'), clinicController.toggleClinic);

// Branches
router.post('/branches', auth, role('ADMIN', 'OWNER'), branchController.createBranch);
router.get('/branches/:clinicId', auth, branchController.getBranchesByClinic);

// Employees
router.post('/employees', auth, role('ADMIN', 'OWNER'), employeeController.createEmployee);
router.patch('/employees/:id/toggle', auth, role('ADMIN', 'OWNER'), employeeController.toggleEmployee);
router.get('/employees', auth, role('ADMIN', 'OWNER', 'EMPLOYEE'), employeeController.listEmployees);

// Patients (list by clinic, CRUD)
router.post('/patients', auth, role('ADMIN', 'OWNER', 'EMPLOYEE'), patientController.createPatient);
router.get('/patients/detail/:id', auth, patientController.getOne);
router.get('/patients/:clinicId', auth, patientController.listByClinic);
router.put('/patients/:id', auth, role('ADMIN', 'OWNER', 'EMPLOYEE'), patientController.updatePatient);
router.delete('/patients/:id', auth, role('ADMIN', 'OWNER', 'EMPLOYEE'), patientController.deletePatient);

// Visits
router.post('/visits', auth, role('ADMIN', 'OWNER', 'EMPLOYEE'), visitController.createVisit);
router.get('/visits/:branchId', auth, visitController.listByBranch);

// Previous Deliveries (per patient)
router.get('/previous-deliveries/patient/:patientId', auth, previousDeliveryController.listByPatient);
router.post('/previous-deliveries', auth, role('ADMIN', 'OWNER', 'EMPLOYEE'), previousDeliveryController.create);
router.get('/previous-deliveries/:id', auth, previousDeliveryController.getOne);
router.put('/previous-deliveries/:id', auth, role('ADMIN', 'OWNER', 'EMPLOYEE'), previousDeliveryController.update);
router.delete('/previous-deliveries/:id', auth, role('ADMIN', 'OWNER', 'EMPLOYEE'), previousDeliveryController.remove);

module.exports = router;
