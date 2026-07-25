const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Favorite = sequelize.define('Favorite', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  concert_id: { type: DataTypes.UUID, allowNull: false },
}, {
  tableName: 'favorites',
  indexes: [{ unique: true, fields: ['user_id', 'concert_id'] }],
});

module.exports = Favorite;
