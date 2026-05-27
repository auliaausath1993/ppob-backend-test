-- DDL untuk Tabel users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_image VARCHAR(255),
    balance INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- DDL untuk Tabel banners
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    banner_name VARCHAR(255) NOT NULL,
    banner_image VARCHAR(255) NOT NULL,
    description TEXT
);

-- DDL untuk Tabel services
CREATE TABLE IF NOT EXISTS services (
    service_code VARCHAR(100) PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    service_icon VARCHAR(255) NOT NULL,
    service_tariff INT NOT NULL
);

-- DDL untuk Tabel transactions
CREATE TABLE IF NOT EXISTS transactions (
    invoice_number VARCHAR(100) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    service_code VARCHAR(100) NULL,
    transaction_type ENUM('TOPUP', 'PAYMENT') NOT NULL,
    total_amount INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert Dummy Data untuk Banners (Abaikan jika sudah ada)
INSERT IGNORE INTO banners (banner_name, banner_image, description) VALUES 
('Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');

-- Insert Dummy Data untuk Services (Abaikan jika sudah ada)
INSERT IGNORE INTO services (service_code, service_name, service_icon, service_tariff) VALUES 
('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000),
('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000),
('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000),
('QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000),
('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000);
