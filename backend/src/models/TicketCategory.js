const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TicketCategory = sequelize.define('TicketCategory', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  concert_id: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false }, // VIP, VVIP, Festival, Tribune
  price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  quota: { type: DataTypes.INTEGER, allowNull: false },
  available: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  color: { type: DataTypes.STRING(20), defaultValue: '#2D6F73' },
  benefits: { type: DataTypes.JSON, allowNull: true },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'ticket_categories' });

module.exports = TicketCategory;
