CREATE DATABASE IF NOT EXISTS `ababilsoft_master` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ababilsoft_master`;
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS tenants(
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_code VARCHAR(80) NOT NULL UNIQUE,
  tenant_name VARCHAR(180) NOT NULL,
  db_name VARCHAR(120) NOT NULL UNIQUE,
  db_host VARCHAR(120) NULL,
  db_port VARCHAR(20) NULL,
  db_user VARCHAR(120) NULL,
  db_pass TEXT NULL,
  db_charset VARCHAR(40) DEFAULT 'utf8mb4',
  status VARCHAR(20) DEFAULT 'active',
  is_default TINYINT DEFAULT 0,
  notes TEXT NULL,
  created_by INT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  INDEX idx_tenants_status(status)
);

INSERT IGNORE INTO tenants(
  tenant_code,tenant_name,db_name,db_host,db_port,db_user,db_pass,db_charset,status,is_default,created_at
) VALUES (
  'main','المنشأة الرئيسية','ababilsoft_db','127.0.0.1','3307','root','','utf8mb4','active',1,NOW()
);
