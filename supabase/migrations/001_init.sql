-- Issue #2: Initialize database schema
-- Create all tables for Prime Property application

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'superadmin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Login attempts table (for lockout logic)
CREATE TABLE login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL
);

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_property TEXT NOT NULL,
  group_name TEXT,
  lebar NUMERIC(10,2) NOT NULL,
  panjang NUMERIC(10,2) NOT NULL,
  hadap TEXT[] NOT NULL DEFAULT '{}',
  tipe TEXT NOT NULL CHECK (tipe IN ('Ruko', 'Villa')),
  tingkat NUMERIC(4,1) NOT NULL,
  price BIGINT NOT NULL,
  carport BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'sold_out')),
  siap TEXT NOT NULL CHECK (siap IN ('siap_huni', 'siap_kosong', 'siap_huni_renovasi')),
  maps_link TEXT,
  kawasan TEXT[] NOT NULL DEFAULT '{}',
  unit TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES users(id),
  deleted_at TIMESTAMPTZ
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  changes JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact submissions table (for rate limiting)
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_tipe ON properties(tipe);
CREATE INDEX idx_properties_deleted_at ON properties(deleted_at);
CREATE INDEX idx_properties_kawasan ON properties USING GIN(kawasan);
CREATE INDEX idx_login_attempts_email_attempted_at ON login_attempts(email, attempted_at);
