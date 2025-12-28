insert into products (code, name, brand, weight, price, image_url, certificate)
values
  ('ATM-1G', 'Emas Batangan Antam 1g', 'Antam', 1, 1250000, null, 'Sertifikat resmi'),
  ('UBS-5G', 'Emas Batangan UBS 5g', 'UBS', 5, 5900000, null, 'Sertifikat resmi'),
  ('ATM-10G', 'Emas Batangan Antam 10g', 'Antam', 10, 11750000, null, 'Sertifikat resmi');

insert into settings (margin_annual, admin_fee, stamp_duty, dp_min, dp_max, tenor_options, late_fee_daily)
values (0.08, 0.01, 10000, 20, 50, array[6,12,18,24,30,36,42,48,54,60], 0.001);
