-- Script SQL para criar o banco de dados e tabelas
-- Execute este script no MySQL antes de rodar a aplicação

CREATE DATABASE IF NOT EXISTS ph_silva CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ph_silva;

-- Tabela de usuários (admin e comuns)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de regiões
CREATE TABLE IF NOT EXISTS regioes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icone VARCHAR(50) DEFAULT 'MapPin',
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de imóveis
CREATE TABLE IF NOT EXISTS imoveis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo ENUM('casa', 'apartamento', 'terreno', 'comercial') NOT NULL,
  operacao ENUM('venda', 'aluguel') NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  bairro VARCHAR(100),
  endereco VARCHAR(255),
  numero VARCHAR(20),
  cep VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  preco DECIMAL(12, 2) NOT NULL,
  area_total DECIMAL(10, 2),
  area_construida DECIMAL(10, 2),
  quartos INT,
  banheiros INT,
  vagas INT,
  destaque BOOLEAN DEFAULT FALSE,
  status ENUM('disponivel', 'reservado', 'vendido') DEFAULT 'disponivel',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cidade (cidade),
  INDEX idx_tipo (tipo),
  INDEX idx_operacao (operacao),
  INDEX idx_status (status),
  INDEX idx_destaque (destaque),
  FULLTEXT idx_busca (titulo, descricao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de fotos dos imóveis
CREATE TABLE IF NOT EXISTS imovel_fotos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  imovel_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  ordem INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (imovel_id) REFERENCES imoveis(id) ON DELETE CASCADE,
  INDEX idx_imovel (imovel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de contatos
CREATE TABLE IF NOT EXISTS contatos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  imovel_id INT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  mensagem TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (imovel_id) REFERENCES imoveis(id) ON DELETE SET NULL,
  INDEX idx_imovel (imovel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Para criar o usuário admin, execute o script:
-- node scripts/create-admin.js
-- 
-- Ou use este comando SQL após gerar o hash com bcrypt:
-- INSERT INTO usuarios (email, senha_hash, nome) VALUES 
-- ('admin@phsilva.com.br', 'hash_gerado_aqui', 'Administrador');
