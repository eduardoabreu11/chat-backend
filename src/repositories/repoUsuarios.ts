import db from "../database/postgresql.js";

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
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    return result.rows[0] as User | undefined;
  }

  async findById(id: number): Promise<User | undefined> {
    const result = await db.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [id]
    );

    return result.rows[0] as User | undefined;
  }

  async create({ name, email, password }: CreateUsuarioDTO): Promise<User> {
    const result = await db.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, email, password]
    );

    return result.rows[0] as User;
  }
}