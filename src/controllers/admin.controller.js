const { Clinic, User } = require('../models');
const bcrypt = require('bcrypt');


exports.createClinic = async (req, res) => {
    try {
        const { name, type, ownerName, ownerEmail, ownerPassword } = req.body;

        // 1️⃣ إنشاء الكلينك
        const clinic = await Clinic.create({ name, type });

        // 2️⃣ إنشاء Owner مرتبط بالكلينك
        const hashedPassword = await bcrypt.hash(ownerPassword, 10);

        const owner = await User.create({
            name: ownerName,
            email: ownerEmail,
            password: hashedPassword,
            role: 'OWNER',
            clinicId: clinic.id,
            isActive: true
        });

        res.status(201).json({
            message: 'Clinic created successfully',
            clinic: {
                clinicId: clinic.id,
                name: clinic.name,
                owner: {
                    id: owner.id,
                    name: owner.name,
                    email: owner.email,
                    isActive: owner.isActive
                }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.getAllClinics = async (req, res) => {
    const clinics = await Clinic.findAll({
        include: {
            model: User,
            where: { role: 'OWNER' },
            required: false
        }
    });

    res.json(clinics);
};

exports.activateOwner = async (req, res) => {
    const { ownerId, clinicId } = req.body;

    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== 'OWNER')
        return res.status(404).json({ message: 'Owner not found' });

    owner.isActive = true;
    owner.clinicId = clinicId;

    await owner.save();

    res.json({ message: 'Owner activated' });
};

exports.deactivateClinic = async (req, res) => {
    const { clinicId } = req.params;

    await Clinic.update({ isActive: false }, { where: { id: clinicId } });

    res.json({ message: 'Clinic deactivated' });
};

exports.deleteClinic = async (req, res) => {
    const { clinicId } = req.params;

    await Clinic.destroy({ where: { id: clinicId } });

    res.json({ message: 'Clinic deleted' });
};