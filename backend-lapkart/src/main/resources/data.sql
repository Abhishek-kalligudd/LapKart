INSERT IGNORE INTO categories (cat_id, cat_name, slug, description) VALUES
(1, 'Gaming', 'gaming', 'High-performance laptops for gaming and creators.'),
(2, 'Office Use', 'office-use', 'Reliable and portable laptops for productivity.'),
(3, 'Chromebooks', 'chromebooks', 'Lightweight Chrome OS devices for web-based tasks.');

INSERT IGNORE INTO products (product_id, category_id, brand, model_name, sku, description, price, discount_price, stock_quantity, processor, ram_gb, storage, display_specs, gpu, os) VALUES
-- Acer
(1, 1, 'acer', 'Acer Predator Helios 16', 'ACR-PRD-16', 'Top-tier gaming laptop with advanced thermal cooling.', 1699.99, 1549.99, 20, 'Intel Core i7-13700HX', 16, '1TB NVMe SSD', '16-inch QHD+ 165Hz', 'NVIDIA RTX 4070', 'Windows 11 Home'),
(2, 1, 'acer', 'Acer Nitro 5', 'ACR-NIT-05', 'Entry-level gaming powerhouse.', 899.99, NULL, 35, 'Intel Core i5-12500H', 16, '512GB SSD', '15.6-inch FHD 144Hz', 'NVIDIA RTX 4050', 'Windows 11 Home'),
(3, 2, 'acer', 'Acer Aspire 5', 'ACR-ASP-05', 'Reliable daily driver for office and student tasks.', 499.99, 449.99, 50, 'Intel Core i3-1215U', 8, '256GB SSD', '15.6-inch FHD', 'Intel UHD Graphics', 'Windows 11 Home'),
(4, 2, 'acer', 'Acer Aspire 7', 'ACR-ASP-07', 'Professional laptop with discrete graphics for light content creation.', 749.99, NULL, 25, 'AMD Ryzen 5 5500U', 16, '512GB SSD', '15.6-inch FHD', 'NVIDIA GTX 1650', 'Windows 11 Home'),

-- Samsung
(5, 2, 'samsung', 'Samsung Galaxy Book4', 'SAM-BK4-00', 'Slim and light everyday laptop with seamless ecosystem integration.', 899.99, NULL, 30, 'Intel Core i5-1335U', 16, '512GB SSD', '15.6-inch AMOLED', 'Intel Iris Xe', 'Windows 11 Home'),
(6, 2, 'samsung', 'Samsung Galaxy Book4 Pro', 'SAM-BK4-PR', 'Premium ultrabook with a stunning touchscreen display.', 1449.99, 1349.99, 15, 'Intel Core Ultra 7', 16, '1TB SSD', '14-inch Dynamic AMOLED 2X', 'Intel Arc Graphics', 'Windows 11 Pro'),
(7, 2, 'samsung', 'Samsung Galaxy Book5', 'SAM-BK5-00', 'Next-generation productivity machine.', 1099.99, NULL, 20, 'Intel Core Ultra 5', 16, '512GB SSD', '15.6-inch AMOLED', 'Intel Arc Graphics', 'Windows 11 Home'),
(8, 2, 'samsung', 'Samsung Galaxy Book6', 'SAM-BK6-00', 'Flagship everyday laptop with AI-enhanced features.', 1199.99, NULL, 20, 'Intel Core Ultra 7', 16, '1TB SSD', '15.6-inch AMOLED', 'Intel Arc Graphics', 'Windows 11 Home'),
(9, 2, 'samsung', 'Samsung Galaxy Book6 Pro', 'SAM-BK6-PR', 'The ultimate professional ultrabook for power users.', 1699.99, 1599.99, 10, 'Intel Core Ultra 9', 32, '1TB NVMe SSD', '16-inch Dynamic AMOLED 2X', 'Intel Arc Graphics', 'Windows 11 Pro'),

-- HP
(10, 1, 'hp', 'HP Omen 16', 'HP-OMN-16', 'High-performance gaming laptop with desktop-caliber power.', 1499.99, 1399.99, 18, 'AMD Ryzen 7 7840HS', 16, '1TB SSD', '16.1-inch QHD 240Hz', 'NVIDIA RTX 4060', 'Windows 11 Home'),
(11, 2, 'hp', 'HP Envy x360', 'HP-ENV-360', 'Versatile 2-in-1 convertible for creatives and professionals.', 999.99, 899.99, 25, 'Intel Core i7-1355U', 16, '512GB SSD', '15.6-inch FHD Touch', 'Intel Iris Xe', 'Windows 11 Home'),

-- Dell
(12, 2, 'dell', 'Dell XPS 15', 'DEL-XPS-15', 'Premium build quality with a stunning InfinityEdge display.', 1899.99, NULL, 12, 'Intel Core i7-13700H', 32, '1TB SSD', '15.6-inch 3.5K OLED', 'NVIDIA RTX 4050', 'Windows 11 Pro'),
(13, 1, 'dell', 'Dell G15 Gaming', 'DEL-G15-00', 'Robust gaming laptop with Alienware-inspired thermals.', 1099.99, 949.99, 22, 'Intel Core i7-13650HX', 16, '1TB SSD', '15.6-inch FHD 165Hz', 'NVIDIA RTX 4060', 'Windows 11 Home'),
(14, 2, 'dell', 'Dell Inspiron 16', 'DEL-INS-16', 'Spacious display and comfortable keyboard for everyday work.', 699.99, NULL, 40, 'AMD Ryzen 5 7530U', 8, '512GB SSD', '16-inch FHD+', 'AMD Radeon Graphics', 'Windows 11 Home'),

-- Asus
(15, 2, 'asus', 'ASUS Vivobook M3500QC', 'ASU-VIV-3500', 'Versatile OLED notebook perfect for intensive multitasking and creative workloads.', 1099.99, 949.99, 18, 'AMD Ryzen 7 5800H', 16, '512GB NVMe SSD', '15.6-inch FHD OLED', 'NVIDIA RTX 3050', 'Windows 11 Home'),
(16, 1, 'asus', 'ASUS ROG Strix G16', 'ASU-ROG-G16', 'Esports-ready gaming laptop with aggressive styling.', 1599.99, 1499.99, 15, 'Intel Core i7-13650HX', 16, '1TB SSD', '16-inch FHD+ 165Hz', 'NVIDIA RTX 4060', 'Windows 11 Home'),
(17, 1, 'asus', 'ASUS TUF Gaming A15', 'ASU-TUF-A15', 'Military-grade durability paired with high gaming performance.', 999.99, 899.99, 30, 'AMD Ryzen 7 7735HS', 16, '512GB SSD', '15.6-inch FHD 144Hz', 'NVIDIA RTX 4050', 'Windows 11 Home'),
(18, 1, 'asus', 'ASUS ROG Zephyrus G14', 'ASU-ZEP-G14', 'Ultra-portable 14-inch gaming laptop with AniMe Matrix display.', 1799.99, NULL, 10, 'AMD Ryzen 9 7940HS', 16, '1TB SSD', '14-inch QHD+ 165Hz', 'NVIDIA RTX 4070', 'Windows 11 Home'),

-- Gigabyte
(19, 1, 'gigabyte', 'Gigabyte AERO 16 OLED', 'GIG-AER-16', 'Color-accurate display designed specifically for content creators.', 1999.99, 1849.99, 8, 'Intel Core i9-13900H', 32, '1TB SSD', '16-inch 4K OLED', 'NVIDIA RTX 4070', 'Windows 11 Pro'),
(20, 1, 'gigabyte', 'Gigabyte AORUS 15', 'GIG-AOR-15', 'Enthusiast gaming laptop with a massive cooling solution.', 1499.99, NULL, 14, 'Intel Core i7-13700H', 16, '1TB SSD', '15.6-inch QHD 165Hz', 'NVIDIA RTX 4060', 'Windows 11 Home'),
(21, 1, 'gigabyte', 'Gigabyte G15', 'GIG-G15-00', 'Value-focused gaming laptop with modern specifications.', 899.99, 799.99, 25, 'Intel Core i5-12500H', 8, '512GB SSD', '15.6-inch FHD 144Hz', 'NVIDIA RTX 4050', 'Windows 11 Home'),

-- Chromebooks (Category ID 3)
(22, 3, 'acer', 'Acer Chromebook Spin 714', 'ACR-CHB-714', 'Premium 2-in-1 convertible Chromebook optimized for productivity.', 699.99, 649.99, 40, 'Intel Core i5-1235U', 8, '256GB SSD', '14-inch WUXGA Touch', 'Intel Iris Xe', 'Chrome OS'),
(23, 3, 'hp', 'HP Chromebook x360', 'HP-CHB-360', 'Versatile and lightweight Chromebook for everyday web browsing and student tasks.', 449.99, NULL, 60, 'Intel Core i3-1115G4', 8, '128GB eMMC', '14-inch FHD Touch', 'Intel UHD Graphics', 'Chrome OS'),
(24, 3, 'asus', 'ASUS Chromebook Plus CX34', 'ASU-CHB-34', 'High-performance Chromebook Plus with military-grade durability and enhanced apps.', 599.99, 549.99, 35, 'Intel Core i5-1235U', 8, '256GB SSD', '14-inch FHD', 'Intel Iris Xe', 'Chrome OS'),

-- Apple (Category ID 2 for Office Use/Professional)
(25, 2, 'apple', 'MacBook Air M5', 'APP-MBA-M5', 'The incredibly thin and light everyday laptop powered by the next-gen M5 chip.', 1199.99, NULL, 50, 'Apple M5', 16, '512GB SSD', '13.6-inch Liquid Retina', 'Apple 10-core GPU', 'macOS'),
(26, 2, 'apple', 'MacBook Pro M5', 'APP-MBP-M5', 'Extreme performance for professionals and creators with the M5 Pro chip and exceptional battery life.', 1999.99, 1899.99, 30, 'Apple M5 Pro', 32, '1TB SSD', '14.2-inch Liquid Retina XDR', 'Apple 16-core GPU', 'macOS'),
(27, 2, 'apple', 'MacBook Neo', 'APP-MBN-01', 'A revolutionary new ultra-portable form factor offering ultimate mobility and seamless ecosystem integration.', 899.99, NULL, 45, 'Apple M5', 8, '256GB SSD', '12-inch Retina Display', 'Apple 8-core GPU', 'macOS');

INSERT IGNORE INTO product_imgs (product_id, image_url, alt_text, is_primary) VALUES
-- Acer Predator
(1, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z70.png', 'Acer Predator Helios 16 Front View', TRUE),
(1, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z73.png', 'Acer Predator Helios 16 info', FALSE),
(1, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z71.png', 'Acer Predator Helios 16 info', FALSE),
(1, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z72.png', 'Acer Predator Helios 16 info', FALSE),
(1, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z76.png', 'Acer Predator Helios 16 info', FALSE),
(1, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z77.png', 'Acer Predator Helios 16 info', FALSE),
(1, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z75.png', 'Acer Predator Helios 16 info', FALSE),
(1, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z74.png', 'Acer Predator Helios 16 info', FALSE),
-- Acer Nitro
(2, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z60.png', 'Acer Nitro 5', TRUE),
(2, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z61.png', 'Acer Nitro 5', FALSE),
(2, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z62.png', 'Acer Nitro 5', FALSE),
(2, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z63.png', 'Acer Nitro 5', FALSE),
(2, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z64.png', 'Acer Nitro 5', FALSE),
(2, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z65.png', 'Acer Nitro 5', FALSE),
(2, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z66.png', 'Acer Nitro 5', FALSE),
-- Acer Aspire 5
(3, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/101.png', 'Acer Aspire 5 Display', TRUE),
(3, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/103.png', 'Acer Aspire 5 info', FALSE),
(3, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/102.png', 'Acer Aspire 5 info', FALSE),
(3, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/106.png', 'Acer Aspire 5 info', FALSE),
(3, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/104.png', 'Acer Aspire 5 info', FALSE),
(3, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/105.png', 'Acer Aspire 5 info', FALSE),
(3, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/107.png', 'Acer Aspire 5 info', FALSE),
-- Acer Aspire 7
(4, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/111.png', 'Acer Aspire 7 Main', TRUE),
(4, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/112.png', 'Acer Aspire 7 Info', FALSE),
(4, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/113.png', 'Acer Aspire 7 Info', FALSE),
(4, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/114.png', 'Acer Aspire 7 Info', FALSE),
(4, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/115.png', 'Acer Aspire 7 Info', FALSE),
-- Samsung Book4
(5, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/116.png', 'Samsung Book4 Front', TRUE),
(5, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/121.png', 'Samsung Book4 Info', FALSE),
(5, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/117.png', 'Samsung Book4 Info', FALSE),
(5, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/119.png', 'Samsung Book4 Info', FALSE),
(5, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/118.png', 'Samsung Book4 Info', FALSE),
(5, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/120.png', 'Samsung Book4 Info', FALSE),
-- Samsung Book4 Pro
(6, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/131.png', 'Samsung Book4 Pro', TRUE),
(6, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/132.png', 'Samsung Book4 Pro Profile', FALSE),
(6, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/135.png', 'Samsung Book4 Pro Profile', FALSE),
(6, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/133.png', 'Samsung Book4 Pro Profile', FALSE),
(6, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/134.png', 'Samsung Book4 Pro Profile', FALSE),
-- Samsung Book5
(7, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/136.png', 'Samsung Book5 Display', TRUE),
(7, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/137.png', 'Samsung Book5 Info', FALSE),
(7, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/138.png', 'Samsung Book5 Info', FALSE),
(7, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/139.png', 'Samsung Book5 Info', FALSE),
(7, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/140.png', 'Samsung Book5 Info', FALSE),
(7, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/141.png', 'Samsung Book5 Info', FALSE),
(7, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/142.png', 'Samsung Book5 Info', FALSE),
-- Samsung Book6
(8, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/143.png', 'Samsung Book6', TRUE),
(8, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/144.png', 'Samsung Book6 Info', FALSE),
(8, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/145.png', 'Samsung Book6 Info', FALSE),
(8, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/146.png', 'Samsung Book6 Info', FALSE),
(8, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/147.png', 'Samsung Book6 Info', FALSE),
(8, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/148.png', 'Samsung Book6 Info', FALSE),
(8, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/149.png', 'Samsung Book6 Info', FALSE),
-- Samsung Book6 Pro
(9, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/150.png', 'Samsung Book6 Pro AMOLED', TRUE),
(9, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/150.png', 'Samsung Book6 Pro Info', FALSE),
(9, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/152.png', 'Samsung Book6 Pro Info', FALSE),
(9, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/153.png', 'Samsung Book6 Pro Info', FALSE),
(9, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/154.png', 'Samsung Book6 Pro Info', FALSE),
(9, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/155.png', 'Samsung Book6 Pro Info', FALSE),
(9, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/156.png', 'Samsung Book6 Pro Info', FALSE),
-- HP Omen
(10, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/q1.png', 'HP Omen 16 Front', TRUE),
(10, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/q2.png', 'HP Omen 16', FALSE),
(10, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/q3.png', 'HP Omen 16', FALSE),
(10, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/q4.png', 'HP Omen 16', FALSE),
(10, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/q5.png', 'HP Omen 16', FALSE),
(10, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/q6.png', 'HP Omen 16', FALSE),
(10, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/q7.png', 'HP Omen 16', FALSE),
-- HP Envy
(11, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/e6.png', 'HP Envy x360', TRUE),
(11, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/e1.png', 'HP Envy x360 Info', FALSE),
(11, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/e2.png', 'HP Envy x360 Info', FALSE),
(11, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/e3.png', 'HP Envy x360 Info', FALSE),
(11, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/e4.png', 'HP Envy x360 Info', FALSE),
(11, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/e5.png', 'HP Envy x360 Info', FALSE),
-- Dell XPS
(12, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/x1.png', 'Dell XPS 15 InfinityEdge', TRUE),
(12, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/x2.png', 'Dell XPS 15', FALSE),
(12, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/x3.png', 'Dell XPS 15', FALSE),
(12, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/x4.png', 'Dell XPS 15', FALSE),
(12, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/x5.png', 'Dell XPS 15', FALSE),
-- Dell G15
(13, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/y1.png', 'Dell G15 Gaming Front', TRUE),
(13, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/y2.png', 'Dell G15', FALSE),
(13, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/y3.png', 'Dell G15', FALSE),
(13, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/y4.png', 'Dell G15', FALSE),
(13, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/y5.png', 'Dell G15', FALSE),
(13, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/y6.png', 'Dell G15', FALSE),
-- Dell Inspiron
(14, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/y7.png', 'Dell Inspiron 16 Open', TRUE),
(14, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/y8.png', 'Dell Inspiron 16 ', FALSE),
(14, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/y10.png', 'Dell Inspiron 16 ', FALSE),
(14, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/y11.png', 'Dell Inspiron 16 ', FALSE),
-- Asus Vivobook
(15, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z1.png', 'ASUS Vivobook M3500QC OLED Screen', TRUE),
(15, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z2.png', 'ASUS Vivobook M3500QC', FALSE),
(15, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z3.png', 'ASUS Vivobook M3500QC', FALSE),
(15, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z4.png', 'ASUS Vivobook M3500QC', FALSE),
(15, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z5.png', 'ASUS Vivobook M3500QC', FALSE),
-- Asus ROG
(16, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z6.png', 'ASUS ROG Strix G16 Front', TRUE),
(16, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z7.png', 'ASUS ROG Strix G16', FALSE),
(16, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z8.png', 'ASUS ROG Strix G16', FALSE),
(16, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z9.png', 'ASUS ROG Strix G16', FALSE),
(16, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z10.png', 'ASUS ROG Strix G16', FALSE),
(16, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z11.png', 'ASUS ROG Strix G16', FALSE),
(16, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z12.png', 'ASUS ROG Strix G16', FALSE),
-- Asus TUF
(17, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z13.png', 'ASUS TUF Gaming A15', TRUE),
(17, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z14.png', 'ASUS TUF Gaming A15', FALSE),
(17, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z15.png', 'ASUS TUF Gaming A15', FALSE),
(17, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z16.png', 'ASUS TUF Gaming A15', FALSE),
(17, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z17.png', 'ASUS TUF Gaming A15', FALSE),
(17, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z18.png', 'ASUS TUF Gaming A15', FALSE),
(17, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z19.png', 'ASUS TUF Gaming A15', FALSE),
-- Asus Zephyrus
(18, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z20.png', 'ASUS ROG Zephyrus G14 AniMe Matrix', TRUE),
(18, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z21.png', 'ASUS ROG Zephyrus G14', FALSE),
(18, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z22.png', 'ASUS ROG Zephyrus G14', FALSE),
(18, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z23.png', 'ASUS ROG Zephyrus G14', FALSE),
(18, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z24.png', 'ASUS ROG Zephyrus G14', FALSE),
(18, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z25.png', 'ASUS ROG Zephyrus G14', FALSE),
(18, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z26.png', 'ASUS ROG Zephyrus G14', FALSE),
-- Gigabyte Aero
(19, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z31.png', 'Gigabyte AERO 16 OLED Studio', TRUE),
(19, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z32.png', 'Gigabyte AERO 16 OLED', FALSE),
(19, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z33.png', 'Gigabyte AERO 16 OLED', FALSE),
(19, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z34.png', 'Gigabyte AERO 16 OLED', FALSE),
(19, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z35.png', 'Gigabyte AERO 16 OLED', FALSE),
-- Gigabyte Aorus
(20, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z41.png', 'Gigabyte AORUS 15 Gaming', TRUE),
(20, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z42.png', 'Gigabyte AORUS 15', FALSE),
(20, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z43.png', 'Gigabyte AORUS 15', FALSE),
(20, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z44.png', 'Gigabyte AORUS 15', FALSE),
-- Gigabyte 15
(21, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z50.png', 'Gigabyte G15 Front View', TRUE),
(21, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z51.png', 'Gigabyte G15', FALSE),
(21, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z52.png', 'Gigabyte G15', FALSE),
(21, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z53.png', 'Gigabyte G15', FALSE),
(21, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z54.png', 'Gigabyte G15', FALSE),
-- Acer Chromebook
(22, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z80.png', 'Acer Chromebook Spin 714 Front', TRUE),
(22, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z81.png', 'Acer Chromebook Spin 714', FALSE),
(22, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z82.png', 'Acer Chromebook Spin 714', FALSE),
(22, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z83.png', 'Acer Chromebook Spin 714', FALSE),
(22, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/z84.png', 'Acer Chromebook Spin 714', FALSE),
-- HP Chromebook
(23, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/w1.png', 'HP Chromebook x360', TRUE),
(23, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/w2.png', 'HP Chromebook x360', FALSE),
(23, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/w3.png', 'HP Chromebook x360', FALSE),
(23, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/w4.png', 'HP Chromebook x360', FALSE),
(23, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/w5.png', 'HP Chromebook x360', FALSE),
-- Asus Chromebook
(24, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/w6.png', 'ASUS Chromebook Plus CX34', TRUE),
(24, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/w7.png', 'ASUS Chromebook Plus CX34', FALSE),
(24, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/w8.png', 'ASUS Chromebook Plus CX34', FALSE),
(24, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/w9.png', 'ASUS Chromebook Plus CX34', FALSE),
(24, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/w10.png', 'ASUS Chromebook Plus CX34', FALSE),
(24, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/w11.png', 'ASUS Chromebook Plus CX34', FALSE),
-- Apple MacBook Air M5
(25, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m1.png', 'MacBook Air M5', TRUE),
(25, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m2.png', 'MacBook Air M5', FALSE),
(25, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m3.png', 'MacBook Air M5', FALSE),
(25, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m4.png', 'MacBook Air M5', FALSE),
(25, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m5.png', 'MacBook Air M5', FALSE),
(25, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m6.png', 'MacBook Air M5', FALSE),
(25, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m7.png', 'MacBook Air M5', FALSE),
-- Apple MacBook Pro M5
(26, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m9.png', 'MacBook Pro M5', TRUE),
(26, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m10.png', 'MacBook Pro M5', FALSE),
(26, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m11.png', 'MacBook Pro M5', FALSE),
(26, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m12.png', 'MacBook Pro M5', FALSE),
(26, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m13.png', 'MacBook Pro M5', FALSE),
(26, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m14.png', 'MacBook Pro M5', FALSE),
(26, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m15.png', 'MacBook Pro M5', FALSE),
-- Apple MacBook Neo
(27, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m21.png', 'MacBook Neo', TRUE),
(27, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m22.png', 'MacBook Neo', FALSE),
(27, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m23.png', 'MacBook Neo', FALSE),
(27, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m24.png', 'MacBook Neo', FALSE),
(27, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m25.png', 'MacBook Neo', FALSE),
(27, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m26.png', 'MacBook Neo', FALSE),
(27, 'https://ik.imagekit.io/gzx90298/e-com/Laptop-png/m27.png', 'MacBook Neo', FALSE);
