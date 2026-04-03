// services/clinic.service.js

const { Clinic, User } = require('../models');

class ClinicService {

    static async createClinic(data) {
        const clinic = await Clinic.create({
            name: data.name,
            type: data.type
        });

        return clinic;
    }

    static async getAllClinics() {
        return await Clinic.findAll({
            include: {
                model: User,
                where: { role: 'OWNER' },
                required: false
            }
        });
    }

    static async activateOwner(ownerId, clinicId) {
        const owner = await User.findByPk(ownerId);

        if (!owner || owner.role !== 'OWNER') {
            throw new Error('Owner not found');
        }

        owner.isActive = true;
        owner.clinicId = clinicId;

        await owner.save();

        return owner;
    }

    static async deactivateClinic(clinicId) {

        await Clinic.update(
            { isActive: false },
            { where: { id: clinicId } }
        );

        return true;
    }

    static async deleteClinic(clinicId) {
        await Clinic.destroy({ where: { id: clinicId } });
        return true;
    }
}

module.exports = ClinicService;