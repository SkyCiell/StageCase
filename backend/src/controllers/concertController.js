const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const { Concert, Venue, TicketCategory, Favorite, Seat, Booking, BookingDetail, Payment } = require('../models');
const { success, error, paginated } = require('../helpers/response');
const { getPagination, getPagingData } = require('../helpers/pagination');

// GET /api/concerts
const getConcerts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search, city, status = 'upcoming', featured, trending } = req.query;
    const { offset, limit: l, page: p } = getPagination(page, limit);

    const where = {};
    if (status) where.status = status;
    if (featured) where.is_featured = true;
    if (trending) where.is_trending = true;
    if (search) where.title = { [Op.like]: `%${search}%` };

    const venueWhere = {};
    if (city) venueWhere.city = { [Op.like]: `%${city}%` };

    const data = await Concert.findAndCountAll({
      where,
      include: [
        { model: Venue, as: 'venue', where: Object.keys(venueWhere).length ? venueWhere : undefined, attributes: ['id', 'name', 'city', 'province'] },
        { model: TicketCategory, as: 'ticketCategories', attributes: ['id', 'name', 'price', 'available'] },
      ],
      order: [['date', 'ASC']],
      limit: l,
      offset,
      distinct: true,
    });

    const { rows, pagination } = getPagingData(data, p, l);
    return paginated(res, rows, pagination);
  } catch (err) { next(err); }
};

// GET /api/concerts/:slug
const getConcertBySlug = async (req, res, next) => {
  try {
    const concert = await Concert.findOne({
      where: { slug: req.params.slug },
      include: [
        { model: Venue, as: 'venue' },
        { model: TicketCategory, as: 'ticketCategories', order: [['sort_order', 'ASC']] },
      ],
    });
    if (!concert) return error(res, 'Concert not found', 404);

    let isFavorited = false;
    if (req.user) {
      const fav = await Favorite.findOne({ where: { user_id: req.user.id, concert_id: concert.id } });
      isFavorited = !!fav;
    }

    return success(res, { ...concert.toJSON(), isFavorited });
  } catch (err) { next(err); }
};

// Admin: GET /api/admin/concerts
const getAllConcerts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const { offset, limit: l, page: p } = getPagination(page, limit);
    const where = {};
    if (status) where.status = status;
    if (search) where.title = { [Op.like]: `%${search}%` };

    const data = await Concert.findAndCountAll({
      where,
      include: [{ model: Venue, as: 'venue', attributes: ['id', 'name', 'city'] }],
      order: [['date', 'DESC']],
      limit: l,
      offset,
    });
    const { rows, pagination } = getPagingData(data, p, l);
    return paginated(res, rows, pagination);
  } catch (err) { next(err); }
};

// POST /api/admin/concerts
const createConcert = async (req, res, next) => {
  try {
    const { title, description, venue_id, date, time, doors_open, status, is_featured, is_trending, artist_bio } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const poster = req.file ? req.file.filename : null;
    const concert = await Concert.create({ title, slug, description, venue_id, date, time, doors_open, poster, status, is_featured, is_trending, artist_bio });
    return success(res, concert, 'Concert created', 201);
  } catch (err) { next(err); }
};

// PUT /api/admin/concerts/:id
const updateConcert = async (req, res, next) => {
  try {
    const concert = await Concert.findByPk(req.params.id);
    if (!concert) return error(res, 'Concert not found', 404);
    const updates = { ...req.body };
    if (req.file) updates.poster = req.file.filename;
    await concert.update(updates);
    return success(res, concert, 'Concert updated');
  } catch (err) { next(err); }
};

// DELETE /api/admin/concerts/:id
const deleteConcert = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const concert = await Concert.findByPk(req.params.id);
    if (!concert) {
      await t.rollback();
      return error(res, 'Concert not found', 404);
    }

    // Clean up dependent records
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
    await t.commit();
    return success(res, null, 'Concert deleted');
  } catch (err) {
    if (!t.finished) await t.rollback();
    next(err);
  }
};

module.exports = { getConcerts, getConcertBySlug, getAllConcerts, createConcert, updateConcert, deleteConcert };
