const { User } = require('../models');
const { success, error, paginated } = require('../helpers/response');
const { getPagination, getPagingData } = require('../helpers/pagination');
const { Op } = require('sequelize');

// GET /api/users/profile
const getProfile = async (req, res) => success(res, req.user, 'Profile fetched');

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updates = { name, phone };
    if (req.file) updates.avatar = req.file.filename;
    await req.user.update(updates);
    return success(res, req.user, 'Profile updated');
  } catch (err) { next(err); }
};

// PUT /api/users/change-password
const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const user = await User.findByPk(req.user.id);
    const isMatch = await user.comparePassword(current_password);
    if (!isMatch) return error(res, 'Current password is incorrect', 400);
    await user.update({ password: new_password });
    return success(res, null, 'Password changed successfully');
  } catch (err) { next(err); }
};

// Admin: GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const { offset, limit: l, page: p } = getPagination(page, limit);
    const where = {};
    if (role) where.role = role;
    if (search) where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
    const data = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] },
      order: [['created_at', 'DESC']],
      limit: l,
      offset,
    });
    const { rows, pagination } = getPagingData(data, p, l);
    return paginated(res, rows, pagination);
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, changePassword, getAllUsers };
