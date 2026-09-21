-- Update Seed Data for Badeelak

-- 1. المطهرات المعوية (Nifuroxazide 200mg)
INSERT INTO active_ingredients (id, name, usage) VALUES ('33333333-3333-3333-3333-333333333333', 'Nifuroxazide 200mg', 'مطهر معوي وعلاج للإسهال') ON CONFLICT DO NOTHING;
INSERT INTO medicines (trade_name_ar, trade_name_en, ingredient_id, concentration, price, company, is_local) VALUES
  ('أنتينال', 'Antinal', '33333333-3333-3333-3333-333333333333', '200mg', 21.00, 'Amoun', true),
  ('دروتازيد', 'Drotazide', '33333333-3333-3333-3333-333333333333', '200mg', 15.00, 'Marcryl', true),
  ('دياكس', 'Diax', '33333333-3333-3333-3333-333333333333', '200mg', 10.50, 'Sedico', true);

-- 2. مسكنات وخوافض الحرارة (Paracetamol 500mg) - Adding to existing ingredient if not fully populated
INSERT INTO medicines (trade_name_ar, trade_name_en, ingredient_id, concentration, price, company, is_local) VALUES
  ('أبيمول', 'Abimol', '11111111-1111-1111-1111-111111111111', '500mg', 8.00, 'GSK', false),
  ('بارامول', 'Paramol', '11111111-1111-1111-1111-111111111111', '500mg', 13.50, 'Misr', true);

-- 3. مسكنات الالتهابات والمفاصل (Diclofenac Potassium 50mg)
INSERT INTO active_ingredients (id, name, usage) VALUES ('44444444-4444-4444-4444-444444444444', 'Diclofenac Potassium 50mg', 'مسكن للآلام ومضاد للالتهابات') ON CONFLICT DO NOTHING;
INSERT INTO medicines (trade_name_ar, trade_name_en, ingredient_id, concentration, price, company, is_local) VALUES
  ('كاتافلام', 'Cataflam', '44444444-4444-4444-4444-444444444444', '50mg', 33.00, 'Novartis', false),
  ('فولتارين', 'Voltaren', '44444444-4444-4444-4444-444444444444', '50mg', 25.50, 'Novartis', false),
  ('كلوفاست', 'Clofast', '44444444-4444-4444-4444-444444444444', '50mg', 18.00, 'Mac', true),
  ('ديكلوفين', 'Declophen', '44444444-4444-4444-4444-444444444444', '50mg', 14.50, 'Pharco', true);

-- 4. مضادات الحموضة والمعدة (Omeprazole 20mg)
INSERT INTO active_ingredients (id, name, usage) VALUES ('55555555-5555-5555-5555-555555555555', 'Omeprazole 20mg', 'علاج الحموضة وقرحة المعدة') ON CONFLICT DO NOTHING;
INSERT INTO medicines (trade_name_ar, trade_name_en, ingredient_id, concentration, price, company, is_local) VALUES
  ('لوزك', 'Losec', '55555555-5555-5555-5555-555555555555', '20mg', 85.00, 'AstraZeneca', false),
  ('جاسترازول', 'Gastrazole', '55555555-5555-5555-5555-555555555555', '20mg', 35.00, 'Amoun', true),
  ('أوميز', 'Omez', '55555555-5555-5555-5555-555555555555', '20mg', 24.50, 'Pharco', true),
  ('هايبوسيك', 'Hyposec', '55555555-5555-5555-5555-555555555555', '20mg', 28.00, 'Medical Union', true);

-- 5. أدوية الحساسية (Cetirizine 10mg)
INSERT INTO active_ingredients (id, name, usage) VALUES ('66666666-6666-6666-6666-666666666666', 'Cetirizine 10mg', 'مضاد للحساسية والتهابات الجيوب الأنفية') ON CONFLICT DO NOTHING;
INSERT INTO medicines (trade_name_ar, trade_name_en, ingredient_id, concentration, price, company, is_local) VALUES
  ('زيرتك', 'Zyrtec', '66666666-6666-6666-6666-666666666666', '10mg', 39.75, 'GSK', false),
  ('سيتراك', 'Cetrak', '66666666-6666-6666-6666-666666666666', '10mg', 18.00, 'Amoun', true),
  ('هيستازين', 'Histazine', '66666666-6666-6666-6666-666666666666', '10mg', 14.50, 'Pharco', true);

-- 6. أدوية الضغط وتنظيم النبض (Bisoprolol 5mg) - Adding to existing ingredient
INSERT INTO medicines (trade_name_ar, trade_name_en, ingredient_id, concentration, price, company, is_local) VALUES
  ('بيسولوك', 'Bisoloc', '22222222-2222-2222-2222-222222222222', '5mg', 30.00, 'Spima', true),
  ('لودوز', 'Lodoz', '22222222-2222-2222-2222-222222222222', '5mg', 45.00, 'Merck', false);

-- 7. المضادات الحيوية (Amoxicillin/Clavulanic 1g)
INSERT INTO active_ingredients (id, name, usage) VALUES ('77777777-7777-7777-7777-777777777777', 'Amoxicillin/Clavulanic 1g', 'مضاد حيوي واسع المجال') ON CONFLICT DO NOTHING;
INSERT INTO medicines (trade_name_ar, trade_name_en, ingredient_id, concentration, price, company, is_local) VALUES
  ('أوجمنتين', 'Augmentin', '77777777-7777-7777-7777-777777777777', '1g', 89.75, 'GSK', false),
  ('هاي بيوتك', 'Hibiotic', '77777777-7777-7777-7777-777777777777', '1g', 75.00, 'Amoun', true),
  ('ميجاموكس', 'Megamox', '77777777-7777-7777-7777-777777777777', '1g', 60.00, 'Julphar', true),
  ('كيورام', 'Curam', '77777777-7777-7777-7777-777777777777', '1g', 76.00, 'Sandoz', false);

-- 8. أدوية الكوليسترول (Atorvastatin 20mg)
INSERT INTO active_ingredients (id, name, usage) VALUES ('88888888-8888-8888-8888-888888888888', 'Atorvastatin 20mg', 'علاج ارتفاع الكوليسترول والدهون الثلاثية') ON CONFLICT DO NOTHING;
INSERT INTO medicines (trade_name_ar, trade_name_en, ingredient_id, concentration, price, company, is_local) VALUES
  ('ليبيتور', 'Lipitor', '88888888-8888-8888-8888-888888888888', '20mg', 120.00, 'Pfizer', false),
  ('أتور', 'Ator', '88888888-8888-8888-8888-888888888888', '20mg', 52.00, 'EPICO', true),
  ('أتورستات', 'Atorstat', '88888888-8888-8888-8888-888888888888', '20mg', 45.00, 'Delta', true);
