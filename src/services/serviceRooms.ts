import { RepositoryRooms } from "../repositories/repoRooms";

interface CreateRoomDTO {
  code: string;
  name?: string;
  is_global?: number;
}

export class ServiceRooms {
  private repository = new RepositoryRooms();

  async index() {
    return await this.repository.findAll();
  }

  async create({ code, name, is_global }: CreateRoomDTO) {
    const exists = await this.repository.findByCode(code);

    if (exists) {
      throw new Error("Room already exists");
    }

    const room = await this.repository.create({
      code,
      name,
      is_global,
    });

    return {
      message: "Room created",
      room,
    };
  }
}