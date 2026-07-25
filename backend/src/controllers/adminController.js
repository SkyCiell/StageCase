const { sequelize } = require('../config/db');
const { User, Concert, Booking, Payment, TicketCategory } = require('../models');
const { success } = require('../helpers/response');
const { Op } = require('sequelize');

const getDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalConcerts, totalBookings, revenueResult, recentBookings, monthlyRevenue] = await Promise.all([
      User.count({ where: { role: 'user' } }),
      Concert.count(),
      Booking.count({ where: { status: 'confirmed' } }),
      Payment.sum('amount', { where: { status: 'approved' } }),
      Booking.findAll({
        limit: 10,
        order: [['created_at', 'DESC']],
        include: [
          { association: 'user', attributes: ['name', 'email'] },
          { model: Concert, as: 'concert', attributes: ['title'] },
          { association: 'payment' },
        ],
      }),
      // Monthly revenue for last 6 months
      sequelize.query(`
        SELECT 
          DATE_FORMAT(p.created_at, '%Y-%m') as month,
          SUM(p.amount) as revenue,
          COUNT(*) as transactions
        FROM payments p
        WHERE p.status = 'approved'
          AND p.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month
        ORDER BY month ASC
      `, { type: sequelize.QueryTypes.SELECT }),
    ]);

    return success(res, {
      stats: {
        totalUsers,
        totalConcerts,
        totalBookings,
        totalRevenue: revenueResult || 0,
      },
      recentBookings,
      monthlyRevenue,
    });
  } catch (err) { next(err); }
};

module.exports = { getDashboard };
