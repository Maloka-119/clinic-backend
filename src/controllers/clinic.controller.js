const { Clinic, User, ClinicBranch } = require('../models');
const bcrypt = require('bcrypt');

/** helper بدل toBoolean عشان نضمن consistency */
const normalizeBoolean = (value) => {
    return value === true || value === 1 || value === '1';
};

/** POST /clinic/clinics - create clinic with owner */
exports.createClinic = async (req, res) => {
    try {
        const { name, type, ownerName, ownerEmail, ownerPassword } = req.body;

        if (!name || !type || !ownerEmail || !ownerPassword) {
            return res.status(400).json({
                message: 'name, type, ownerEmail and ownerPassword are required'
            });
        }

        // check email exists
        const existing = await User.findOne({ where: { email: ownerEmail } });
        if (existing) {
            return res.status(400).json({ message: 'Owner email already exists' });
        }

        // create clinic
        const clinic = await Clinic.create({
            name,
            type,
            isActive: false // 👈 تبدأ inactive لحد ما الأدمن يفعّلها
        });

        // hash password
        const hashed = await bcrypt.hash(ownerPassword, 10);

        // create owner (ACTIVE)
        await User.create({
            name: ownerName || 'Clinic Owner',
            email: ownerEmail,
            password: hashed,
            role: 'OWNER',
            clinicId: clinic.id,
            isActive: false
        });

        return res.status(201).json({
            message: 'Clinic created successfully. Activate the clinic to allow login.',
            clinic: {
                id: clinic.id,
                name: clinic.name,
                type: clinic.type,
                isActive: normalizeBoolean(clinic.isActive)
            }
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** GET /clinic/clinics - list all clinics */
exports.listClinics = async (req, res) => {
    try {
        const clinics = await Clinic.findAll({
            order: [['id', 'ASC']],
            attributes: ['id', 'name', 'type', 'isActive', 'createdAt', 'updatedAt']
        });

        const result = clinics.map((c) => {
            const row = c.get ? c.get({ plain: true }) : c;

            return {
                ...row,
                isActive: normalizeBoolean(row.isActive)
            };
        });

        return res.json(result);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** PATCH /clinic/clinics/:id/toggle */
exports.toggleClinic = async (req, res) => {
    try {
        const { id } = req.params;

        const clinic = await Clinic.findByPk(id);
        if (!clinic) {
            return res.status(404).json({ message: 'Clinic not found' });
        }

        // normalize current value
        const current = normalizeBoolean(clinic.isActive);

        // toggle
        const next = !current;

        await clinic.update({ isActive: next });

        // reload from DB
        await clinic.reload();

        const plain = clinic.get ? clinic.get({ plain: true }) : clinic;

        const payload = {
            ...plain,
            isActive: normalizeBoolean(plain.isActive)
        };

        return res.json({
            message: payload.isActive ? 'Clinic activated' : 'Clinic deactivated',
            clinic: payload
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};