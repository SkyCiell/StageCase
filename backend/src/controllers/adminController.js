const { sequelize } = require('../config/db');
const { User, Concert, Booking, Payment, TicketCategory } = require('../models');
const { success } = require('../helpers/response');
const { Op } = require('sequelize');

const getDashboard = async (req, res, next) => {
  try {
    const isPostgres = sequelize.getDialect() === 'postgres';

    const [totalUsers, totalConcerts, totalBookings, approvedPaymentSum, bookingSum, recentBookings] = await Promise.all([
      User.count({ where: { role: 'user' } }),
      Concert.count(),
      Booking.count(),
      Payment.sum('amount', { where: { status: 'approved' } }),
      Booking.sum('total_price', { where: { status: { [Op.ne]: 'cancelled' } } }),
      Booking.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [
          { association: 'user', attributes: ['name', 'email'] },
          { model: Concert, as: 'concert', attributes: ['title'] },
          { association: 'payment' },
        ],
      }),
    ]);

    let monthlyRevenue = [];
    try {
      const monthlyQuery = isPostgres
        ? `SELECT TO_CHAR(created_at, 'YYYY-MM') as month, SUM(total_price) as revenue, COUNT(*) as transactions FROM bookings WHERE status != 'cancelled' AND created_at >= NOW() - INTERVAL '6 MONTH' GROUP BY month ORDER BY month ASC`
        : `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_price) as revenue, COUNT(*) as transactions FROM bookings WHERE status != 'cancelled' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH) GROUP BY month ORDER BY month ASC`;
      monthlyRevenue = await sequelize.query(monthlyQuery, { type: sequelize.QueryTypes.SELECT });
    } catch (e) {
      console.error('Monthly revenue query error:', e.message);
    }

    const totalRevenue = approvedPaymentSum || bookingSum || 0;

    return success(res, {
      stats: {
        totalUsers,
        totalConcerts,
        totalBookings,
        totalRevenue: parseFloat(totalRevenue),
      },
      recentBookings,
      monthlyRevenue,
    });
  } catch (err) { next(err); }
};

module.exports = { getDashboard };
