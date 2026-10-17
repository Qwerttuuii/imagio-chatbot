-- =====================================================================
-- Imagio chatbot: catalog seed (generated from Imagio_Living_Retail.xlsx)
-- Put this file in: supabase/migrations/20261015000100_seed_catalog.sql
-- Run AFTER the schema migration:  npx supabase db push
-- Safe to re-run: products/variants are upserted by slug, and the
-- 'catalog-rules-*' knowledge base entries are replaced.
-- Poudre Linen (oil + room spray) is inserted as inactive until its
-- details are confirmed.
-- =====================================================================

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('maxi-diffuser', null, 'diffuser_machine', 'Maxi Diffuser', 'Maxi Diffuser: Electricity powered, Tuya app (Bluetooth)', 'Flagship high-capacity diffuser designed for large and open-plan spaces, covering up to 3,000 m². Ultra-silent operation with full app control.', 565000, '{"power_source": "Electricity powered", "control": "Tuya app (Bluetooth)", "mounting": "Free standing", "tank_capacity_ml": 1000, "weight_kg": 5.9, "coverage_m2": 3000, "noise_level": "Ultra silent", "atomization": "Nano atomization", "colour": "Black", "is_car_diffuser": false, "complimentary_oil": "1 × 250ml fragrance oil (customer''s choice)", "complimentary_oil_size_ml": 250}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('box-diffuser', null, 'diffuser_machine', 'Box Diffuser', 'Box Diffuser: Electricity powered, Tuya app (Bluetooth)', 'Powerful, space-efficient diffuser covering up to 1,000 m². Ultra-silent operation with app control, suited to wall mounting or free-standing placement.', 430000, '{"power_source": "Electricity powered", "control": "Tuya app (Bluetooth)", "mounting": "Wall mounted / Free standing", "tank_capacity_ml": 1000, "weight_kg": 3.9, "coverage_m2": 1000, "noise_level": "Ultra silent", "atomization": "Nano atomization", "colour": "Black", "is_car_diffuser": false, "complimentary_oil": "1 × 250ml fragrance oil (customer''s choice)", "complimentary_oil_size_ml": 250}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('flute-diffuser', null, 'diffuser_machine', 'Flute Diffuser', 'Flute Diffuser: Battery & Electricity powered, Tuya app (Bluetooth)', 'Slim, elegant silver diffuser covering up to 300 m². Operates on battery or mains power, with ultra-silent performance and app control.', 330000, '{"power_source": "Battery & Electricity powered", "control": "Tuya app (Bluetooth)", "mounting": "Free standing", "tank_capacity_ml": 150, "weight_kg": 1.5, "coverage_m2": 300, "noise_level": "Ultra silent", "atomization": "Nano atomization", "colour": "Silver", "is_car_diffuser": false, "complimentary_oil": "1 × 250ml fragrance oil (customer''s choice)", "complimentary_oil_size_ml": 250}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('midi-diffuser', null, 'diffuser_machine', 'Midi Diffuser', 'Midi Diffuser: Battery & Electricity powered, Tuya app (Bluetooth)', 'Lightweight, compact diffuser covering up to 300 m². Operates on battery or mains power, with ultra-silent performance and app control.', 265000, '{"power_source": "Battery & Electricity powered", "control": "Tuya app (Bluetooth)", "mounting": "Free standing", "tank_capacity_ml": 110, "weight_kg": 0.82, "coverage_m2": 300, "noise_level": "Ultra silent", "atomization": "Nano atomization", "colour": "Black", "is_car_diffuser": false, "complimentary_oil": "1 × 250ml fragrance oil (customer''s choice)", "complimentary_oil_size_ml": 250}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('mini-diffuser', null, 'diffuser_machine', 'Mini Diffuser', 'Mini Diffuser: Inbuilt battery, Button touch', 'Entry-level diffuser for smaller spaces up to 150 m². Ultra-silent, with an inbuilt battery and simple one-touch operation.', 97000, '{"power_source": "Inbuilt battery", "control": "Button touch", "mounting": "Free standing", "tank_capacity_ml": 15, "weight_kg": 0.5, "coverage_m2": 150, "noise_level": "Ultra silent", "atomization": "Nano atomization", "colour": "Black", "is_car_diffuser": false, "complimentary_oil": "1 × 10ml fragrance oil (customer''s choice)", "complimentary_oil_size_ml": 10}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('intelligent-care-diffuser', null, 'diffuser_machine', 'Intelligent Care Diffuser', 'Intelligent Care Diffuser: Rechargeable, Power button (no app)', 'Rechargeable smart car diffuser affixed to the car''s AC vent. Its motion sensor starts it automatically once the car is in motion. Operated with a power button (no app). Comes with 3 bottles of its own special fragrance (not oil-based).', 45000, '{"power_source": "Rechargeable", "control": "Power button (no app)", "mounting": "Affixed to the car''s AC vent", "tank_capacity_ml": 10, "coverage_text": "Car interior", "is_car_diffuser": true, "complimentary_oil": "3 bottles of its own special fragrance (not oil-based). The standard complimentary fragrance oil does not apply to this model."}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('anti-mosquito-fragrance-oil', null, 'fragrance_oil', 'Anti-Mosquito Fragrance Oil', 'Anti-Mosquito fragrance oil', 'Designed for outdoor use to repel insects while maintaining a clean scent.', 75000, '{"fragrance": "Anti-Mosquito", "best_for": "Outdoor use (insect repellent)", "sizes_available": ["250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 0 from public.products where slug = 'anti-mosquito-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('aventus-fragrance-oil', null, 'fragrance_oil', 'Aventus Fragrance Oil', 'Aventus fragrance oil', 'A sophisticated, confident fragrance inspired by the Creed Aventus profile. A fresh opening of bergamot, blackcurrant, apple and pineapple leads into a smoky floral heart, settling into a warm base of musk, oakmoss, ambergris and vanilla.', 30000, '{"fragrance": "Aventus", "top_notes": ["Bergamot", "Blackcurrant", "Apple", "Pineapple"], "heart_notes": ["Jasmine", "Birch", "Patchouli"], "base_notes": ["Musk", "Oakmoss", "Ambergris", "Vanilla"], "best_for": "Homes, offices and retail spaces", "sizes_available": ["100ml", "250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '100ml', 30000, '{}'::jsonb, 0 from public.products where slug = 'aventus-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 1 from public.products where slug = 'aventus-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('bacarat-fragrance-oil', null, 'fragrance_oil', 'Bacarat Fragrance Oil', 'Bacarat fragrance oil', 'Intense and distinctive fragrance with a luxurious character.', 10000, '{"fragrance": "Bacarat", "top_notes": ["Red Saffron", "Jasmine"], "heart_notes": ["Amber"], "base_notes": ["Cedar"], "best_for": "Light room fragrancing", "sizes_available": ["10ml", "100ml", "250ml", "500ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi", "mini"], "complimentary_eligibility": "All machines (250ml for Maxi, Box, Flute, Midi; 10ml for Mini)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '10ml', 10000, '{}'::jsonb, 0 from public.products where slug = 'bacarat-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '100ml', 30000, '{}'::jsonb, 1 from public.products where slug = 'bacarat-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 2 from public.products where slug = 'bacarat-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '500ml', 140000, '{}'::jsonb, 3 from public.products where slug = 'bacarat-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('black-oud-fragrance-oil', null, 'fragrance_oil', 'Black Oud Fragrance Oil', 'Black Oud fragrance oil', 'Deep, intense and woody fragrance blending oud and amber.', 30000, '{"fragrance": "Black Oud", "top_notes": ["Oud"], "heart_notes": ["Cedar", "Pine"], "base_notes": ["Yellow Amber"], "best_for": "Ambient scenting", "sizes_available": ["100ml", "250ml", "500ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '100ml', 30000, '{}'::jsonb, 0 from public.products where slug = 'black-oud-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 1 from public.products where slug = 'black-oud-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '500ml', 140000, '{}'::jsonb, 2 from public.products where slug = 'black-oud-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('black-vanilla-fragrance-oil', null, 'fragrance_oil', 'Black Vanilla Fragrance Oil', 'Black Vanilla fragrance oil', 'Sweet and spicy scent with rich warmth.', 30000, '{"fragrance": "Black Vanilla", "top_notes": ["Cardamom"], "heart_notes": ["Turmeric", "Vanilla"], "base_notes": ["Saffron", "Ginger"], "best_for": "Ambient scenting", "sizes_available": ["100ml", "250ml", "500ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '100ml', 30000, '{}'::jsonb, 0 from public.products where slug = 'black-vanilla-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 1 from public.products where slug = 'black-vanilla-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '500ml', 140000, '{}'::jsonb, 2 from public.products where slug = 'black-vanilla-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('blue-fico-fragrance-oil', null, 'fragrance_oil', 'Blue Fico Fragrance Oil', 'Blue Fico fragrance oil', 'Fresh citrus and fig fragrance that adds a garden-like, uplifting feel.', 10000, '{"fragrance": "Blue Fico", "top_notes": ["Orange", "Lemon"], "heart_notes": ["Fig"], "base_notes": ["Bergamot"], "best_for": "Uplifting, fresh spaces", "sizes_available": ["10ml", "100ml", "250ml", "500ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi", "mini"], "complimentary_eligibility": "All machines (250ml for Maxi, Box, Flute, Midi; 10ml for Mini)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '10ml', 10000, '{}'::jsonb, 0 from public.products where slug = 'blue-fico-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '100ml', 30000, '{}'::jsonb, 1 from public.products where slug = 'blue-fico-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 2 from public.products where slug = 'blue-fico-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '500ml', 140000, '{}'::jsonb, 3 from public.products where slug = 'blue-fico-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('caramel-coffee-fragrance-oil', null, 'fragrance_oil', 'Caramel Coffee Fragrance Oil', 'Caramel Coffee fragrance oil', 'A warm, indulgent gourmand blend of rich roasted coffee and smooth caramel, finished with subtle spice.', 75000, '{"fragrance": "Caramel Coffee", "top_notes": ["Roasted Coffee"], "heart_notes": ["Caramel"], "base_notes": ["Warm Spice"], "best_for": "Cozy ambient spaces", "sizes_available": ["250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 0 from public.products where slug = 'caramel-coffee-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('fresh-linen-fragrance-oil', null, 'fragrance_oil', 'Fresh Linen Fragrance Oil', 'Fresh Linen fragrance oil', 'Clean, fresh scent that evokes laundry freshness.', 75000, '{"fragrance": "Fresh Linen", "top_notes": ["Powder"], "heart_notes": ["Chamomile"], "base_notes": ["Bergamot", "Cardamom"], "best_for": "Room fragrancing", "sizes_available": ["250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 0 from public.products where slug = 'fresh-linen-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('hibiscus-fragrance-oil', null, 'fragrance_oil', 'Hibiscus Fragrance Oil', 'Hibiscus fragrance oil', 'A vibrant fragrance where floral and sweet notes meet.', 10000, '{"fragrance": "Hibiscus", "top_notes": ["Hibiscus"], "heart_notes": ["Bergamot", "Ylang Ylang"], "base_notes": ["Caramel"], "best_for": "Offices, shops and homes", "sizes_available": ["10ml", "250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi", "mini"], "complimentary_eligibility": "All machines (250ml for Maxi, Box, Flute, Midi; 10ml for Mini)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '10ml', 10000, '{}'::jsonb, 0 from public.products where slug = 'hibiscus-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 1 from public.products where slug = 'hibiscus-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('mad-amber-fragrance-oil', null, 'fragrance_oil', 'Mad Amber Fragrance Oil', 'Mad Amber fragrance oil', 'Rich woody scent dominated by warm amber notes.', 10000, '{"fragrance": "Mad Amber", "top_notes": ["Amber", "Vanilla"], "heart_notes": ["Cedar", "Pine"], "base_notes": ["Sandalwood"], "best_for": "Ambient scenting", "sizes_available": ["10ml", "100ml", "250ml", "500ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi", "mini"], "complimentary_eligibility": "All machines (250ml for Maxi, Box, Flute, Midi; 10ml for Mini)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '10ml', 10000, '{}'::jsonb, 0 from public.products where slug = 'mad-amber-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '100ml', 30000, '{}'::jsonb, 1 from public.products where slug = 'mad-amber-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 2 from public.products where slug = 'mad-amber-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '500ml', 140000, '{}'::jsonb, 3 from public.products where slug = 'mad-amber-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('night-woods-fragrance-oil', null, 'fragrance_oil', 'Night Woods Fragrance Oil', 'Night Woods fragrance oil', 'A deep, woody fragrance with floral highlights.', 75000, '{"fragrance": "Night Woods", "top_notes": ["Jasmine", "Okoye Wood"], "heart_notes": ["Cedar", "Sandalwood"], "best_for": "Evening ambiance", "sizes_available": ["250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 0 from public.products where slug = 'night-woods-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('odour-eliminator-fragrance-oil', null, 'fragrance_oil', 'Odour Eliminator Fragrance Oil', 'Odour Eliminator fragrance oil', 'A fresh, clean fragrance formulated to neutralise unpleasant odours. Crisp citrus and eucalyptus lift the air, softened by lavender and jasmine over a light vetiver base.', 75000, '{"fragrance": "Odour Eliminator", "top_notes": ["Lemon", "Eucalyptus"], "heart_notes": ["Lavender", "Jasmine"], "base_notes": ["Vetiver"], "best_for": "Toilets, bathrooms and odour-prone areas", "sizes_available": ["250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 0 from public.products where slug = 'odour-eliminator-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('oriental-musk-fragrance-oil', null, 'fragrance_oil', 'Oriental Musk Fragrance Oil', 'Oriental Musk fragrance oil', 'A smooth, sensual musk fragrance with a warm, enveloping character.', 75000, '{"fragrance": "Oriental Musk", "heart_notes": ["Musk"], "base_notes": ["Warm Musk"], "best_for": "Homes, offices and retail spaces", "sizes_available": ["250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 0 from public.products where slug = 'oriental-musk-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('oxygen-fragrance-oil', null, 'fragrance_oil', 'Oxygen Fragrance Oil', 'Oxygen fragrance oil', 'Clean, hygienic scent with fresh citrus notes.', 10000, '{"fragrance": "Oxygen", "top_notes": ["Lemon", "Bergamot"], "heart_notes": ["Iris Flower"], "base_notes": ["Ylang Ylang"], "best_for": "Offices and clean spaces", "sizes_available": ["10ml", "100ml", "250ml", "500ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi", "mini"], "complimentary_eligibility": "All machines (250ml for Maxi, Box, Flute, Midi; 10ml for Mini)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '10ml', 10000, '{}'::jsonb, 0 from public.products where slug = 'oxygen-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '100ml', 30000, '{}'::jsonb, 1 from public.products where slug = 'oxygen-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 2 from public.products where slug = 'oxygen-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '500ml', 140000, '{}'::jsonb, 3 from public.products where slug = 'oxygen-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('poudre-linen-fragrance-oil', null, 'fragrance_oil', 'Poudre Linen Fragrance Oil', 'Poudre Linen fragrance oil', null, 75000, '{"fragrance": "Poudre Linen", "sizes_available": ["250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, false)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 0 from public.products where slug = 'poudre-linen-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('pumpkin-spice-fragrance-oil', null, 'fragrance_oil', 'Pumpkin Spice Fragrance Oil', 'Pumpkin Spice fragrance oil', 'Warm, cozy fragrance with sweet spices and nostalgic autumn tones.', 75000, '{"fragrance": "Pumpkin Spice", "top_notes": ["Pumpkin"], "heart_notes": ["Cinnamon", "Orange"], "base_notes": ["Coconut", "Caramel"], "best_for": "Cozy, seasonal ambiance", "sizes_available": ["250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 0 from public.products where slug = 'pumpkin-spice-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('red-sequoia-fragrance-oil', null, 'fragrance_oil', 'Red Sequoia Fragrance Oil', 'Red Sequoia fragrance oil', 'A rich, earthy blend of warm woods and spice with a bold, grounded character.', 75000, '{"fragrance": "Red Sequoia", "top_notes": ["Warm Spice"], "heart_notes": ["Red Sequoia Wood"], "base_notes": ["Dry Woods"], "best_for": "Homes, offices and lounges", "sizes_available": ["250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 0 from public.products where slug = 'red-sequoia-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('sandalwood-fragrance-oil', null, 'fragrance_oil', 'Sandalwood Fragrance Oil', 'Sandalwood fragrance oil', 'Warm, creamy and smooth woody scent with slightly sweet undertones.', 10000, '{"fragrance": "Sandalwood", "top_notes": ["Sandalwood", "Cedar"], "heart_notes": ["Redwood"], "base_notes": ["Basil", "Patchouli"], "best_for": "Living rooms, offices and retail spaces", "sizes_available": ["10ml", "100ml", "250ml", "500ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi", "mini"], "complimentary_eligibility": "All machines (250ml for Maxi, Box, Flute, Midi; 10ml for Mini)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '10ml', 10000, '{}'::jsonb, 0 from public.products where slug = 'sandalwood-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '100ml', 30000, '{}'::jsonb, 1 from public.products where slug = 'sandalwood-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 2 from public.products where slug = 'sandalwood-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '500ml', 140000, '{}'::jsonb, 3 from public.products where slug = 'sandalwood-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('snow-fig-fragrance-oil', null, 'fragrance_oil', 'Snow Fig Fragrance Oil', 'Snow Fig fragrance oil', 'Fresh, elegant fragrance with fruity, floral and light woody touches. Creates a relaxing and refined atmosphere.', 10000, '{"fragrance": "Snow Fig", "top_notes": ["Sandalwood", "Papyrus"], "heart_notes": ["Amber"], "base_notes": ["Fig Tree", "Cardamom"], "best_for": "Relaxing, refined ambiance", "sizes_available": ["10ml", "100ml", "250ml", "500ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi", "mini"], "complimentary_eligibility": "All machines (250ml for Maxi, Box, Flute, Midi; 10ml for Mini)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '10ml', 10000, '{}'::jsonb, 0 from public.products where slug = 'snow-fig-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '100ml', 30000, '{}'::jsonb, 1 from public.products where slug = 'snow-fig-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 2 from public.products where slug = 'snow-fig-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '500ml', 140000, '{}'::jsonb, 3 from public.products where slug = 'snow-fig-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('sweet-woods-fragrance-oil', null, 'fragrance_oil', 'Sweet Woods Fragrance Oil', 'Sweet Woods fragrance oil', 'A blend of woody and sweet notes.', 75000, '{"fragrance": "Sweet Woods", "top_notes": ["Honey", "Cedarwood"], "heart_notes": ["Tonka Bean", "Bergamot"], "base_notes": ["Caramel"], "best_for": "Ambient fragrancing", "sizes_available": ["250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 0 from public.products where slug = 'sweet-woods-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('tobacco-fragrance-oil', null, 'fragrance_oil', 'Tobacco Fragrance Oil', 'Tobacco fragrance oil', 'A warm, distinguished blend of tobacco leaf and spice with a rich, comforting depth.', 75000, '{"fragrance": "Tobacco", "top_notes": ["Warm Spice"], "heart_notes": ["Tobacco Leaf"], "base_notes": ["Tobacco"], "best_for": "Lounges, offices and evening ambiance", "sizes_available": ["250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 0 from public.products where slug = 'tobacco-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('tonka-fragrance-oil', null, 'fragrance_oil', 'Tonka Fragrance Oil', 'Tonka fragrance oil', 'Warm and comforting scent blending tonka and sandalwood.', 30000, '{"fragrance": "Tonka", "top_notes": ["Tonka"], "heart_notes": ["Sandalwood"], "base_notes": ["Guaiac Wood"], "best_for": "Ambient scenting", "sizes_available": ["100ml", "250ml", "500ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '100ml', 30000, '{}'::jsonb, 0 from public.products where slug = 'tonka-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 1 from public.products where slug = 'tonka-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '500ml', 140000, '{}'::jsonb, 2 from public.products where slug = 'tonka-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('vanilla-lux-fragrance-oil', null, 'fragrance_oil', 'Vanilla Lux Fragrance Oil', 'Vanilla Lux fragrance oil', 'Very intense vanilla-based fragrance with warm, rich sweetness.', 10000, '{"fragrance": "Vanilla Lux", "top_notes": ["Vanilla"], "heart_notes": ["Sandalwood"], "base_notes": ["Caramel", "Pomegranate"], "best_for": "Ambient scenting", "sizes_available": ["10ml", "100ml", "250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi", "mini"], "complimentary_eligibility": "All machines (250ml for Maxi, Box, Flute, Midi; 10ml for Mini)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '10ml', 10000, '{}'::jsonb, 0 from public.products where slug = 'vanilla-lux-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '100ml', 30000, '{}'::jsonb, 1 from public.products where slug = 'vanilla-lux-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 2 from public.products where slug = 'vanilla-lux-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('white-tea-fragrance-oil', null, 'fragrance_oil', 'White Tea Fragrance Oil', 'White Tea fragrance oil', 'Light, fresh fragrance.', 75000, '{"fragrance": "White Tea", "top_notes": ["White Tea"], "heart_notes": ["Lemon"], "base_notes": ["Bergamot", "Ylang Ylang"], "best_for": "Room sprays and room fragrances", "sizes_available": ["250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 0 from public.products where slug = 'white-tea-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('yellow-peach-fragrance-oil', null, 'fragrance_oil', 'Yellow Peach Fragrance Oil', 'Yellow Peach fragrance oil', 'Sweet, fruity fragrance with strong peach aroma. Ideal for summer ambient scenting and candle production.', 75000, '{"fragrance": "Yellow Peach", "top_notes": ["Peach"], "heart_notes": ["Vanilla"], "base_notes": ["Musk"], "best_for": "Summer ambient scenting and candles", "sizes_available": ["250ml"], "complimentary_for_machines": ["maxi", "box", "flute", "midi"], "complimentary_eligibility": "Maxi, Box, Flute, Midi (250ml)"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '250ml', 75000, '{}'::jsonb, 0 from public.products where slug = 'yellow-peach-fragrance-oil'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('crest-semi-orthopedic-mattress', 'ST845', 'mattress', 'Crest Semi-Orthopedic Mattress', 'Semi-Orthopedic, medium, 25cm', 'A balanced semi-orthopedic mattress pairing a high-density foam base with 1.9mm pocket springs and a plush quilted knit top. Delivers dependable, even support with everyday comfort.', 650000, '{"model": "Crest", "code": "ST845", "orthopedic_type": "Semi-Orthopedic", "firmness": "Medium", "firmness_rank": 2, "height_cm": 25, "key_features": ["High-density hard foam (D3060) support layer", "Pocket springs (1.9mm) in a 7cm foam box", "cm quilting foam comfort layer", "Cotton padding and 3D fabric base", "cm profile"], "recommended_for": "Sleepers who want a balanced, medium feel with reliable all-round support.", "sleep_positions": "Back, Side and Stomach sleepers", "compatible_frames": "Foundation, Slatted Platform, Box Spring", "layers": ["High quality knitted fabric", "Polyfiber padding", "cm quilting foam (D2030)", "Non-woven fabric", "cm high density hard foam (D3060)", "Cotton padding", "Pocket spring (1.9mm) with 7cm foam box", "Cotton padding", "cm quilting foam", "Polyfiber pad", "D fabric"]}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '5x6.7 ft', 650000, '{"size_cm": "152cm × 200cm"}'::jsonb, 0 from public.products where slug = 'crest-semi-orthopedic-mattress'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '6x7 ft', 770000, '{"size_cm": "180cm × 210cm"}'::jsonb, 1 from public.products where slug = 'crest-semi-orthopedic-mattress'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('nova-semi-orthopedic-mattress', 'ST847', 'mattress', 'Nova Semi-Orthopedic Mattress', 'Semi-Orthopedic, medium soft, 30cm', 'A medium-soft semi-orthopedic mattress designed for cool, cushioned comfort. Air gel memory foam, bamboo charcoal foam and a 5-zone pocket spring system sit beneath an icy cooling knitted cover.', 850000, '{"model": "Nova", "code": "ST847", "orthopedic_type": "Semi-Orthopedic", "firmness": "Medium soft", "firmness_rank": 1, "height_cm": 30, "key_features": ["Icy cooling knitted fabric for a cooler sleep surface", "cm air gel memory foam that contours to the body", "cm bamboo charcoal foam layer", "-zone pocket springs (1.7/1.9mm) in a 7cm foam box", "cm profile"], "recommended_for": "Sleepers who prefer a soft, cushioned feel, and hot sleepers who want a cooling top.", "sleep_positions": "Back, Side and Stomach sleepers", "compatible_frames": "Foundation, Slatted Platform, Box Spring", "layers": ["High quality icy cooling knitted fabric", "Polyfiber padding", "cm high density foam", "cm high density foam", "Non-woven fabric", "cm air gel memory foam", "cm bamboo charcoal foam", "Cotton pad", "-zone pocket spring (1.7/1.9mm) with 7cm foam box", "Cotton pad", "cm quilting foam", "Polyfiber pad", "D fabric"]}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '6x6 ft', 850000, '{"size_cm": "183cm × 191cm"}'::jsonb, 0 from public.products where slug = 'nova-semi-orthopedic-mattress'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '7x7 ft', 1050000, '{"size_cm": "210cm × 210cm"}'::jsonb, 1 from public.products where slug = 'nova-semi-orthopedic-mattress'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('luna-full-orthopedic-mattress', 'ST806', 'mattress', 'Luna Full-Orthopedic Mattress', 'Full-Orthopedic, medium firm, 30cm', 'A medium-firm full-orthopedic mattress built for targeted, supportive sleep. A 3-zone pocket spring system, 5cm hard foam layer and convoluted foam top combine firm support with pressure-relieving comfort.', 890000, '{"model": "Luna", "code": "ST806", "orthopedic_type": "Full-Orthopedic", "firmness": "Medium firm", "firmness_rank": 3, "height_cm": 30, "key_features": ["-zone pocket springs (1.8/2.0mm) in a 7cm foam box", "cm hard foam support layer", "cm high density convoluted foam comfort layer", "gsm knitted fabric with 1000# polyfiber padding", "cm profile"], "recommended_for": "People with back aches, and anyone who prefers a firmer, more supportive sleep surface.", "sleep_positions": "Back, Side and Stomach sleepers", "compatible_frames": "Foundation, Slatted Platform, Box Spring", "layers": ["gsm knitted fabric", "# polyfiber padding", "cm high density convoluted foam", "cm high density foam", "Non-woven fabric", "cm hard foam", "-zone pocket spring (1.8/2.0mm) with 7cm foam box", "Cotton padding", "cm quilting foam", "Polyester fabric"]}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '6x6 ft', 890000, '{"size_cm": "183cm × 191cm"}'::jsonb, 0 from public.products where slug = 'luna-full-orthopedic-mattress'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '6x7 ft', 950000, '{"size_cm": "180cm × 210cm"}'::jsonb, 1 from public.products where slug = 'luna-full-orthopedic-mattress'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('luna-x-full-orthopedic-mattress', 'ST882', 'mattress', 'Luna-X Full-Orthopedic Mattress', 'Full-Orthopedic, firm, 30cm', 'Our firmest full-orthopedic mattress, crafted with natural latex and bamboo charcoal foam over a 20cm smart pocket spring system (2.0mm). Delivers resilient, responsive support for deep, stable sleep.', 940000, '{"model": "Luna-X", "code": "ST882", "orthopedic_type": "Full-Orthopedic", "firmness": "Firm", "firmness_rank": 4, "height_cm": 30, "key_features": ["cm natural latex layer", "cm bamboo charcoal foam layer", "cm smart pocket springs (2.0mm) with 7cm foam encasement", "cm convoluted foam and 1000# polyfiber padding", "cm profile"], "recommended_for": "People with back aches, and those who want the firmest support with a natural latex comfort layer.", "sleep_positions": "Back, Side and Stomach sleepers", "compatible_frames": "Foundation, Slatted Platform, Box Spring", "layers": ["High quality knitted fabric", "# polyfiber padding", "cm high density foam", "cm convoluted foam", "Non-woven fabric", "cm natural latex", "cm bamboo charcoal foam", "PK cotton pad", "cm smart pocket spring (2.0mm) with 7cm foam encasement", "PK cotton pad", "Non-woven fabric", "cm quilting foam", "Polyester fabric"]}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '6x6 ft', 940000, '{"size_cm": "183cm × 191cm"}'::jsonb, 0 from public.products where slug = 'luna-x-full-orthopedic-mattress'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '6x7 ft', 1000000, '{"size_cm": "183cm × 213cm"}'::jsonb, 1 from public.products where slug = 'luna-x-full-orthopedic-mattress'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.product_variants (product_id, label, price, attributes, sort_order)
select id, '7x7 ft', 1100000, '{"size_cm": "213cm × 213cm"}'::jsonb, 2 from public.products where slug = 'luna-x-full-orthopedic-mattress'
on conflict (product_id, label) do update set price = excluded.price, attributes = excluded.attributes, sort_order = excluded.sort_order;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('imagio-single-fibre-pillow', null, 'pillow', 'Imagio Single Fibre Pillow', 'Single fibre pillow', 'A soft, supportive polyester padding pillow that holds its shape and provides optimal neck support. The fibre filling can be adjusted to suit your preferred height.', 43000, '{"cover_material": "100% polyester fibre", "filling": "100% polyester fibre", "size": "Standard size", "type": "Single fibre pillow", "key_features": ["Customisable height: remove some filling for your ideal comfort", "Holds its shape for consistent neck support", "Versatile: for the bedroom and beyond"], "recommended_for": "Side, back and stomach sleepers who like a soft pillow."}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('imagio-double-fibre-pillow', null, 'pillow', 'Imagio Double Fibre Pillow', 'Double fibre pillow', 'A generously sized double-sided microfibre pillow with a plush, full fibre fill for soft, enveloping comfort.', 60000, '{"cover_material": "100% polyester fibre", "filling": "100% polyester fibre", "size": "74 × 45 × 12", "type": "Double fibre pillow", "key_features": ["Double-sided microfibre design", "% polyester fibre fabric and filling", "Generous 74 × 45 × 12cm size"], "recommended_for": "Sleepers who prefer a soft, full and plush pillow."}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('imagio-bedset-grey', null, 'bedset', 'Imagio Bedset (Grey)', 'Bedset', 'A complete bedset in refined grey, made from 100% cotton for a soft, natural feel against the skin and lasting everyday comfort.', 120000, '{"product_type": "Bedset", "colour": "Grey", "size": "Complete set", "material": "100% cotton", "recommended_for": "Anyone refreshing their bedroom with a modern, neutral look."}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('imagio-bedset-sand', null, 'bedset', 'Imagio Bedset (Sand)', 'Bedset', 'A complete bedset in a warm sand tone, made from 100% cotton for a soft, natural feel against the skin and lasting everyday comfort.', 120000, '{"product_type": "Bedset", "colour": "Sand", "size": "Complete set", "material": "100% cotton", "recommended_for": "Anyone who wants a warm, inviting bedroom look."}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('imagio-cooling-duvet', null, 'duvet', 'Imagio Cooling Duvet', 'Duvet', 'A 7 × 7 cooling duvet that helps cool your body when the weather is hot, for comfortable sleep through warm nights.', 120000, '{"product_type": "Duvet", "colour": "White", "size": "7 × 7 ft", "material": "Cooling fabric", "recommended_for": "Hot sleepers and warm weather. Pairs well with the Nova mattress."}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('white-duvet-cover-cover-only', null, 'duvet', 'White Duvet Cover (Cover Only)', 'Duvet cover', 'A crisp white premium cotton duvet cover in 7 × 7 size. Cover only; duvet insert not included.', 80000, '{"product_type": "Duvet cover", "colour": "White", "size": "7 × 7 ft", "material": "Premium cotton", "recommended_for": "Customers who already have a 7 × 7 duvet and want a fresh cover."}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('hibiscus-room-spray', null, 'room_spray', 'Hibiscus Room Spray', 'Hibiscus', 'A vibrant fragrance where floral and sweet notes meet.', 27000, '{"fragrance": "Hibiscus", "top_notes": ["Hibiscus"], "heart_notes": ["Bergamot", "Ylang Ylang"], "base_notes": ["Caramel"], "best_for": "Offices, shops and homes", "size": "500ml"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('oxygen-room-spray', null, 'room_spray', 'Oxygen Room Spray', 'Oxygen', 'Clean, hygienic scent with fresh citrus notes.', 27000, '{"fragrance": "Oxygen", "top_notes": ["Lemon", "Bergamot"], "heart_notes": ["Iris Flower"], "base_notes": ["Ylang Ylang"], "best_for": "Offices and clean spaces", "size": "500ml"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('greentea-lemongrass-room-spray', null, 'room_spray', 'Greentea/Lemongrass Room Spray', 'Greentea/Lemongrass', 'Clean and refreshing fragrance that also helps eliminate bad odors.', 27000, '{"fragrance": "Greentea/Lemongrass", "top_notes": ["Green Tea"], "heart_notes": ["Lemon Peel"], "best_for": "Freshening rooms and eliminating bad odours", "size": "500ml"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('white-tea-room-spray', null, 'room_spray', 'White Tea Room Spray', 'White Tea', 'Light, fresh fragrance.', 27000, '{"fragrance": "White Tea", "top_notes": ["White Tea"], "heart_notes": ["Lemon"], "base_notes": ["Bergamot", "Ylang Ylang"], "best_for": "Room sprays and room fragrances", "size": "500ml"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('blue-fico-room-spray', null, 'room_spray', 'Blue Fico Room Spray', 'Blue Fico', 'Fresh citrus and fig fragrance that adds a garden-like, uplifting feel.', 27000, '{"fragrance": "Blue Fico", "top_notes": ["Orange", "Lemon"], "heart_notes": ["Fig"], "base_notes": ["Bergamot"], "best_for": "Uplifting, fresh spaces", "size": "500ml"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('poudre-linen-room-spray', null, 'room_spray', 'Poudre Linen Room Spray', 'Poudre Linen', null, 27000, '{"fragrance": "Poudre Linen", "size": "500ml"}'::jsonb, false)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('yellow-peach-scented-candle', null, 'candle', 'Yellow Peach Scented Candle', 'Yellow Peach', 'Sweet, fruity fragrance with strong peach aroma. Ideal for summer ambient scenting and candle production.', 38000, '{"fragrance": "Yellow Peach", "top_notes": ["Peach"], "heart_notes": ["Vanilla"], "base_notes": ["Musk"], "best_for": "Summer ambient scenting and candles", "size": "230g"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('snow-fig-scented-candle', null, 'candle', 'Snow Fig Scented Candle', 'Snow Fig', 'Fresh, elegant fragrance with fruity, floral and light woody touches. Creates a relaxing and refined atmosphere.', 38000, '{"fragrance": "Snow Fig", "top_notes": ["Sandalwood", "Papyrus"], "heart_notes": ["Amber"], "base_notes": ["Fig Tree", "Cardamom"], "best_for": "Relaxing, refined ambiance", "size": "230g"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('black-vanilla-scented-candle', null, 'candle', 'Black Vanilla Scented Candle', 'Black Vanilla', 'Sweet and spicy scent with rich warmth.', 38000, '{"fragrance": "Black Vanilla", "top_notes": ["Cardamom"], "heart_notes": ["Turmeric", "Vanilla"], "base_notes": ["Saffron", "Ginger"], "best_for": "Ambient scenting", "size": "230g"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('yellow-peach-zen-set', null, 'zen_set', 'Yellow Peach Zen Set', 'Yellow Peach', 'Sweet, fruity fragrance with strong peach aroma. Ideal for summer ambient scenting and candle production.', 90000, '{"fragrance": "Yellow Peach", "top_notes": ["Peach"], "heart_notes": ["Vanilla"], "base_notes": ["Musk"], "best_for": "Gift giving. Summer ambient scenting and candles", "box_contents": "2 candles + 1 reed diffuser (same fragrance) + match stick bottle"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('snow-fig-zen-set', null, 'zen_set', 'Snow Fig Zen Set', 'Snow Fig', 'Fresh, elegant fragrance with fruity, floral and light woody touches. Creates a relaxing and refined atmosphere.', 90000, '{"fragrance": "Snow Fig", "top_notes": ["Sandalwood", "Papyrus"], "heart_notes": ["Amber"], "base_notes": ["Fig Tree", "Cardamom"], "best_for": "Gift giving. Relaxing, refined ambiance", "box_contents": "2 candles + 1 reed diffuser (same fragrance) + match stick bottle"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('black-vanilla-zen-set', null, 'zen_set', 'Black Vanilla Zen Set', 'Black Vanilla', 'Sweet and spicy scent with rich warmth.', 90000, '{"fragrance": "Black Vanilla", "top_notes": ["Cardamom"], "heart_notes": ["Turmeric", "Vanilla"], "base_notes": ["Saffron", "Ginger"], "best_for": "Gift giving. Ambient scenting", "box_contents": "2 candles + 1 reed diffuser (same fragrance) + match stick bottle"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('yellow-peach-reed-diffuser', null, 'reed_diffuser', 'Yellow Peach Reed Diffuser', 'Yellow Peach', 'Sweet, fruity fragrance with strong peach aroma. Ideal for summer ambient scenting and candle production.', 55000, '{"fragrance": "Yellow Peach", "top_notes": ["Peach"], "heart_notes": ["Vanilla"], "base_notes": ["Musk"], "best_for": "Summer ambient scenting and candles", "size": "200ml"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('snow-fig-reed-diffuser', null, 'reed_diffuser', 'Snow Fig Reed Diffuser', 'Snow Fig', 'Fresh, elegant fragrance with fruity, floral and light woody touches. Creates a relaxing and refined atmosphere.', 55000, '{"fragrance": "Snow Fig", "top_notes": ["Sandalwood", "Papyrus"], "heart_notes": ["Amber"], "base_notes": ["Fig Tree", "Cardamom"], "best_for": "Relaxing, refined ambiance", "size": "200ml"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

insert into public.products (slug, sku, category, name, short_description, description, base_price, attributes, active)
values ('black-vanilla-reed-diffuser', null, 'reed_diffuser', 'Black Vanilla Reed Diffuser', 'Black Vanilla', 'Sweet and spicy scent with rich warmth.', 55000, '{"fragrance": "Black Vanilla", "top_notes": ["Cardamom"], "heart_notes": ["Turmeric", "Vanilla"], "base_notes": ["Saffron", "Ginger"], "best_for": "Ambient scenting", "size": "200ml"}'::jsonb, true)
on conflict (slug) do update set category = excluded.category, name = excluded.name, short_description = excluded.short_description, description = excluded.description, base_price = excluded.base_price, attributes = excluded.attributes, active = excluded.active;

delete from public.knowledge_base where source = 'manual' and topic like 'catalog-rules-%';

insert into public.knowledge_base (topic, question, answer) values ('catalog-rules-diffusers', 'What comes free with a diffuser machine?', 'Every diffuser machine comes with one complimentary fragrance oil of the customer''s choice: 250ml for the Maxi, Box, Flute and Midi diffusers, and 10ml for the Mini diffuser. The only exception is the Intelligent Care Diffuser (car diffuser), which comes with 3 bottles of its own special fragrance (not oil-based) instead.');

insert into public.knowledge_base (topic, question, answer) values ('catalog-rules-diffusers', 'Which fragrances can I choose as my complimentary oil?', 'The customer chooses from the fragrances offered in the matching size (250ml for Maxi, Box, Flute and Midi; 10ml for Mini). Check each fragrance''s complimentary eligibility.');

insert into public.knowledge_base (topic, question, answer) values ('catalog-rules-diffusers', 'How much does extra fragrance oil cost?', 'Any oil beyond the complimentary oil is charged separately: 10ml is ₦10,000, 100ml is ₦30,000, 250ml is ₦75,000 and 500ml is ₦140,000. Not every fragrance is offered in every size.');

insert into public.knowledge_base (topic, question, answer) values ('catalog-rules-bedding', 'How firm is each mattress?', 'From softest to firmest: Nova (medium soft), Crest (medium), Luna (medium firm), Luna-X (firm).');

insert into public.knowledge_base (topic, question, answer) values ('catalog-rules-bedding', 'What is the difference between semi-orthopedic and full-orthopedic mattresses?', 'Semi-orthopedic (Crest, Nova) gives balanced comfort with a supportive feel, ideal for everyday sleepers who want comfort first. Full-orthopedic (Luna, Luna-X) is firmer and more supportive, and is recommended for people with back aches.');

insert into public.knowledge_base (topic, question, answer) values ('catalog-rules-bedding', 'Which mattress is best for back aches?', 'Recommend Luna (medium firm) or Luna-X (firm, natural latex). Both are full-orthopedic.');

insert into public.knowledge_base (topic, question, answer) values ('catalog-rules-bedding', 'Which mattress is best for someone who wants a soft feel or sleeps hot?', 'Recommend Nova: medium soft with an icy cooling knitted top. Pair it with the Imagio Cooling Duvet for a cooler night.');

insert into public.knowledge_base (topic, question, answer) values ('catalog-rules-bedding', 'Which mattress is a balanced, mid-range option?', 'Recommend Crest (medium firmness). It is the most affordable mattress, from ₦650,000.');

insert into public.knowledge_base (topic, question, answer) values ('catalog-rules-bedding', 'Which sleep positions and bed frames suit the mattresses?', 'All mattresses suit back, side and stomach sleepers, and are compatible with foundation, slatted platform and box spring bed frames. Sizes are listed in feet (width × length); centimetre sizes are approximate equivalents.');

insert into public.knowledge_base (topic, question, answer) values ('catalog-rules-bedding', 'Are all mattress sizes available for every model?', 'No. Each mattress model is offered only in the sizes listed for that model.');

insert into public.knowledge_base (topic, question, answer) values ('catalog-rules-scent', 'How much do room sprays, candles, reed diffusers and zen sets cost?', 'Room Spray (500ml) is ₦27,000, Scented Candle (230g) is ₦38,000, Reed Diffuser (200ml) is ₦55,000 and a Zen Set (gift box) is ₦90,000.');

insert into public.knowledge_base (topic, question, answer) values ('catalog-rules-scent', 'What is a good gift?', 'Recommend the Zen Set. Each box contains 2 candles and a reed diffuser, all in the same fragrance, plus a match stick bottle.');

insert into public.knowledge_base (topic, question, answer) values ('catalog-rules-scent', 'How are the scented candles made?', 'Handmade with soy wax, premium fragrance oils infused with essential oils, and cotton wicks.');
