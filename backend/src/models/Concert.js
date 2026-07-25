const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Concert = sequelize.define('Concert', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  venue_id: { type: DataTypes.UUID, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.TIME, allowNull: false },
  doors_open: { type: DataTypes.TIME, allowNull: true },
  poster: { type: DataTypes.STRING(255), allowNull: true },
  banner: { type: DataTypes.STRING(255), allowNull: true },
  status: { type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'), defaultValue: 'upcoming' },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_trending: { type: DataTypes.BOOLEAN, defaultValue: false },
  artist_name: { type: DataTypes.STRING(255), defaultValue: 'Crayon Case' },
  artist_bio: { type: DataTypes.TEXT, allowNull: true },
  total_sold: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'concerts' });

module.exports = Concert;
