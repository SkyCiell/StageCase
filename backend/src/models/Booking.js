const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  concert_id: { type: DataTypes.UUID, allowNull: false },
  booking_code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  total_price: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'waiting_payment', 'payment_review', 'confirmed', 'cancelled', 'expired', 'rejected'),
    defaultValue: 'pending',
  },
  expired_at: { type: DataTypes.DATE, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'bookings' });

module.exports = Booking;
