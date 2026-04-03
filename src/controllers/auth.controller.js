const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Clinic } = require('../models');
const toBoolean = require('../utils/toBoolean');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // ✅ Get user with clinic
        const user = await User.findOne({
            where: { email },
            include: [Clinic]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ✅ Normalize booleans manually (بدون الاعتماد على toBoolean)
        const userActive =
            user.isActive === true ||
            user.isActive === 1 ||
            user.isActive === '1';

        const clinicActive =
            user.Clinic?.isActive === true ||
            user.Clinic?.isActive === 1 ||
            user.Clinic?.isActive === '1';

        // ✅ Debug logs
        console.log({
            userActiveRaw: user.isActive,
            clinicActiveRaw: user.Clinic?.isActive,
            userActive,
            clinicActive
        });

        // ✅ Activation logic
        if (user.role !== 'ADMIN') {
            if (!userActive) {
                return res.status(403).json({ message: 'User inactive' });
            }

            if (!user.Clinic) {
                return res.status(403).json({ message: 'Clinic not assigned' });
            }

            if (!clinicActive) {
                return res.status(403).json({ message: 'Clinic inactive' });
            }
        } else {
            if (!userActive) {
                return res.status(403).json({ message: 'Admin inactive' });
            }
        }

        // ✅ Check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Wrong password' });
        }

        // ✅ Generate token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                clinicId: user.clinicId,
                clinicBranchId: user.clinicBranchId || null
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // ✅ Remove password
        const { password: _, ...safeUser } = user.toJSON();

        return res.json({ token, user: safeUser });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/** POST /auth/change-password - change password (old + new), session intact */
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'oldPassword and newPassword are required' });
        }
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();
        return res.json({ message: 'Password updated successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};