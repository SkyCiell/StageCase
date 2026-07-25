const { Seat, TicketCategory } = require('../models');
const { success, error } = require('../helpers/response');

// GET /api/concerts/:id/seats
const getSeatMap = async (req, res, next) => {
  try {
    const seats = await Seat.findAll({
      where: { concert_id: req.params.id },
      include: [{ model: TicketCategory, as: 'category', attributes: ['id', 'name', 'color', 'price'] }],
      order: [['row', 'ASC'], ['number', 'ASC']],
    });
    return success(res, seats);
  } catch (err) { next(err); }
};

// Admin: POST /api/admin/concerts/:id/seats/generate
const generateSeats = async (req, res, next) => {
  try {
    const { concert_id, category_id, rows, seats_per_row } = req.body;
    const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const seatData = [];

    for (let r = 0; r < parseInt(rows); r++) {
      for (let s = 1; s <= parseInt(seats_per_row); s++) {
        seatData.push({
          concert_id,
          category_id,
          row: rowLetters[r],
          number: s,
          label: `${rowLetters[r]}${s}`,
          status: 'available',
        });
      }
    }

    await Seat.bulkCreate(seatData, { ignoreDuplicates: true });
    return success(res, null, `${seatData.length} seats generated`, 201);
  } catch (err) { next(err); }
};

module.exports = { getSeatMap, generateSeats };
