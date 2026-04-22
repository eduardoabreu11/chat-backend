import { RepositoryUsuarios } from "../repositories/repoUsuarios.js";
import { generateToken } from "../token.js";

interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

export class ServiceUsuarios {

  private repository = new RepositoryUsuarios();

  async register({ name, email, password }: RegisterDTO) {
    const userExists = await this.repository.findByEmail(email);

    if (userExists) {
      throw new Error("User already exists");
    }

    const user = await this.repository.create({
      name,
      email,
      password,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      message: "User created",
      token,
    };
  }

  async login({ email, password }: LoginDTO) {
    const user = await this.repository.findByEmail(email);

    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      message: "Login success",
      token,
    };
  }

 async profile(userId: number) {
  const user = await this.repository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}





}

