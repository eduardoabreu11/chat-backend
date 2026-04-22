import db from "../database/postgresql.js";

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
    const result = await db.query(
      `
      SELECT 
        messages.id,
        messages.text,
        messages.created_at,
        users.name AS author
      FROM messages
      INNER JOIN users ON users.id = messages.user_id
      WHERE messages.room_id = $1
      ORDER BY messages.created_at ASC
      `,
      [roomId]
    );

    return result.rows as MessageWithAuthor[];
  }

  async create({
    user_id,
    room_id,
    text,
  }: CreateMensagemDTO): Promise<Message> {
    const result = await db.query(
      `
      INSERT INTO messages (user_id, room_id, text)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [user_id, room_id, text]
    );

    return result.rows[0] as Message;
  }


  async findById(id: number): Promise<Message | undefined> {
  const result = await db.query(
    "SELECT * FROM messages WHERE id = $1",
    [id]
  );

  return result.rows[0] as Message | undefined;
}


async update(id: number, text: string): Promise<Message> {
  const result = await db.query(
    `
    UPDATE messages
    SET text = $1
    WHERE id = $2
    RETURNING *
    `,
    [text, id]
  );

  return result.rows[0] as Message;
}

async delete(id: number): Promise<void> {
  await db.query(
    "DELETE FROM messages WHERE id = $1",
    [id]
  );
}

}