const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const { Venue, Concert, Favorite, Booking, BookingDetail, Payment, Seat, TicketCategory } = require('../models');
const { success, error, paginated } = require('../helpers/response');
const { getPagination, getPagingData } = require('../helpers/pagination');

const getVenues = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, city } = req.query;
    const { offset, limit: l, page: p } = getPagination(page, limit);
    const where = {};
    if (city) where.city = { [Op.like]: `%${city}%` };
    const data = await Venue.findAndCountAll({
      where,
      include: [
        {
          model: Concert,
          as: 'concerts',
          attributes: ['id', 'title', 'artist_name', 'date', 'status'],
        },
      ],
      order: [['name', 'ASC']],
      distinct: true,
      limit: l,
      offset,
    });
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
    const { name, city, province, address, capacity, artist_name } = req.body;
    const image = req.file ? req.file.filename : null;
    const venue = await Venue.create({ name, city, province, address, capacity, image });

    if (artist_name && artist_name.trim() !== '') {
      const cleanArtist = artist_name.trim();
      const title = `${cleanArtist} Live at ${name}`;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
      await Concert.create({
        title,
        slug,
        artist_name: cleanArtist,
        artist_bio: `Live concert performance by ${cleanArtist} at ${name}.`,
        venue_id: venue.id,
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: '19:00:00',
        doors_open: '17:00:00',
        status: 'upcoming',
        is_featured: true,
        is_trending: true,
      });
    }

    return success(res, venue, 'Venue created successfully', 201);
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
  const t = await sequelize.transaction();
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) {
      await t.rollback();
      return error(res, 'Venue not found', 404);
    }
    
    // Clean up linked concerts and their dependent records
    const concerts = await Concert.findAll({ where: { venue_id: venue.id } });
    for (const concert of concerts) {
      await Favorite.destroy({ where: { concert_id: concert.id }, transaction: t });
      const bookings = await Booking.findAll({ where: { concert_id: concert.id } });
      const bookingIds = bookings.map(b => b.id);
      if (bookingIds.length > 0) {
        await BookingDetail.destroy({ where: { booking_id: bookingIds }, transaction: t });
        await Payment.destroy({ where: { booking_id: bookingIds }, transaction: t });
        await Booking.destroy({ where: { concert_id: concert.id }, transaction: t });
      }
      await Seat.destroy({ where: { concert_id: concert.id }, transaction: t });
      await TicketCategory.destroy({ where: { concert_id: concert.id }, transaction: t });
      await concert.destroy({ transaction: t });
    }

    await venue.destroy({ transaction: t });
    await t.commit();
    return success(res, null, 'Venue deleted');
  } catch (err) {
    if (!t.finished) await t.rollback();
    next(err);
  }
};

module.exports = { getVenues, getVenueById, createVenue, updateVenue, deleteVenue };
