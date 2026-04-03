// src/routes/clinicBranch.routes.js
const express = require('express');
const router = express.Router();
const { ClinicBranch, Visit } = require('../models');

// إضافة فرع جديد
router.post('/', async (req, res) => {
    const { name, address, clinicId } = req.body;
    try {
        const branch = await ClinicBranch.create({ name, address, clinicId });
        res.status(201).json(branch);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ربط زيارة بالفرع
router.post('/visit', async (req, res) => {
    const { clinicBranchId, date, notes } = req.body;
    try {
        const visit = await Visit.create({ clinicBranchId, date, notes });
        res.status(201).json(visit);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;