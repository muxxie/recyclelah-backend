-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT,
  firstName TEXT,
  lastName TEXT,
  role TEXT DEFAULT 'seller',
  phone TEXT,
  vehicleType TEXT,
  gender TEXT,
  icNumber TEXT,
  icHash TEXT,
  icFrontPhoto TEXT,
  icBackPhoto TEXT,
  icFrontUrl TEXT,
  icBackUrl TEXT,
  verificationStatus TEXT DEFAULT 'pending',
  phoneVerified BOOLEAN DEFAULT false,
  emailVerified BOOLEAN DEFAULT false,
  banned BOOLEAN DEFAULT false,
  banReason TEXT,
  balance NUMERIC DEFAULT 0,
  latitude TEXT,
  longitude TEXT,
  isOnline BOOLEAN DEFAULT false
);

-- Facilities table
CREATE TABLE IF NOT EXISTS facilities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude TEXT,
  longitude TEXT,
  acceptedMaterials TEXT[],
  phone TEXT,
  operatingHours TEXT
);

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  sellerId UUID REFERENCES users(id),
  collectorId UUID REFERENCES users(id),
  facilityId INT REFERENCES facilities(id),
  itemTypes TEXT[],
  status TEXT DEFAULT 'pending',
  actualWeight NUMERIC,
  totalValue NUMERIC,
  commission NUMERIC
);

-- Wallet transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id SERIAL PRIMARY KEY,
  userId UUID REFERENCES users(id),
  type TEXT,
  amount NUMERIC,
  description TEXT,
  relatedRequestId INT REFERENCES requests(id),
  createdAt TIMESTAMP DEFAULT now()
);

-- OTP table
CREATE TABLE IF NOT EXISTS otps (
  id SERIAL PRIMARY KEY,
  userId UUID REFERENCES users(id),
  type TEXT,
  target TEXT,
  otpHash TEXT,
  verified BOOLEAN DEFAULT false,
  attempts INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT now(),
  expiresAt TIMESTAMP
);

-- Market prices
CREATE TABLE IF NOT EXISTS market_prices (
  id SERIAL PRIMARY KEY,
  materialType TEXT UNIQUE NOT NULL,
  pricePerKg NUMERIC NOT NULL
);
