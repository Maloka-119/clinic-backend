const { ClinicBranch, Clinic } = require('../models');

/** POST /clinic/branches - add branch to a clinic */
exports.createBranch = async (req, res) => {
    try {
        const { clinicId, name, address } = req.body;
        if (!clinicId || !name) return res.status(400).json({ message: 'clinicId and name are required' });
        const branch = await ClinicBranch.create({ clinicId, name, address: address || null, isActive: true });
        return res.status(201).json(branch);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** GET /clinic/branches/:clinicId - get branches of a clinic */
exports.getBranchesByClinic = async (req, res) => {
    try {
        const { clinicId } = req.params;
        const branches = await ClinicBranch.findAll({ where: { clinicId }, order: [['id', 'ASC']] });
        return res.json(branches);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
