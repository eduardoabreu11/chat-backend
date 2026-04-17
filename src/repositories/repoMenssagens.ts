import { db } from "../database/postgresql.js";

interface CreateMensagemDTO {
  user_id: number;
  room_id: number;
  text: string;
}

interface Message {
  id: number;
  user_id: number;
  room_id: number;
  text: string;
  created_at: string;
}

interface MessageWithAuthor {
  id: number;
  text: string;
  created_at: string;
  author: string;
}

export class RepositoryMenssagens {
  async findByRoomId(roomId: number): Promise<MessageWithAuthor[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT 
          messages.id,
          messages.text,
          messages.created_at,
          users.name AS author
        FROM messages
        INNER JOIN users ON users.id = messages.user_id
        WHERE messages.room_id = ?
        ORDER BY messages.created_at ASC
        `,
        [roomId],
        (error, rows) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(rows as MessageWithAuthor[]);
        },
      );
    });
  }

  async create({
    user_id,
    room_id,
    text,
  }: CreateMensagemDTO): Promise<Message> {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO messages (user_id, room_id, text) VALUES (?, ?, ?)",
        [user_id, room_id, text],
        function (error) {
          if (error) {
            reject(error);
            return;
          }

          db.get(
            "SELECT * FROM messages WHERE id = ?",
            [this.lastID],
            (selectError, row) => {
              if (selectError) {
                reject(selectError);
                return;
              }

              resolve(row as Message);
            },
          );
        },
      );
    });
  }
}
