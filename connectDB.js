// Cargar variables de entorno
require('dotenv').config();

// Función simple para conectar a la base de datos (Supabase PostgreSQL)
async function conectarDB() {
  try {
    const { Pool } = require('pg');
    
    // Usar la cadena de conexión del .env (formato Supabase)
    const connectionString = process.env.DB_CONNECTION_STRING;
    
    if (!connectionString) {
      throw new Error('DB_CONNECTION_STRING no está definida en el archivo .env');
    }
    
    const pool = new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false // Necesario para Supabase
      }
    });
    
    // Probar la conexión
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a la base de datos Supabase exitosamente');
    
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
    throw error;
  }
}

// Exportar función para uso en otros módulos
module.exports = conectarDB;