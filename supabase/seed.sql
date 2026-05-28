-- Issue #2: Seed data for development
-- Insert test users and property data

-- Insert superadmin user (password: SuperAdmin123!)
INSERT INTO users (email, password_hash, name, role, is_active) VALUES
  ('superadmin@primeproperty.id', '$2b$10$HOdIWjMRyNJjZXAlPkudju6YTq602w1qKUkGAIXI8Hqmepla3topy', 'Super Admin', 'superadmin', true);

-- Insert admin user (password: Admin123!)
INSERT INTO users (email, password_hash, name, role, is_active) VALUES
  ('admin@primeproperty.id', '$2b$10$ruYvn9bfA0pUX3OoUfdpvO2DvKOT9oI7qdSPrgr/9Tu.Jw8pS.JMq', 'Admin User', 'admin', true);

-- Get superadmin ID for created_by foreign key
WITH admin_id AS (
  SELECT id FROM users WHERE email = 'superadmin@primeproperty.id' LIMIT 1
)
INSERT INTO properties (
  nama_property, group_name, lebar, panjang, hadap, tipe, tingkat, price, carport, status, siap, maps_link, kawasan, unit, created_by
)
SELECT
  property_data.nama_property,
  property_data.group_name,
  property_data.lebar,
  property_data.panjang,
  property_data.hadap,
  property_data.tipe,
  property_data.tingkat,
  property_data.price,
  property_data.carport,
  property_data.status,
  property_data.siap,
  property_data.maps_link,
  property_data.kawasan,
  property_data.unit,
  admin_id.id
FROM (
  -- BSD Properties
  VALUES
  ('Rumah Mewah BSD 001', 'BSD Premium', 8.5, 15.0, ARRAY['Utara'], 'Villa', 2.0, 2500000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/bsd001', ARRAY['BSD'], 'A-001'),
  ('Ruko Komersial BSD 002', 'BSD Commercial', 5.0, 12.0, ARRAY['Timur'], 'Ruko', 3.0, 1800000000, true, 'in_stock', 'siap_kosong', 'https://maps.google.com/bsd002', ARRAY['BSD'], 'B-002'),
  ('Villa Asri BSD 003', 'BSD Residence', 10.0, 20.0, ARRAY['Selatan'], 'Villa', 2.0, 3200000000, true, 'sold_out', 'siap_huni', 'https://maps.google.com/bsd003', ARRAY['BSD'], 'A-003'),
  ('Ruko Modern BSD 004', 'BSD Commercial', 6.0, 14.0, ARRAY['Barat'], 'Ruko', 3.0, 2100000000, true, 'in_stock', 'siap_huni_renovasi', NULL, ARRAY['BSD'], 'B-004'),
  ('Hunian Strategis BSD 005', 'BSD Residence', 7.5, 16.0, ARRAY['Utara','Timur'], 'Villa', 2.0, 2800000000, true, 'in_stock', 'siap_kosong', 'https://maps.google.com/bsd005', ARRAY['BSD'], 'A-005'),

  -- Alam Sutera Properties
  ('Rumah Elegant Alam Sutera 006', 'Alam Sutera Residence', 9.0, 18.0, ARRAY['Timur'], 'Villa', 2.0, 3500000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/as006', ARRAY['Alam Sutera'], 'C-006'),
  ('Ruko Premium Alam Sutera 007', 'Alam Sutera Commerce', 5.5, 13.0, ARRAY['Barat'], 'Ruko', 3.0, 2200000000, true, 'in_stock', 'siap_huni_renovasi', NULL, ARRAY['Alam Sutera'], 'D-007'),
  ('Hunian Nyaman Alam Sutera 008', 'Alam Sutera Residence', 8.0, 17.0, ARRAY['Selatan'], 'Villa', 2.0, 2900000000, false, 'sold_out', 'siap_kosong', 'https://maps.google.com/as008', ARRAY['Alam Sutera'], 'C-008'),
  ('Ruko Bisnis Alam Sutera 009', 'Alam Sutera Commerce', 6.5, 15.0, ARRAY['Utara'], 'Ruko', 3.0, 2400000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/as009', ARRAY['Alam Sutera'], 'D-009'),
  ('Properti Investasi Alam Sutera 010', 'Alam Sutera Residence', 7.0, 14.0, ARRAY['Timur','Barat'], 'Villa', 2.0, 2700000000, true, 'in_stock', 'siap_huni_renovasi', NULL, ARRAY['Alam Sutera'], 'C-010'),

  -- Serpong Properties
  ('Rumah Modern Serpong 011', 'Serpong Indah', 8.0, 16.0, ARRAY['Utara'], 'Villa', 2.0, 2600000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/serpong011', ARRAY['Serpong'], 'E-011'),
  ('Ruko Siap Pakai Serpong 012', 'Serpong Commerce', 5.0, 12.0, ARRAY['Selatan'], 'Ruko', 3.0, 1900000000, false, 'in_stock', 'siap_kosong', 'https://maps.google.com/serpong012', ARRAY['Serpong'], 'F-012'),
  ('Hunian Berkualitas Serpong 013', 'Serpong Indah', 9.5, 19.0, ARRAY['Barat'], 'Villa', 2.0, 3100000000, true, 'sold_out', 'siap_huni_renovasi', NULL, ARRAY['Serpong'], 'E-013'),
  ('Ruko Investasi Serpong 014', 'Serpong Commerce', 6.0, 13.5, ARRAY['Timur'], 'Ruko', 3.0, 2050000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/serpong014', ARRAY['Serpong'], 'F-014'),
  ('Properti Premium Serpong 015', 'Serpong Indah', 10.5, 21.0, ARRAY['Utara','Selatan'], 'Villa', 2.0, 3800000000, true, 'in_stock', 'siap_kosong', 'https://maps.google.com/serpong015', ARRAY['Serpong'], 'E-015'),

  -- Tangerang Properties
  ('Rumah Tangerang 016', 'Tangerang Pusat', 7.5, 15.0, ARRAY['Selatan'], 'Villa', 2.0, 2200000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/tangerang016', ARRAY['Tangerang'], 'G-016'),
  ('Ruko Tangerang 017', 'Tangerang Commerce', 5.5, 12.5, ARRAY['Timur'], 'Ruko', 3.0, 1700000000, true, 'sold_out', 'siap_huni_renovasi', NULL, ARRAY['Tangerang'], 'H-017'),
  ('Hunian Tangerang 018', 'Tangerang Pusat', 8.5, 17.0, ARRAY['Barat'], 'Villa', 2.0, 2400000000, false, 'in_stock', 'siap_kosong', 'https://maps.google.com/tangerang018', ARRAY['Tangerang'], 'G-018'),
  ('Ruko Strategis Tangerang 019', 'Tangerang Commerce', 6.5, 14.0, ARRAY['Utara'], 'Ruko', 3.0, 1950000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/tangerang019', ARRAY['Tangerang'], 'H-019'),
  ('Properti Tangerang 020', 'Tangerang Pusat', 7.0, 16.0, ARRAY['Selatan','Timur'], 'Villa', 2.0, 2300000000, true, 'in_stock', 'siap_huni_renovasi', NULL, ARRAY['Tangerang'], 'G-020'),

  -- Gading Serpong Properties
  ('Rumah Gading Serpong 021', 'Gading Serpong Residence', 9.0, 18.0, ARRAY['Utara'], 'Villa', 2.0, 3300000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/gading021', ARRAY['Gading Serpong'], 'I-021'),
  ('Ruko Gading Serpong 022', 'Gading Serpong Commerce', 6.0, 13.0, ARRAY['Barat'], 'Ruko', 3.0, 2250000000, true, 'in_stock', 'siap_kosong', 'https://maps.google.com/gading022', ARRAY['Gading Serpong'], 'J-022'),
  ('Hunian Gading Serpong 023', 'Gading Serpong Residence', 8.5, 17.5, ARRAY['Selatan'], 'Villa', 2.0, 3000000000, true, 'sold_out', 'siap_huni_renovasi', NULL, ARRAY['Gading Serpong'], 'I-023'),
  ('Ruko Premium Gading Serpong 024', 'Gading Serpong Commerce', 5.5, 12.0, ARRAY['Timur'], 'Ruko', 3.0, 2150000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/gading024', ARRAY['Gading Serpong'], 'J-024'),
  ('Properti Gading Serpong 025', 'Gading Serpong Residence', 10.0, 20.0, ARRAY['Barat','Utara'], 'Villa', 2.0, 3600000000, false, 'in_stock', 'siap_kosong', 'https://maps.google.com/gading025', ARRAY['Gading Serpong'], 'I-025'),

  -- Additional mixed properties for variety
  ('Rumah BSD Mixed 026', NULL, 7.0, 14.0, ARRAY['Timur'], 'Villa', 2.0, 2000000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/mixed026', ARRAY['BSD'], 'A-026'),
  ('Ruko Alam Sutera Mixed 027', NULL, 5.0, 11.0, ARRAY['Selatan'], 'Ruko', 3.0, 1600000000, true, 'in_stock', 'siap_huni_renovasi', NULL, ARRAY['Alam Sutera'], 'D-027'),
  ('Hunian Serpong Mixed 028', NULL, 8.0, 16.0, ARRAY['Utara'], 'Villa', 2.0, 2500000000, true, 'sold_out', 'siap_kosong', 'https://maps.google.com/mixed028', ARRAY['Serpong'], 'E-028'),
  ('Ruko Tangerang Mixed 029', NULL, 6.0, 13.0, ARRAY['Barat'], 'Ruko', 3.0, 2000000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/mixed029', ARRAY['Tangerang'], 'H-029'),
  ('Properti Gading Mixed 030', NULL, 9.0, 18.0, ARRAY['Selatan'], 'Villa', 2.0, 3200000000, true, 'in_stock', 'siap_huni_renovasi', NULL, ARRAY['Gading Serpong'], 'I-030'),
  ('Rumah BSD 031', 'BSD Premium', 8.0, 16.0, ARRAY['Timur'], 'Villa', 2.0, 2400000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/bsd031', ARRAY['BSD'], 'A-031'),
  ('Ruko Alam Sutera 032', 'Alam Sutera Commerce', 5.5, 12.5, ARRAY['Utara'], 'Ruko', 3.0, 2050000000, true, 'in_stock', 'siap_kosong', 'https://maps.google.com/as032', ARRAY['Alam Sutera'], 'D-032'),
  ('Hunian Serpong 033', 'Serpong Indah', 7.5, 15.0, ARRAY['Barat'], 'Villa', 2.0, 2350000000, true, 'sold_out', 'siap_huni_renovasi', NULL, ARRAY['Serpong'], 'E-033'),
  ('Ruko Tangerang 034', 'Tangerang Commerce', 6.5, 14.0, ARRAY['Selatan'], 'Ruko', 3.0, 2100000000, false, 'in_stock', 'siap_huni', 'https://maps.google.com/tangerang034', ARRAY['Tangerang'], 'H-034'),
  ('Properti Gading 035', 'Gading Serpong Residence', 9.5, 19.0, ARRAY['Timur'], 'Villa', 2.0, 3350000000, true, 'in_stock', 'siap_kosong', 'https://maps.google.com/gading035', ARRAY['Gading Serpong'], 'I-035'),
  ('Rumah BSD 036', NULL, 7.0, 14.0, ARRAY['Utara'], 'Villa', 2.0, 2150000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/bsd036', ARRAY['BSD'], 'A-036'),
  ('Ruko Alam Sutera 037', NULL, 5.5, 13.0, ARRAY['Selatan'], 'Ruko', 3.0, 1900000000, true, 'in_stock', 'siap_huni_renovasi', NULL, ARRAY['Alam Sutera'], 'D-037'),
  ('Hunian Serpong 038', NULL, 8.5, 17.0, ARRAY['Barat'], 'Villa', 2.0, 2650000000, true, 'sold_out', 'siap_kosong', 'https://maps.google.com/serpong038', ARRAY['Serpong'], 'E-038'),
  ('Ruko Tangerang 039', NULL, 6.0, 12.5, ARRAY['Timur'], 'Ruko', 3.0, 1850000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/tangerang039', ARRAY['Tangerang'], 'H-039'),
  ('Properti Gading 040', NULL, 10.0, 20.0, ARRAY['Utara','Selatan'], 'Villa', 2.0, 3500000000, true, 'in_stock', 'siap_huni_renovasi', NULL, ARRAY['Gading Serpong'], 'I-040'),
  ('Rumah BSD 041', 'BSD Premium', 8.5, 16.5, ARRAY['Selatan'], 'Villa', 2.0, 2550000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/bsd041', ARRAY['BSD'], 'A-041'),
  ('Ruko Alam Sutera 042', 'Alam Sutera Commerce', 6.0, 13.5, ARRAY['Barat'], 'Ruko', 3.0, 2150000000, true, 'in_stock', 'siap_kosong', 'https://maps.google.com/as042', ARRAY['Alam Sutera'], 'D-042'),
  ('Hunian Serpong 043', 'Serpong Indah', 7.5, 15.5, ARRAY['Timur'], 'Villa', 2.0, 2450000000, false, 'sold_out', 'siap_huni_renovasi', NULL, ARRAY['Serpong'], 'E-043'),
  ('Ruko Tangerang 044', 'Tangerang Commerce', 5.5, 12.0, ARRAY['Utara'], 'Ruko', 3.0, 1950000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/tangerang044', ARRAY['Tangerang'], 'H-044'),
  ('Properti Gading 045', 'Gading Serpong Residence', 9.5, 18.5, ARRAY['Selatan'], 'Villa', 2.0, 3250000000, true, 'in_stock', 'siap_kosong', 'https://maps.google.com/gading045', ARRAY['Gading Serpong'], 'I-045'),
  ('Rumah BSD 046', NULL, 7.5, 15.0, ARRAY['Barat'], 'Villa', 2.0, 2200000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/bsd046', ARRAY['BSD'], 'A-046'),
  ('Ruko Alam Sutera 047', NULL, 5.5, 12.5, ARRAY['Timur'], 'Ruko', 3.0, 1800000000, true, 'in_stock', 'siap_huni_renovasi', NULL, ARRAY['Alam Sutera'], 'D-047'),
  ('Hunian Serpong 048', NULL, 8.0, 16.5, ARRAY['Selatan'], 'Villa', 2.0, 2550000000, true, 'sold_out', 'siap_kosong', 'https://maps.google.com/serpong048', ARRAY['Serpong'], 'E-048'),
  ('Ruko Tangerang 049', NULL, 6.5, 14.0, ARRAY['Utara'], 'Ruko', 3.0, 2050000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/tangerang049', ARRAY['Tangerang'], 'H-049'),
  ('Properti Gading 050', NULL, 9.0, 18.0, ARRAY['Barat','Timur'], 'Villa', 2.0, 3100000000, true, 'in_stock', 'siap_huni_renovasi', NULL, ARRAY['Gading Serpong'], 'I-050'),
  ('Rumah BSD 051', 'BSD Residence', 8.0, 15.5, ARRAY['Timur'], 'Villa', 2.0, 2300000000, true, 'in_stock', 'siap_huni', 'https://maps.google.com/bsd051', ARRAY['BSD'], 'A-051'),
  ('Ruko Alam Sutera 052', 'Alam Sutera Premium', 6.0, 13.0, ARRAY['Selatan'], 'Ruko', 3.0, 2100000000, true, 'in_stock', 'siap_kosong', 'https://maps.google.com/as052', ARRAY['Alam Sutera'], 'D-052')
) AS property_data(nama_property, group_name, lebar, panjang, hadap, tipe, tingkat, price, carport, status, siap, maps_link, kawasan, unit),
admin_id;
