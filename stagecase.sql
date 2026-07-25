-- StageCase Complete MySQL Database Schema & Seed Data
-- Run this script in MySQL Workbench, phpMyAdmin, or terminal: mysql -u root -p < stagecase.sql

CREATE DATABASE IF NOT EXISTS stagecase CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE stagecase;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(255),
  phone VARCHAR(20),
  is_verified TINYINT(1) DEFAULT 0,
  reset_token VARCHAR(255),
  reset_token_expires DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Venues Table
CREATE TABLE IF NOT EXISTS venues (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  capacity INT DEFAULT 0,
  image VARCHAR(255),
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Concerts Table
CREATE TABLE IF NOT EXISTS concerts (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  venue_id VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  doors_open TIME,
  poster VARCHAR(255),
  banner VARCHAR(255),
  status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
  is_featured TINYINT(1) DEFAULT 0,
  is_trending TINYINT(1) DEFAULT 0,
  artist_name VARCHAR(255) DEFAULT 'Crayon Case',
  artist_bio TEXT,
  total_sold INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- 4. Ticket Categories Table
CREATE TABLE IF NOT EXISTS ticket_categories (
  id VARCHAR(36) PRIMARY KEY,
  concert_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  quota INT NOT NULL,
  available INT NOT NULL,
  description TEXT,
  color VARCHAR(20) DEFAULT '#2F5FDC',
  benefits JSON,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (concert_id) REFERENCES concerts(id) ON DELETE CASCADE
);

-- 5. Seats Table
CREATE TABLE IF NOT EXISTS seats (
  id VARCHAR(36) PRIMARY KEY,
  concert_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  `row` VARCHAR(5) NOT NULL,
  number INT NOT NULL,
  label VARCHAR(20),
  status ENUM('available', 'reserved', 'booked') DEFAULT 'available',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (concert_id) REFERENCES concerts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES ticket_categories(id)
);

-- 6. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  concert_id VARCHAR(36) NOT NULL,
  booking_code VARCHAR(20) NOT NULL UNIQUE,
  total_price DECIMAL(14, 2) NOT NULL,
  status ENUM('pending', 'waiting_payment', 'payment_review', 'confirmed', 'cancelled', 'expired') DEFAULT 'pending',
  expired_at DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (concert_id) REFERENCES concerts(id)
);

-- 7. Booking Details Table
CREATE TABLE IF NOT EXISTS booking_details (
  id VARCHAR(36) PRIMARY KEY,
  booking_id VARCHAR(36) NOT NULL,
  ticket_category_id VARCHAR(36) NOT NULL,
  seat_id VARCHAR(36),
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(14, 2) NOT NULL,
  qr_code TEXT,
  qr_code_data VARCHAR(255),
  holder_name VARCHAR(150),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_category_id) REFERENCES ticket_categories(id),
  FOREIGN KEY (seat_id) REFERENCES seats(id)
);

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  booking_id VARCHAR(36) NOT NULL,
  method VARCHAR(100),
  proof_image VARCHAR(255),
  amount DECIMAL(14, 2),
  status ENUM('pending', 'submitted', 'approved', 'rejected') DEFAULT 'pending',
  verified_at DATETIME,
  verified_by VARCHAR(36),
  rejection_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 9. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('booking', 'payment', 'concert', 'promo', 'system') DEFAULT 'system',
  is_read TINYINT(1) DEFAULT 0,
  link VARCHAR(255),
  data JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  concert_id VARCHAR(36) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favorite (user_id, concert_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (concert_id) REFERENCES concerts(id) ON DELETE CASCADE
);

-- Seed Data: Sample Admin User (password: Admin@12345)
INSERT IGNORE INTO users (id, name, email, password, role, is_verified) VALUES
('admin-001', 'StageCase Admin', 'admin@stagecase.id', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RNB8vfMGy', 'admin', 1);

-- Seed Data: Sample Venues
INSERT IGNORE INTO venues (id, name, city, province, address, capacity) VALUES
('venue-001', 'Istora Senayan', 'Jakarta', 'DKI Jakarta', 'Jl. Asia Afrika, Gelora, Tanah Abang, Jakarta Pusat', 7500),
('venue-002', 'Tennis Indoor Senayan', 'Jakarta', 'DKI Jakarta', 'Jl. Pintu Satu Senayan, Gelora, Jakarta Pusat', 5000),
('venue-003', 'Stadion Kanjuruhan', 'Malang', 'Jawa Timur', 'Jl. Trunojoyo No.1, Kepanjen, Malang', 40000);

-- Seed Data: Sample Concert
INSERT IGNORE INTO concerts (id, title, slug, description, venue_id, date, time, doors_open, status, is_featured, is_trending, artist_name) VALUES
('concert-001', 'Crayon Case: Live In Jakarta 2026', 'crayon-case-live-in-jakarta-2026', 'The biggest Crayon Case concert of the year live at Istora Senayan.', 'venue-001', '2026-11-15', '19:00:00', '17:00:00', 'upcoming', 1, 1, 'Crayon Case');

-- Seed Data: Ticket Categories for Sample Concert
INSERT IGNORE INTO ticket_categories (id, concert_id, name, price, quota, available, description, color, sort_order) VALUES
('cat-001', 'concert-001', 'Festival', 350000.00, 2000, 2000, 'Standing area in front of the main stage.', '#2F5FDC', 1),
('cat-002', 'concert-001', 'Tribune', 500000.00, 1500, 1500, 'Seated area with clear sightlines.', '#2F5FDC', 2),
('cat-003', 'concert-001', 'VIP', 850000.00, 500, 500, 'Premium seating + early access + merchandise.', '#B89B5E', 3),
('cat-004', 'concert-001', 'VVIP', 1500000.00, 100, 100, 'Front row seating + meet & greet pass.', '#B89B5E', 4);
