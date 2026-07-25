const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Seat = sequelize.define('Seat', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  concert_id: { type: DataTypes.UUID, allowNull: false },
  category_id: { type: DataTypes.UUID, allowNull: false },
  row: { type: DataTypes.STRING(5), allowNull: false },
  number: { type: DataTypes.INTEGER, allowNull: false },
  label: { type: DataTypes.STRING(20), allowNull: true }, // e.g. A1, B12
  status: { type: DataTypes.ENUM('available', 'reserved', 'booked'), defaultValue: 'available' },
}, { tableName: 'seats' });

module.exports = Seat;
