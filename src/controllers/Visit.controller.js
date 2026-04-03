const { Visit, Patient, ClinicBranch, User, GynecologyVisitDetails } = require('../models');

/** POST /clinic/visits - register a visit (link to branch, patient, employee) */
exports.createVisit = async (req, res) => {
    try {
        const {
            patientId, clinicBranchId, employeeId, date, notes, type, reason,
            bloodSugar, bloodPressure, babyWeight, babyAgeWeeks, requiredTests, previousTestResults,
            pregnancyWeek
        } = req.body;
        const empId = employeeId || req.user?.id;
        if (!patientId || !clinicBranchId || !date) {
            return res.status(400).json({ message: 'patientId, clinicBranchId and date are required' });
        }
        const visit = await Visit.create({
            patientId,
            clinicBranchId,
            employeeId: empId,
            date,
            notes: notes || null,
            type: type || null,
            reason: reason || null,
            bloodSugar: bloodSugar || null,
            bloodPressure: bloodPressure || null,
            babyWeight: babyWeight != null ? String(babyWeight) : null,
            babyAgeWeeks: babyAgeWeeks != null && babyAgeWeeks !== '' ? Number(babyAgeWeeks) : null,
            requiredTests: requiredTests || null,
            previousTestResults: previousTestResults || null
        });
        const isPregnancyFollowUp = reason === 'Pregnancy follow-up' || reason === 'Pregnancy Follow-up';
        if (isPregnancyFollowUp && (babyWeight != null || pregnancyWeek != null || bloodPressure != null || bloodSugar != null)) {
            await GynecologyVisitDetails.create({
                visitId: visit.id,
                bloodPressure: bloodPressure || null,
                bloodSugar: bloodSugar || null,
                pregnancyWeek: pregnancyWeek != null ? Number(pregnancyWeek) : null,
                babyWeight: babyWeight != null ? String(babyWeight) : null,
                visitType: 'Pregnancy Follow-up'
            });
        }
        const withAssocs = await Visit.findByPk(visit.id, {
            include: [
                Patient,
                ClinicBranch,
                { model: User, attributes: ['id', 'name', 'email'] },
                GynecologyVisitDetails
            ]
        });
        return res.status(201).json(withAssocs || visit);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** GET /clinic/visits/:branchId - list visits for a branch */
exports.listByBranch = async (req, res) => {
    try {
        const { branchId } = req.params;
        const visits = await Visit.findAll({
            where: { clinicBranchId: branchId },
            include: [
                Patient,
                ClinicBranch,
                { model: User, attributes: ['id', 'name', 'email'] },
                GynecologyVisitDetails
            ],
            order: [['date', 'DESC'], ['id', 'DESC']]
        });
        return res.json(visits);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
