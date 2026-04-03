const { User, Clinic, ClinicBranch } = require('../models');
const bcrypt = require('bcrypt');

/** POST /clinic/employees - create employee */
exports.createEmployee = async (req, res) => {
    try {
        const { name, email, password, clinicId, clinicBranchId } = req.body;
        if (!email || !password || !clinicId) return res.status(400).json({ message: 'email, password and clinicId are required' });
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: 'Email already exists' });
        const hashed = await bcrypt.hash(password, 10);
        const employee = await User.create({
            name: name || email,
            email,
            password: hashed,
            role: 'EMPLOYEE',
            clinicId,
            clinicBranchId: clinicBranchId || null,
            isActive: true
        });
        const { password: _, ...safe } = employee.toJSON();
        return res.status(201).json(safe);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** PATCH /clinic/employees/:id/toggle - activate/deactivate employee */
exports.toggleEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'ADMIN') return res.status(403).json({ message: 'Cannot deactivate Admin' });
        user.isActive = !user.isActive;
        await user.save();
        const { password: _, ...safe } = user.toJSON();
        return res.json({ message: user.isActive ? 'Employee activated' : 'Employee deactivated', user: safe });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/** GET /clinic/employees - list all employees (optionally for a clinic: ?clinicId=) */
exports.listEmployees = async (req, res) => {
    try {
        const clinicId = req.query.clinicId || req.user?.clinicId;
        const where = { role: ['OWNER', 'EMPLOYEE'] };
        if (clinicId) where.clinicId = clinicId;
        const users = await User.findAll({
            where,
            attributes: { exclude: ['password'] },
            include: [{ model: Clinic, as: 'Clinic', attributes: ['id', 'name'] }, { model: ClinicBranch, as: 'ClinicBranch', attributes: ['id', 'name'] }],
            order: [['id', 'ASC']]
        });
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
