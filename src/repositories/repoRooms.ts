import { db } from "../database/connection.js";

interface CreateRoomDTO {
  code: string;
  name?: string;
  is_global?: number;
}

interface Room {
  id: number;
  code: string;
  name: string | null;
  is_global: number;
  created_at: string;
}

export class RepositoryRooms {
  async findAll(): Promise<Room[]> {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM rooms ORDER BY id ASC", [], (error, rows) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(rows as Room[]);
      });
    });
  }

  async findByCode(code: string): Promise<Room | undefined> {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM rooms WHERE code = ?",
        [code],
        (error, row) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(row as Room | undefined);
        }
      );
    });
  }

  async findById(id: number): Promise<Room | undefined> {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM rooms WHERE id = ?",
        [id],
        (error, row) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(row as Room | undefined);
        }
      );
    });
  }

  async create({ code, name, is_global = 0 }: CreateRoomDTO): Promise<Room> {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO rooms (code, name, is_global) VALUES (?, ?, ?)",
        [code, name ?? null, is_global],
        function (error) {
          if (error) {
            reject(error);
            return;
          }

          db.get(
            "SELECT * FROM rooms WHERE id = ?",
            [this.lastID],
            (selectError, row) => {
              if (selectError) {
                reject(selectError);
                return;
              }

              resolve(row as Room);
            }
          );
        }
      );
    });
  }
}