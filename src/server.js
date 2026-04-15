// src/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs'); 
const sequelize = require("./config/db");

// استدعاء الراوتس
const authRoutes = require("./routes/auth.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const clinicRoutes = require("./routes/clinic.routes.js");

// استدعاء المودلز
const { User } = require("./models");

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL
}));

// Routes
app.use("/clinic/auth", authRoutes);
app.use("/clinic/admin", adminRoutes);
app.use("/clinic", clinicRoutes);

// Test route
app.get("/", (req, res) => res.send("Clinic API is running"));

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");

        await sequelize.sync();
        console.log("Database synchronized");

        // ===== إضافة Super Admin إذا مش موجود =====
        const exists = await User.findOne({ where: { role: 'ADMIN' } });
        if (!exists) {
            await User.create({
                name: 'Super Admin',
                email: 'malakmhemdan@gmail.com',
                password: await bcrypt.hash('clinicmanage123#', 10),
                role: 'ADMIN',
                isActive: true
            });
            console.log("Super Admin created successfully");
        } else {
            console.log("Super Admin already exists");
        }

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("Error starting server:", err);
    }
})();