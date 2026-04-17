import { RepositoryMenssagens } from "../repositories/repoMenssagens.js";
import { RepositoryRooms } from "../repositories/repoRooms.js";
import { verifyToken } from "../token.js";

interface CreateMessageDTO {
  token: string;
  roomCode: string;
  text: string;
}

export class ServiceMenssagens {
  private repository = new RepositoryMenssagens();
  private roomRepository = new RepositoryRooms();

  async indexByRoom(roomCode: string) {
    const room = await this.roomRepository.findByCode(roomCode);

    if (!room) {
      throw new Error("Room not found");
    }

    return await this.repository.findByRoomId(room.id);
  }

  async create({ token, roomCode, text }: CreateMessageDTO) {
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new Error("Invalid token");
    }

    const room = await this.roomRepository.findByCode(roomCode);

    if (!room) {
      throw new Error("Room not found");
    }

    const message = await this.repository.create({
      user_id: decoded.userId,
      room_id: room.id,
      text,
    });

    return {
      message: "Message created",
      data: message,
    };
  }
}