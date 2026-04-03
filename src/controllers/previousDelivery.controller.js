const { PreviousDelivery, Patient, User } = require('../models');

/** GET /clinic/patients/:patientId/previous-deliveries - list previous deliveries for a patient */
exports.listByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const list = await PreviousDelivery.findAll({
            where: { patientId },
            include: [{ model: User, as: 'Creator', attributes: ['id', 'name', 'email'] }],
            order: [['dateOfEntry', 'DESC'], ['id', 'DESC']]
        });
        return res.json(list);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** POST /clinic/previous-deliveries - create (creator and dateOfEntry set server-side) */
exports.create = async (req, res) => {
    try {
        const { patientId, deliveryDate, deliveryType, babyGender, babyWeightAtBirth, complications } = req.body;
        if (!patientId) return res.status(400).json({ message: 'patientId is required' });
        const today = new Date().toISOString().slice(0, 10);
        const created = await PreviousDelivery.create({
            patientId: Number(patientId),
            deliveryDate: deliveryDate || null,
            deliveryType: deliveryType || null,
            babyGender: babyGender || null,
            babyWeightAtBirth: babyWeightAtBirth || null,
            complications: complications || null,
            createdBy: req.user?.id || null,
            dateOfEntry: req.body.dateOfEntry || today
        });
        const withCreator = await PreviousDelivery.findByPk(created.id, {
            include: [{ model: User, as: 'Creator', attributes: ['id', 'name', 'email'] }]
        });
        return res.status(201).json(withCreator || created);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** GET /clinic/previous-deliveries/:id - get one */
exports.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await PreviousDelivery.findByPk(id, {
            include: [
                { model: Patient, attributes: ['id', 'name'] },
                { model: User, as: 'Creator', attributes: ['id', 'name', 'email'] }
            ]
        });
        if (!record) return res.status(404).json({ message: 'Previous delivery not found' });
        return res.json(record);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** PUT /clinic/previous-deliveries/:id - update */
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await PreviousDelivery.findByPk(id);
        if (!record) return res.status(404).json({ message: 'Previous delivery not found' });
        const { deliveryDate, deliveryType, babyGender, babyWeightAtBirth, complications } = req.body;
        if (deliveryDate !== undefined) record.deliveryDate = deliveryDate;
        if (deliveryType !== undefined) record.deliveryType = deliveryType;
        if (babyGender !== undefined) record.babyGender = babyGender;
        if (babyWeightAtBirth !== undefined) record.babyWeightAtBirth = babyWeightAtBirth;
        if (complications !== undefined) record.complications = complications;
        await record.save();
        return res.json(record);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** DELETE /clinic/previous-deliveries/:id */
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        const n = await PreviousDelivery.destroy({ where: { id } });
        if (n === 0) return res.status(404).json({ message: 'Previous delivery not found' });
        return res.json({ message: 'Deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
