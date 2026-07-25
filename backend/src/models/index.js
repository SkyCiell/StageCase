const { sequelize } = require('../config/db');
const User = require('./User');
const Venue = require('./Venue');
const Concert = require('./Concert');
const TicketCategory = require('./TicketCategory');
const Seat = require('./Seat');
const Booking = require('./Booking');
const BookingDetail = require('./BookingDetail');
const Payment = require('./Payment');
const Notification = require('./Notification');
const Favorite = require('./Favorite');

// Associations
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Venue.hasMany(Concert, { foreignKey: 'venue_id', as: 'concerts' });
Concert.belongsTo(Venue, { foreignKey: 'venue_id', as: 'venue' });

Concert.hasMany(TicketCategory, { foreignKey: 'concert_id', as: 'ticketCategories' });
TicketCategory.belongsTo(Concert, { foreignKey: 'concert_id', as: 'concert' });

Concert.hasMany(Seat, { foreignKey: 'concert_id', as: 'seats' });
Seat.belongsTo(Concert, { foreignKey: 'concert_id', as: 'concert' });

TicketCategory.hasMany(Seat, { foreignKey: 'category_id', as: 'seats' });
Seat.belongsTo(TicketCategory, { foreignKey: 'category_id', as: 'category' });

Concert.hasMany(Booking, { foreignKey: 'concert_id', as: 'bookings' });
Booking.belongsTo(Concert, { foreignKey: 'concert_id', as: 'concert' });

Booking.hasMany(BookingDetail, { foreignKey: 'booking_id', as: 'details' });
BookingDetail.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

TicketCategory.hasMany(BookingDetail, { foreignKey: 'ticket_category_id', as: 'bookingDetails' });
BookingDetail.belongsTo(TicketCategory, { foreignKey: 'ticket_category_id', as: 'ticketCategory' });

Seat.hasOne(BookingDetail, { foreignKey: 'seat_id', as: 'bookingDetail' });
BookingDetail.belongsTo(Seat, { foreignKey: 'seat_id', as: 'seat' });

Booking.hasOne(Payment, { foreignKey: 'booking_id', as: 'payment' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Concert.hasMany(Favorite, { foreignKey: 'concert_id', as: 'favorites' });
Favorite.belongsTo(Concert, { foreignKey: 'concert_id', as: 'concert' });

module.exports = {
  sequelize,
  User,
  Venue,
  Concert,
  TicketCategory,
  Seat,
  Booking,
  BookingDetail,
  Payment,
  Notification,
  Favorite,
};
