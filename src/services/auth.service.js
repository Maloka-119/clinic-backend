const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Clinic } = require('../models');

const JWT_EXPIRES = '7d';

/**
 * AUTHENTICATION SERVICE
 * Handles user authentication, registration, and JWT token management
 */

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return secret;
}

function sanitizeUser(user) {
    if (!user) return null;
    const userData = user.get ? user.get({ plain: true }) : { ...user };
    delete userData.password;
    return userData;
}

/**
 * REGISTER: Create a new user (status: Pending)
 * User cannot login until Admin or ClinicOwner activates them
 */
async function register({ name, email, password, clinicId: publicClinicId, role = 'Doctor' }) {
    // Validate clinic exists and is active
    const clinic = await Clinic.findOne({
        where: { clinicId: publicClinicId, status: 'Active' }
    });
    if (!clinic) {
        throw new Error('CLINIC_NOT_FOUND');
    }

    // Check if email already exists
    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
        throw new Error('EMAIL_EXISTS');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with Pending status (cannot login)
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        status: 'Pending', // Must be activated by Admin or ClinicOwner
        clinicId: clinic.id
    });

    return sanitizeUser(user);
}

/**
 * LOGIN: Authenticate user
 * Requirements:
 * - User exists
 * - Password matches
 * - User status is 'Active'
 * - Clinic is active (if doctor/clinic owner)
 */
async function login({ email, password, clinicId: requestedClinicId }) {
    const user = await User.findOne({
        where: { email: email.toLowerCase() },
        include: [{ association: 'clinic', required: false }]
    });

    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error('INVALID_CREDENTIALS');
    }

    // Check if user is active
    if (user.status !== 'Active') {
        if (user.status === 'Pending') {
            throw new Error('PENDING_APPROVAL');
        }
        throw new Error('ACCOUNT_INACTIVE');
    }

    // For non-Admin users: verify clinic
    if (user.role !== 'Admin') {
        if (!user.clinic || user.clinic.status !== 'Active') {
            throw new Error('CLINIC_ACCESS_SUSPENDED');
        }

        // If clinicId provided in login, verify it matches
        if (requestedClinicId) {
            if (user.clinic.clinicId !== requestedClinicId) {
                throw new Error('CLINIC_MISMATCH');
            }
        }
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate JWT token
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            clinicId: user.clinicId
        },
        getJwtSecret(),
        { expiresIn: JWT_EXPIRES }
    );

    return {
        token,
        user: sanitizeUser(user)
    };
}

/**
 * VERIFY TOKEN: Decode and validate JWT
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, getJwtSecret());
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new Error('TOKEN_EXPIRED');
        }
        throw new Error('INVALID_TOKEN');
    }
}

/**
 * GET USER WITH CLINIC: Fetch user with clinic association
 */
async function getUserWithClinic(userId) {
    const user = await User.findByPk(userId, {
        include: [{ association: 'clinic', required: false }],
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    return sanitizeUser(user);
}

/**
 * ACTIVATE USER: Admin or ClinicOwner can activate user
 * ClinicOwner can only activate users in their clinic
 */
async function activateUser(userId, requestingUser) {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    // Authorization check
    if (requestingUser.role === 'ClinicOwner') {
        // ClinicOwner can only activate users in their clinic
        if (user.clinicId !== requestingUser.clinicId) {
            throw new Error('FORBIDDEN_CLINIC');
        }
    } else if (requestingUser.role !== 'Admin') {
        throw new Error('FORBIDDEN_ROLE');
    }

    await user.update({ status: 'Active' });
    return sanitizeUser(user);
}

/**
 * DEACTIVATE USER: Admin or ClinicOwner can deactivate user
 */
async function deactivateUser(userId, requestingUser) {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    // Authorization check
    if (requestingUser.role === 'ClinicOwner') {
        if (user.clinicId !== requestingUser.clinicId) {
            throw new Error('FORBIDDEN_CLINIC');
        }
    } else if (requestingUser.role !== 'Admin') {
        throw new Error('FORBIDDEN_ROLE');
    }

    await user.update({ status: 'Inactive' });
    return sanitizeUser(user);
}

module.exports = {
    register,
    login,
    verifyToken,
    sanitizeUser,
    getJwtSecret,
    getUserWithClinic,
    activateUser,
    deactivateUser
};
