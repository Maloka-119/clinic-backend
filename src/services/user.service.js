const { User, Clinic } = require('../models');
const bcrypt = require('bcryptjs');

/**
 * USER SERVICE
 * Handles user management operations for Admin and ClinicOwner
 */

/**
 * List all pending users (Admin only)
 */
async function listPendingUsers() {
    const users = await User.findAll({
        where: { status: 'Pending' },
        include: [{ association: 'clinic', attributes: ['id', 'clinicId', 'name'] }],
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
    });
    return users;
}

/**
 * List users by clinic (ClinicOwner can see their own clinic users)
 */
async function listUsersByClinic(clinicId, requestingUser) {
    // Authorization check
    if (requestingUser.role === 'ClinicOwner' && requestingUser.clinicId !== clinicId) {
        throw new Error('FORBIDDEN_CLINIC');
    }

    const clinic = await Clinic.findByPk(clinicId);
    if (!clinic) {
        throw new Error('CLINIC_NOT_FOUND');
    }

    const users = await User.findAll({
        where: { clinicId },
        include: [{ association: 'clinic', attributes: ['id', 'clinicId', 'name'] }],
        attributes: { exclude: ['password'] },
        order: [['name', 'ASC']]
    });
    return users;
}

/**
 * List all users (Admin only)
 */
async function listAllUsers() {
    const users = await User.findAll({
        include: [{ association: 'clinic', attributes: ['id', 'clinicId', 'name'] }],
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
    });
    return users;
}

/**
 * Approve user (change status from Pending to Active)
 * Admin can approve any user
 * ClinicOwner can only approve users in their clinic
 */
async function approveUser(userId, requestingUser) {
    const user = await User.findByPk(userId, {
        include: [{ association: 'clinic', required: false }]
    });

    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    if (user.status !== 'Pending') {
        throw new Error('USER_ALREADY_PROCESSED');
    }

    // Authorization check
    if (requestingUser.role === 'ClinicOwner') {
        if (user.clinicId !== requestingUser.clinicId) {
            throw new Error('FORBIDDEN_CLINIC');
        }
    } else if (requestingUser.role !== 'Admin') {
        throw new Error('FORBIDDEN_ROLE');
    }

    await user.update({ status: 'Active' });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        role: user.role
    };
}

/**
 * Reject user (change status from Pending to Inactive)
 */
async function rejectUser(userId, requestingUser) {
    const user = await User.findByPk(userId, {
        include: [{ association: 'clinic', required: false }]
    });

    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    if (user.status !== 'Pending') {
        throw new Error('USER_ALREADY_PROCESSED');
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

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        role: user.role
    };
}

/**
 * Set user active/inactive status
 * Only for already processed (Active/Inactive) users
 */
async function setUserActive(userId, isActive, requestingUser) {
    const user = await User.findByPk(userId, {
        include: [{ association: 'clinic', required: false }]
    });

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

    const newStatus = isActive ? 'Active' : 'Inactive';
    await user.update({ status: newStatus });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        role: user.role
    };
}

/**
 * Update user profile
 */
async function updateUserProfile(userId, updateData, requestingUser) {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    // Users can only update their own profile (or Admin can update anyone)
    if (requestingUser.role !== 'Admin' && requestingUser.id !== userId) {
        throw new Error('FORBIDDEN_USER');
    }

    // Fields that can be updated
    const allowedFields = ['name', 'phone', 'specialty'];
    const sanitizedData = {};

    for (const field of allowedFields) {
        if (field in updateData) {
            sanitizedData[field] = updateData[field];
        }
    }

    // If password is being updated
    if (updateData.password) {
        // Users must provide current password for verification
        if (updateData.currentPassword) {
            const passwordMatch = await bcrypt.compare(updateData.currentPassword, user.password);
            if (!passwordMatch) {
                throw new Error('INVALID_CURRENT_PASSWORD');
            }
        }

        const hashedPassword = await bcrypt.hash(updateData.password, 10);
        sanitizedData.password = hashedPassword;
    }

    await user.update(sanitizedData);

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        specialty: user.specialty,
        role: user.role,
        status: user.status
    };
}

module.exports = {
    listPendingUsers,
    listUsersByClinic,
    listAllUsers,
    approveUser,
    rejectUser,
    setUserActive,
    updateUserProfile
};
