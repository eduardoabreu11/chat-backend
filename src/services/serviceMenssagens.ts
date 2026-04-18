import jwt from "jsonwebtoken";
import { RepositoryMenssagens } from "../repositories/repoMenssagens.js";
import { RepositoryRooms } from "../repositories/repoRooms.js";
import { RepositoryUsuarios } from "../repositories/repoUsuarios.js";

interface CreateMensagemDTO {
  token: string;
  roomCode: string;
  text: string;
}

interface UpdateMensagemDTO {
  messageId: number;
  token: string;
  text: string;
}

interface DeleteMensagemDTO {
  messageId: number;
  token: string;
}

interface TokenPayload {
  id: number;
}

export class ServiceMenssagens {
  async indexByRoom(roomCode: string) {
    const repositoryRooms = new RepositoryRooms();
    const repositoryMenssagens = new RepositoryMenssagens();

    const room = await repositoryRooms.findByCode(roomCode);

    if (!room) {
      throw new Error("Sala não encontrada.");
    }

    return repositoryMenssagens.findByRoomId(room.id);
  }

  async create({ token, roomCode, text }: CreateMensagemDTO) {
    if (!token) {
      throw new Error("Token obrigatório.");
    }

    if (!text?.trim()) {
      throw new Error("Texto da mensagem é obrigatório.");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    const repositoryUsuarios = new RepositoryUsuarios();
    const repositoryRooms = new RepositoryRooms();
    const repositoryMenssagens = new RepositoryMenssagens();

    const user = await repositoryUsuarios.findById(decoded.id);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const room = await repositoryRooms.findByCode(roomCode);
    if (!room) {
      throw new Error("Sala não encontrada.");
    }

    return repositoryMenssagens.create({
      user_id: user.id,
      room_id: room.id,
      text: text.trim(),
    });
  }

  async update({ messageId, token, text }: UpdateMensagemDTO) {
    if (!token) {
      throw new Error("Token obrigatório.");
    }

    if (!text?.trim()) {
      throw new Error("Texto da mensagem é obrigatório.");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    const repositoryUsuarios = new RepositoryUsuarios();
    const repositoryMenssagens = new RepositoryMenssagens();

    const user = await repositoryUsuarios.findById(decoded.id);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const message = await repositoryMenssagens.findById(messageId);
    if (!message) {
      throw new Error("Mensagem não encontrada.");
    }

    if (message.user_id !== user.id) {
      throw new Error("Você não pode editar esta mensagem.");
    }

    return repositoryMenssagens.update({
      id: messageId,
      text: text.trim(),
    });
  }

  async delete({ messageId, token }: DeleteMensagemDTO) {
    if (!token) {
      throw new Error("Token obrigatório.");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    const repositoryUsuarios = new RepositoryUsuarios();
    const repositoryMenssagens = new RepositoryMenssagens();

    const user = await repositoryUsuarios.findById(decoded.id);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const message = await repositoryMenssagens.findById(messageId);
    if (!message) {
      throw new Error("Mensagem não encontrada.");
    }

    if (message.user_id !== user.id) {
      throw new Error("Você não pode excluir esta mensagem.");
    }

    await repositoryMenssagens.delete(messageId);

    return {
      message: "Mensagem excluída com sucesso.",
    };
  }
}