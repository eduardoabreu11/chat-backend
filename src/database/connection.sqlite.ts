import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();

export const db = new sqlite.Database(
  process.env.DATABASE || "./src/database/chatUndb.db",
  (error) => {
    if (error) {
      console.error("Erro ao conectar no banco:", error.message);
      return;
    }

    console.log("Banco conectado com sucesso.");
  }
);