-- Drop existing tables if needed
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS otps CASCADE;
DROP TABLE IF EXISTS market_prices CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'seller',
  phone TEXT,
  vehicle_type TEXT,
  gender TEXT,
  ic_number TEXT,
  ic_hash TEXT,
  ic_front_photo TEXT,
  ic_back_photo TEXT,
  ic_front_url TEXT,
  ic_back_url TEXT,
  verification_status TEXT DEFAULT 'pending',
  phone_verified BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  balance NUMERIC DEFAULT 0,
  latitude TEXT,
  longitude TEXT,
  is_online BOOLEAN DEFAULT false
);

-- Facilities table
CREATE TABLE facilities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude TEXT,
  longitude TEXT,
  accepted_materials TEXT[],
  phone TEXT,
  operating_hours TEXT
);

-- Requests table
CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  seller_id UUID REFERENCES users(id),
  collector_id UUID REFERENCES users(id),
  facility_id INT REFERENCES facilities(id),
  item_types TEXT[],
  status TEXT DEFAULT 'pending',
  actual_weight NUMERIC,
  total_value NUMERIC,
  commission NUMERIC
);

-- Wallet transactions
CREATE TABLE wallet_transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type TEXT,
  amount NUMERIC,
  description TEXT,
  related_request_id INT REFERENCES requests(id),
  created_at TIMESTAMP DEFAULT now()   -- ✅ snake_case
);

-- OTP table
CREATE TABLE otps (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type TEXT,
  target TEXT,
  otp_hash TEXT,
  verified BOOLEAN DEFAULT false,
  attempts INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),  -- ✅ snake_case
  expires_at TIMESTAMP
);

-- Market prices
CREATE TABLE market_prices (
  id SERIAL PRIMARY KEY,
  material_type TEXT UNIQUE NOT NULL,
  price_per_kg NUMERIC NOT NULL
);
