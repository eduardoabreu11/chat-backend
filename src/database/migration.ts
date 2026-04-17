import db from "./postgresql.js";

async function migrate() {
  console.log("🚀 Rodando migration do chat...");

  /* =========================
     USERS
  ========================= */
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  /* =========================
     ROOMS
  ========================= */
  await db.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id SERIAL PRIMARY KEY,
      code VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(100),
      is_global BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  /* =========================
     MESSAGES
  ========================= */
  await db.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      room_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
      FOREIGN KEY (room_id)
        REFERENCES rooms(id)
        ON DELETE CASCADE
    );
  `);

  /* =========================
     SALA GLOBAL
  ========================= */
  await db.query(`
    INSERT INTO rooms (code, name, is_global)
    VALUES ('global', 'Chat Global', TRUE)
    ON CONFLICT (code) DO NOTHING;
  `);

  console.log("✅ Migration executada com sucesso");
}

migrate()
  .then(() => process.exit())
  .catch((err) => {
    console.error("❌ Erro na migration:", err);
    process.exit(1);
  });
