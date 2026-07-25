const { Op } = require('sequelize');
const { Venue } = require('../models');
const { success, error, paginated } = require('../helpers/response');
const { getPagination, getPagingData } = require('../helpers/pagination');

const getVenues = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, city } = req.query;
    const { offset, limit: l, page: p } = getPagination(page, limit);
    const where = {};
    if (city) where.city = { [Op.like]: `%${city}%` };
    const data = await Venue.findAndCountAll({ where, order: [['name', 'ASC']], limit: l, offset });
    const { rows, pagination } = getPagingData(data, p, l);
    return paginated(res, rows, pagination);
  } catch (err) { next(err); }
};

const getVenueById = async (req, res, next) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) return error(res, 'Venue not found', 404);
    return success(res, venue);
  } catch (err) { next(err); }
};

const createVenue = async (req, res, next) => {
  try {
    const image = req.file ? req.file.filename : null;
    const venue = await Venue.create({ ...req.body, image });
    return success(res, venue, 'Venue created', 201);
  } catch (err) { next(err); }
};

const updateVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) return error(res, 'Venue not found', 404);
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.filename;
    await venue.update(updates);
    return success(res, venue, 'Venue updated');
  } catch (err) { next(err); }
};

const deleteVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) return error(res, 'Venue not found', 404);
    await venue.destroy();
    return success(res, null, 'Venue deleted');
  } catch (err) { next(err); }
};

module.exports = { getVenues, getVenueById, createVenue, updateVenue, deleteVenue };
