import { RepositoryMenssagens } from "../repositories/repoMenssagens.js";
import { RepositoryRooms } from "../repositories/repoRooms.js";

interface CreateMessageDTO {
  userId: number;
  roomCode: string;
  text: string;
}

interface UpdateMessageDTO {
  userId: number;
  messageId: number;
  text: string;
}

interface DeleteMessageDTO {
  userId: number;
  messageId: number;
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

  async create({ userId, roomCode, text }: CreateMessageDTO) {
  const room = await this.roomRepository.findByCode(roomCode);

  if (!room) {
    throw new Error("Room not found");
  }

  const message = await this.repository.create({
    user_id: userId,
    room_id: room.id,
    text,
  });

  return {
    message: "Message created",
    data: message,
  };
}

  async update({ userId, messageId, text }: UpdateMessageDTO) {
    const message = await this.repository.findById(messageId);

    if (!message) {
      throw new Error("Mensagem não encontrada");
    }

    if (message.user_id !== userId) {
      throw new Error("Você não pode editar essa mensagem");
    }

    const updatedMessage = await this.repository.update(messageId, text);

    return {
      message: "Mensagem atualizada com sucesso",
      data: updatedMessage,
    };
  }

  async delete({ userId, messageId }: DeleteMessageDTO) {
  const message = await this.repository.findById(messageId);

  if (!message) {
    throw new Error("Mensagem não encontrada");
  }

  if (message.user_id !== userId) {
    throw new Error("Você não pode excluir essa mensagem");
  }

  await this.repository.delete(messageId);

  return {
    message: "Mensagem excluída com sucesso",
  };
}


}
