import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export function getDbPool(): mysql.Pool {
  if (!pool) {
    // Railway usa MYSQL_URL; Vercel/local usam DATABASE_URL
    const connectionString = process.env.DATABASE_URL || process.env.MYSQL_URL || ''
    
    // Parse MySQL connection string: mysql://user:password@host:port/database
    const url = new URL(connectionString)
    
    // Em ambiente serverless (Vercel), usar menos conexões para não esgotar o limite do Railway
    const isServerless = !!process.env.VERCEL
    const connectionLimit = isServerless ? 2 : 10

    // Railway MySQL: conexões públicas podem precisar de SSL
    const isRailway = url.hostname.includes('railway')
    const ssl = isRailway ? { rejectUnauthorized: false } : undefined

    pool = mysql.createPool({
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1).split('?')[0], // Remove leading / e query string
      waitForConnections: true,
      connectionLimit,
      queueLimit: 0,
      connectTimeout: 10000,
      ...(ssl && { ssl }),
    })
  }
  
  return pool
}

export async function initDatabase() {
  const pool = getDbPool()
  const connection = await pool.getConnection()
  
  try {
    // Criar tabelas se não existirem
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
    
    await connection.query(`
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
    `)
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS imovel_fotos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        imovel_id INT NOT NULL,
        url VARCHAR(500) NOT NULL,
        ordem INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (imovel_id) REFERENCES imoveis(id) ON DELETE CASCADE,
        INDEX idx_imovel (imovel_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
    
    await connection.query(`
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
    `)
    
    console.log('Banco de dados inicializado com sucesso!')
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error)
    throw error
  } finally {
    connection.release()
  }
}
