const { Favorite, Concert, Venue } = require('../models');
const { success, error } = require('../helpers/response');

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Concert, as: 'concert', include: [{ model: Venue, as: 'venue', attributes: ['name', 'city'] }] }],
    });
    return success(res, favorites);
  } catch (err) { next(err); }
};

const toggleFavorite = async (req, res, next) => {
  try {
    const { concert_id } = req.body;
    const existing = await Favorite.findOne({ where: { user_id: req.user.id, concert_id } });
    if (existing) {
      await existing.destroy();
      return success(res, { favorited: false }, 'Removed from favorites');
    }
    await Favorite.create({ user_id: req.user.id, concert_id });
    return success(res, { favorited: true }, 'Added to favorites');
  } catch (err) { next(err); }
};

module.exports = { getFavorites, toggleFavorite };
