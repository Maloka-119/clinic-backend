// src/config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },

  // مهم جدًا لحل مشاكل Railway + Supabase
  protocol: "postgres",
  native: false,
});

module.exports = sequelize;