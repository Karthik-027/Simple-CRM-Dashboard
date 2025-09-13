CREATE DATABASE IF NOT EXISTS appdb;
USE appdb;

-- users
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  name VARCHAR(255)
);

-- customers
CREATE TABLE IF NOT EXISTS customers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  company VARCHAR(255),
  created_at DATETIME,
  updated_at DATETIME
);

-- interactions
CREATE TABLE IF NOT EXISTS interactions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  customer_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  type VARCHAR(20) NOT NULL,
  notes TEXT,
  timestamp DATETIME,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- orders
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  customer_id BIGINT,
  order_date DATETIME,
  amount DECIMAL(10,2),
  status VARCHAR(20)
);

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  message VARCHAR(255),
  is_read BOOLEAN,
  created_at DATETIME
);
