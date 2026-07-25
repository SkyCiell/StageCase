const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BookingDetail = sequelize.define('BookingDetail', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  booking_id: { type: DataTypes.UUID, allowNull: false },
  ticket_category_id: { type: DataTypes.UUID, allowNull: false },
  seat_id: { type: DataTypes.UUID, allowNull: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  qr_code: { type: DataTypes.TEXT, allowNull: true },
  qr_code_data: { type: DataTypes.STRING(255), allowNull: true },
  holder_name: { type: DataTypes.STRING(150), allowNull: true },
}, { tableName: 'booking_details' });

module.exports = BookingDetail;
