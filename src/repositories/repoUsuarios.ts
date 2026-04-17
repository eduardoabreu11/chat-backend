import { db } from "../database/postgresql.js";

interface CreateUsuarioDTO {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
}

export class RepositoryUsuarios {
  async findByEmail(email: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (error, row) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(row as User | undefined);
      });
    });
  }

  async findById(id: number): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [id], (error, row) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(row as User | undefined);
      });
    });
  }

  async create({ name, email, password }: CreateUsuarioDTO): Promise<User> {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password],
        function (error) {
          if (error) {
            reject(error);
            return;
          }

          db.get(
            "SELECT * FROM users WHERE id = ?",
            [this.lastID],
            (selectError, row) => {
              if (selectError) {
                reject(selectError);
                return;
              }

              resolve(row as User);
            },
          );
        },
      );
    });
  }
}
