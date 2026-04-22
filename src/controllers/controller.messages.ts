import { Request, Response } from "express";
import { ServiceMenssagens } from "../services/serviceMenssagens.js";
import { AuthRequest } from "../middlewares/auth.js";

export class ControllerMessages {
  async indexByRoom(req: Request, res: Response) {
    try {
      const { roomCode } = req.params;

      if (!roomCode || typeof roomCode !== "string") {
        return res.status(400).json({
          error: "Código da sala inválido",
        });
      }

      const serviceMenssagens = new ServiceMenssagens();
      const messages = await serviceMenssagens.indexByRoom(roomCode);

      return res.json(messages);
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        error: error instanceof Error ? error.message : "Erro interno",
      });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      const { roomCode, text } = req.body;

      if (!userId) {
        return res.status(401).json({
          error: "Usuário não autenticado",
        });
      }

      if (!text || !text.trim()) {
        return res.status(400).json({
          error: "Texto da mensagem é obrigatório",
        });
      }

      const serviceMenssagens = new ServiceMenssagens();
      const result = await serviceMenssagens.create({
        userId,
        roomCode,
        text,
      });

      return res.status(201).json(result);
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        error: error instanceof Error ? error.message : "Erro interno",
      });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      const messageId = Number(req.params.id);
      const { text } = req.body;

      if (!userId) {
        return res.status(401).json({
          error: "Usuário não autenticado",
        });
      }

      if (!text || !text.trim()) {
        return res.status(400).json({
          error: "Texto da mensagem é obrigatório",
        });
      }

      if (Number.isNaN(messageId)) {
        return res.status(400).json({
          error: "ID da mensagem inválido",
        });
      }

      const serviceMenssagens = new ServiceMenssagens();

      const result = await serviceMenssagens.update({
        userId,
        messageId,
        text,
      });

      return res.json(result);
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        error: error instanceof Error ? error.message : "Erro interno",
      });
    }
  }

  async delete(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const messageId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    if (Number.isNaN(messageId)) {
      return res.status(400).json({
        error: "ID da mensagem inválido",
      });
    }

    const serviceMenssagens = new ServiceMenssagens();
    const result = await serviceMenssagens.delete({
      userId,
      messageId,
    });

    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      error: error instanceof Error ? error.message : "Erro interno",
    });
  }
}


}
