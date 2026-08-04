-- StageCase Supabase PostgreSQL Schema & Seed Data
-- Project Ref: sobodjnoiqudfjwgztyx

-- 1. Create Enums (if not existing)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE concert_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE seat_status AS ENUM ('available', 'reserved', 'booked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'waiting_payment', 'payment_review', 'confirmed', 'cancelled', 'expired', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'submitted', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('booking', 'payment', 'concert', 'promo', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'user',
  avatar VARCHAR(255),
  phone VARCHAR(20),
  is_verified BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Venues Table
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
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Concerts Table
CREATE TABLE IF NOT EXISTS concerts (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  venue_id VARCHAR(36) NOT NULL REFERENCES venues(id) ON DELETE RESTRICT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  doors_open TIME,
  poster VARCHAR(255),
  banner VARCHAR(255),
  status concert_status DEFAULT 'upcoming',
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  artist_name VARCHAR(255) DEFAULT 'Crayon Case',
  artist_bio TEXT,
  total_sold INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Ticket Categories Table
CREATE TABLE IF NOT EXISTS ticket_categories (
  id VARCHAR(36) PRIMARY KEY,
  concert_id VARCHAR(36) NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  quota INT NOT NULL,
  available INT NOT NULL,
  description TEXT,
  color VARCHAR(20) DEFAULT '#2D6F73',
  benefits JSONB,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Seats Table
CREATE TABLE IF NOT EXISTS seats (
  id VARCHAR(36) PRIMARY KEY,
  concert_id VARCHAR(36) NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  category_id VARCHAR(36) NOT NULL REFERENCES ticket_categories(id) ON DELETE CASCADE,
  row VARCHAR(5) NOT NULL,
  number INT NOT NULL,
  label VARCHAR(20),
  status seat_status DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  concert_id VARCHAR(36) NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  booking_code VARCHAR(20) NOT NULL UNIQUE,
  total_price DECIMAL(14, 2) NOT NULL,
  status booking_status DEFAULT 'pending',
  expired_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Booking Details Table
CREATE TABLE IF NOT EXISTS booking_details (
  id VARCHAR(36) PRIMARY KEY,
  booking_id VARCHAR(36) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  ticket_category_id VARCHAR(36) NOT NULL REFERENCES ticket_categories(id) ON DELETE RESTRICT,
  seat_id VARCHAR(36) REFERENCES seats(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(14, 2) NOT NULL,
  qr_code TEXT,
  qr_code_data VARCHAR(255),
  holder_name VARCHAR(150),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  booking_id VARCHAR(36) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  method VARCHAR(100),
  proof_image VARCHAR(255),
  amount DECIMAL(14, 2),
  status payment_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  verified_by VARCHAR(36),
  rejection_reason TEXT,
  payment_type VARCHAR(50) DEFAULT 'manual_transfer',
  snap_token VARCHAR(255) DEFAULT NULL,
  snap_redirect_url TEXT DEFAULT NULL,
  transaction_id VARCHAR(255) DEFAULT NULL,
  transaction_status VARCHAR(50) DEFAULT NULL,
  transaction_time TIMESTAMPTZ DEFAULT NULL,
  payment_response JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_status ON payments(transaction_status);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type notification_type DEFAULT 'system',
  is_read BOOLEAN DEFAULT FALSE,
  link VARCHAR(255),
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  concert_id VARCHAR(36) NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_favorite UNIQUE (user_id, concert_id)
);

-- SEED DATA (Clean & Accurate)

-- Admin User
INSERT INTO users (id, name, email, password, role, is_verified) VALUES
('admin-001', 'StageCase Admin', 'admin@stagecase.id', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RNB8vfMGy', 'admin', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Venues
INSERT INTO venues (id, name, city, province, address, capacity) VALUES
('venue-001', 'Istora Senayan', 'Jakarta', 'DKI Jakarta', 'Jl. Asia Afrika, Gelora, Tanah Abang, Jakarta Pusat', 7500),
('venue-002', 'Tennis Indoor Senayan', 'Jakarta', 'DKI Jakarta', 'Jl. Pintu Satu Senayan, Gelora, Jakarta Pusat', 5000),
('venue-003', 'Stadion Kanjuruhan', 'Malang', 'Jawa Timur', 'Jl. Trunojoyo No.1, Kepanjen, Malang', 40000),
('venue-004', 'JogjaROCKarta Venue', 'Yogyakarta', 'DI Yogyakarta', 'Jl. Affandi No.66, Depok, Sleman', 3000),
('venue-005', 'The Pallas SCBD', 'Jakarta', 'DKI Jakarta', 'SCBD Lot 28, Jl. Jend. Sudirman, Jakarta Selatan', 2500),
('venue-006', 'Parkir Timur Senayan', 'Jakarta', 'DKI Jakarta', 'Jl. Asia Afrika, Gelora, Jakarta Pusat', 10000),
('venue-007', 'GOR Among Raga', 'Yogyakarta', 'DI Yogyakarta', 'Jl. Tentara Rakyat Mataram No.14, Bumijo, Jetis', 4000),
('venue-008', 'Alun Alun Bandung', 'Bandung', 'Jawa Barat', 'Jl. Asia Afrika, Bandung Wetan, Bandung', 8000),
('venue-009', 'Jatim Expo', 'Surabaya', 'Jawa Timur', 'Jl. Raya Sulfat No.1, Wonokromo, Surabaya', 12000),
('venue-010', 'The Kasablanka Hall', 'Jakarta', 'DKI Jakarta', 'Kota Kasablanka Mall, Jl. Casablanca, Jakarta Selatan', 3500)
ON CONFLICT (id) DO NOTHING;

-- Concerts
INSERT INTO concerts (id, title, slug, description, venue_id, date, time, doors_open, status, is_featured, is_trending, artist_name, artist_bio) VALUES
('concert-rc-001', 'Reality Club: City Lights Tour - Jakarta', 'reality-club-city-lights-jakarta-2026', 'Experience the dreamy nostalgic vibes of Reality Club live at The Pallas. Featuring hits from "Is This the Best Life That I Could Have?" and new songs from their latest album.', 'venue-005', '2026-09-12', '19:30:00', '18:00:00', 'upcoming', TRUE, TRUE, 'Reality Club', 'Reality Club is an Indonesian indie pop band known for their dreamy, nostalgic sound and romantic lyrics.'),
('concert-rc-002', 'Reality Club: City Lights Tour - Bandung', 'reality-club-city-lights-bandung-2026', 'The City Lights Tour continues in Bandung! Join Reality Club for an unforgettable night under the stars at Alun Alun Bandung.', 'venue-008', '2026-09-20', '19:00:00', '17:30:00', 'upcoming', TRUE, FALSE, 'Reality Club', 'Reality Club is an Indonesian indie pop band known for their dreamy, nostalgic sound and romantic lyrics.'),
('concert-rc-003', 'Reality Club: City Lights Tour - Yogyakarta', 'reality-club-city-lights-yogyakarta-2026', 'Reality Club brings their signature dreamy atmosphere to Jogja! A night of nostalgic tunes and late-night city vibes.', 'venue-004', '2026-09-28', '19:30:00', '18:00:00', 'upcoming', FALSE, TRUE, 'Reality Club', 'Reality Club is an Indonesian indie pop band known for their dreamy, nostalgic sound and romantic lyrics.'),

('concert-tm-001', 'The Milo: Acoustic Sessions - Jakarta', 'the-milo-acoustic-jakarta-2026', 'An intimate acoustic evening with The Milo at The Kasablanka Hall. Warm melodies, heartfelt lyrics, and the perfect coffee shop vibe.', 'venue-010', '2026-10-05', '18:30:00', '17:00:00', 'upcoming', TRUE, TRUE, 'The Milo', 'The Milo is an Indonesian indie acoustic duo known for their warm, soothing sound and emotionally-driven songwriting.'),
('concert-tm-002', 'The Milo: Acoustic Sessions - Surabaya', 'the-milo-acoustic-surabaya-2026', 'The Milo brings their signature acoustic warmth to Surabaya. An evening of stripped-down performances and intimate storytelling.', 'venue-009', '2026-10-12', '18:00:00', '16:30:00', 'upcoming', TRUE, FALSE, 'The Milo', 'The Milo is an Indonesian indie acoustic duo known for their warm, soothing sound and emotionally-driven songwriting.'),
('concert-tm-003', 'The Milo: Acoustic Sessions - Yogyakarta', 'the-milo-acoustic-yogyakarta-2026', 'Join The Milo for an unforgettable acoustic night in Jogja. Perfect for fans of heartfelt indie music and warm vibes.', 'venue-007', '2026-10-19', '18:30:00', '17:00:00', 'upcoming', FALSE, TRUE, 'The Milo', 'The Milo is an Indonesian indie acoustic duo known for their warm, soothing sound and emotionally-driven songwriting.'),

('concert-wte-001', 'Wave to Earth: 0.1 flaws and all Tour - Jakarta', 'wave-to-earth-flaws-and-all-jakarta-2026', 'Wave to Earth brings their peaceful, emotional sound to Jakarta. Experience the minimalist ocean atmosphere and rainy-day vibes live at Parkir Timur Senayan.', 'venue-006', '2026-11-08', '19:00:00', '17:30:00', 'upcoming', TRUE, TRUE, 'Wave to Earth', 'Wave to Earth is a South Korean indie band known for their rainy, peaceful aesthetic and minimalist sound.'),
('concert-wte-002', 'Wave to Earth: 0.1 flaws and all Tour - Bandung', 'wave-to-earth-flaws-and-all-bandung-2026', 'The peaceful waves crash into Bandung. Wave to Earth performs their emotionally-charged setlist under the stars.', 'venue-008', '2026-11-15', '19:00:00', '17:30:00', 'upcoming', TRUE, FALSE, 'Wave to Earth', 'Wave to Earth is a South Korean indie band known for their rainy, peaceful aesthetic and minimalist sound.'),
('concert-wte-003', 'Wave to Earth: 0.1 flaws and all Tour - Surabaya', 'wave-to-earth-flaws-and-all-surabaya-2026', 'Wave to Earth brings their signature emotional minimalism to Surabaya. A night of peaceful melodies and oceanic vibes.', 'venue-009', '2026-11-22', '19:00:00', '17:30:00', 'upcoming', FALSE, TRUE, 'Wave to Earth', 'Wave to Earth is a South Korean indie band known for their rainy, peaceful aesthetic and minimalist sound.')
ON CONFLICT (id) DO NOTHING;

-- Ticket Categories
INSERT INTO ticket_categories (id, concert_id, name, price, quota, available, description, color, sort_order) VALUES
('cat-rc-j-001', 'concert-rc-001', 'Standing', 450000.00, 1200, 1200, 'General standing area with full view of the stage.', '#5B4A7A', 1),
('cat-rc-j-002', 'concert-rc-001', 'Festival', 650000.00, 800, 800, 'Premium standing zone closer to the stage.', '#5B4A7A', 2),
('cat-rc-j-003', 'concert-rc-001', 'VIP Seated', 950000.00, 300, 300, 'Reserved seating with exclusive merch pack.', '#D4C2A8', 3),
('cat-rc-j-004', 'concert-rc-001', 'VVIP Meet & Greet', 1800000.00, 50, 50, 'Premium seated + exclusive meet & greet session.', '#D4C2A8', 4),

('cat-tm-j-001', 'concert-tm-001', 'General Seating', 350000.00, 1800, 1800, 'Comfortable seated area with excellent acoustics.', '#6A8F6B', 1),
('cat-tm-j-002', 'concert-tm-001', 'Premium Seated', 550000.00, 800, 800, 'Closer seats with better view.', '#6A8F6B', 2),
('cat-tm-j-003', 'concert-tm-001', 'VIP Lounge', 900000.00, 200, 200, 'Exclusive lounge area + meet & greet.', '#D9C7A5', 3),

('cat-wte-j-001', 'concert-wte-001', 'General Standing', 500000.00, 3500, 3500, 'General standing area with full stage view.', '#567A9B', 1),
('cat-wte-j-002', 'concert-wte-001', 'Premium Festival', 750000.00, 2000, 2000, 'Premium zone closer to the stage.', '#567A9B', 2),
('cat-wte-j-003', 'concert-wte-001', 'VIP Zone', 1200000.00, 800, 800, 'VIP standing zone + exclusive merch.', '#C8D8D6', 3),
('cat-wte-j-004', 'concert-wte-001', 'VVIP Package', 2000000.00, 200, 200, 'Ultimate package with meet & greet.', '#C8D8D6', 4)
ON CONFLICT (id) DO NOTHING;
