const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  booking_id: { type: DataTypes.UUID, allowNull: false },
  method: { type: DataTypes.STRING(100), allowNull: true }, // BCA, Mandiri, GoPay, etc.
  proof_image: { type: DataTypes.STRING(255), allowNull: true },
  amount: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  status: { type: DataTypes.ENUM('pending', 'submitted', 'approved', 'rejected'), defaultValue: 'pending' },
  verified_at: { type: DataTypes.DATE, allowNull: true },
  verified_by: { type: DataTypes.UUID, allowNull: true },
  rejection_reason: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'payments' });

module.exports = Payment;
