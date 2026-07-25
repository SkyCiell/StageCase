const { TicketCategory } = require('../models');
const { success, error } = require('../helpers/response');

const getCategories = async (req, res, next) => {
  try {
    const categories = await TicketCategory.findAll({
      where: { concert_id: req.params.concertId },
      order: [['sort_order', 'ASC']],
    });
    return success(res, categories);
  } catch (err) { next(err); }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await TicketCategory.create({ ...req.body, available: req.body.quota });
    return success(res, category, 'Category created', 201);
  } catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await TicketCategory.findByPk(req.params.id);
    if (!category) return error(res, 'Category not found', 404);
    await category.update(req.body);
    return success(res, category, 'Category updated');
  } catch (err) { next(err); }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await TicketCategory.findByPk(req.params.id);
    if (!category) return error(res, 'Category not found', 404);
    await category.destroy();
    return success(res, null, 'Category deleted');
  } catch (err) { next(err); }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
