const { Patient, HusbandInfo, DeliveryHistory, PreviousDelivery, User } = require('../models');

/** POST /clinic/patients - create patient (clinicId in body or from user) */
exports.createPatient = async (req, res) => {
    try {
        const { name, age, gender, contactInfo, clinicId, title, bloodType, rhFactor, chronicIllnessesOrFamilyHistory } = req.body;
        const cId = clinicId || req.user?.clinicId;
        if (!name || !cId) return res.status(400).json({ message: 'name and clinicId are required' });
        const patient = await Patient.create({
            name,
            age: age || null,
            gender: gender || null,
            contactInfo: contactInfo || null,
            clinicId: cId,
            title: title || null,
            bloodType: bloodType || null,
            rhFactor: rhFactor || null,
            chronicIllnessesOrFamilyHistory: chronicIllnessesOrFamilyHistory || null
        });
        if (req.body.husband) {
            const h = req.body.husband;
            await HusbandInfo.create({
                patientId: patient.id,
                name: h.name,
                job: h.job || null,
                phone: h.phone || null,
                bloodType: h.bloodType || null,
                rhFactor: h.rhFactor || null,
                semenAnalysisResult: h.semenAnalysisResult || null,
                marriageDate: h.marriageDate || null,
                marriageDuration: h.marriageDuration || null
            });
        }
        return res.status(201).json(patient);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** GET /clinic/patients/:clinicId - list patients for a clinic */
exports.listByClinic = async (req, res) => {
    try {
        const { clinicId } = req.params;
        const patients = await Patient.findAll({
            where: { clinicId },
            include: [HusbandInfo, DeliveryHistory, PreviousDelivery],
            order: [['id', 'DESC']]
        });
        return res.json(patients);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** GET /clinic/patients/detail/:id - get one patient */
exports.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findByPk(id, {
            include: [
                HusbandInfo,
                DeliveryHistory,
                { model: PreviousDelivery, include: [{ model: User, as: 'Creator', attributes: ['id', 'name', 'email'] }] }
            ]
        });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        return res.json(patient);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** PUT /clinic/patients/:id - update patient */
exports.updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findByPk(id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        const { name, age, gender, contactInfo, title, bloodType, rhFactor, chronicIllnessesOrFamilyHistory } = req.body;
        if (name !== undefined) patient.name = name;
        if (age !== undefined) patient.age = age;
        if (gender !== undefined) patient.gender = gender;
        if (contactInfo !== undefined) patient.contactInfo = contactInfo;
        if (title !== undefined) patient.title = title;
        if (bloodType !== undefined) patient.bloodType = bloodType;
        if (rhFactor !== undefined) patient.rhFactor = rhFactor;
        if (chronicIllnessesOrFamilyHistory !== undefined) patient.chronicIllnessesOrFamilyHistory = chronicIllnessesOrFamilyHistory;
        await patient.save();
        return res.json(patient);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** DELETE /clinic/patients/:id */
exports.deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const n = await Patient.destroy({ where: { id } });
        if (n === 0) return res.status(404).json({ message: 'Patient not found' });
        return res.json({ message: 'Patient deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
