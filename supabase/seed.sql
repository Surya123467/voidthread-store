insert into public.products(name,slug,subtitle,description,story,price_in_paise,compare_at_price_in_paise,status,collection_name,featured)
values
('POWER / 001','power-001','Heavyweight oversized tee','240 GSM combed cotton. Drop shoulder. Enzyme washed.','A study in restraint: power shown through weight, fracture and silence rather than a borrowed symbol.',149900,169900,'active','DROP 001 — AFTERLIGHT',true),
('THREAD / 002','thread-002','Washed crimson oversized tee','230 GSM cotton jersey. Garment washed.','Everything touches something else. A piece about consequence, connection and the weight of choosing.',139900,null,'active','DROP 001 — AFTERLIGHT',true),
('THUNDER / 003','thunder-003','Charcoal heavyweight tee','250 GSM cotton. High rib neck.','Not mythology copied. Mythology rebuilt: force, fracture and the second before impact.',159900,null,'active','DROP 001 — AFTERLIGHT',true)
on conflict(slug) do nothing;
