const { Notification } = require('../models');
const { success } = require('../helpers/response');

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      limit: 50,
    });
    return success(res, notifications);
  } catch (err) { next(err); }
};

const markAsRead = async (req, res, next) => {
  try {
    await Notification.update({ is_read: true }, { where: { id: req.params.id, user_id: req.user.id } });
    return success(res, null, 'Marked as read');
  } catch (err) { next(err); }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.update({ is_read: true }, { where: { user_id: req.user.id, is_read: false } });
    return success(res, null, 'All notifications marked as read');
  } catch (err) { next(err); }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
