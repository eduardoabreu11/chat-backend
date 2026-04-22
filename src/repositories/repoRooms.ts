import db from "../database/postgresql.js";

interface CreateRoomDTO {
  code: string;
  name?: string;
  is_global?: boolean;
}

interface Room {
  id: number;
  code: string;
  name: string | null;
  is_global: boolean;
  created_at: string;
}

export class RepositoryRooms {
  
  async findAll(): Promise<Room[]> {
    const result = await db.query(
      "SELECT * FROM rooms ORDER BY id ASC"
    );

    return result.rows as Room[];
  }

  async findByCode(code: string): Promise<Room | undefined> {
    const result = await db.query(
      "SELECT * FROM rooms WHERE code = $1",
      [code]
    );

    return result.rows[0] as Room | undefined;
  }

  async findById(id: number): Promise<Room | undefined> {
    const result = await db.query(
      "SELECT * FROM rooms WHERE id = $1",
      [id]
    );

    return result.rows[0] as Room | undefined;
  }

  async create({ code, name, is_global = false }: CreateRoomDTO): Promise<Room> {
    const result = await db.query(
      `
      INSERT INTO rooms (code, name, is_global)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [code, name ?? null, is_global]
    );

    return result.rows[0] as Room;
  }
}