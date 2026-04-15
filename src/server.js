// src/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const sequelize = require("./config/db");

// Routes
const authRoutes = require("./routes/auth.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const clinicRoutes = require("./routes/clinic.routes.js");

// Models
const { User } = require("./models");

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL || "*"
}));

// Test route (مهم جدًا للـ deployment)
app.get("/", (req, res) => {
    res.send("Clinic API is running 🚀");
});

// Routes
app.use("/clinic/auth", authRoutes);
app.use("/clinic/admin", adminRoutes);
app.use("/clinic", clinicRoutes);

const PORT = process.env.PORT || 3000;

// 🔥 تشغيل السيرفر حتى لو DB وقع (مهم جدًا في production)
const startServer = async () => {
    try {
        console.log("Starting server...");

        // محاولة الاتصال بالداتابيز
        if (sequelize) {
            await sequelize.authenticate();
            console.log("Database connected successfully");

            await sequelize.sync();
            console.log("Database synchronized");

            // Super Admin
            const exists = await User.findOne({ where: { role: 'ADMIN' } });

            if (!exists) {
                await User.create({
                    name: 'Super Admin',
                    email: 'malakmhemdan@gmail.com',
                    password: await bcrypt.hash('femina123', 10),
                    role: 'ADMIN',
                    isActive: true
                });

                console.log("Super Admin created successfully");
            }
        }

        // تشغيل السيرفر مهما حصل في DB
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("DB Error (server still running):", err);

        // 🔥 مهم: السيرفر يفضل شغال حتى لو DB وقع
        app.listen(PORT, () => {
            console.log(`Server running WITHOUT DB on port ${PORT}`);
        });
    }
};

startServer();