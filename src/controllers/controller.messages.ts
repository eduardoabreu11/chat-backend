import { Request, Response } from "express";
import { ServiceMenssagens } from "../services/serviceMenssagens.js";

export class ControllerMessages {
  async indexByRoom(req: Request, res: Response) {
    try {
      const roomCode = req.params.roomCode as string;

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

  async create(req: Request, res: Response) {
    try {
      const { token, roomCode, text } = req.body;

      const serviceMenssagens = new ServiceMenssagens();
      const result = await serviceMenssagens.create({
        token,
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

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { token, text } = req.body;

      const serviceMenssagens = new ServiceMenssagens();
      const result = await serviceMenssagens.update({
        messageId: Number(id),
        token,
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

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { token } = req.body;

      const serviceMenssagens = new ServiceMenssagens();
      const result = await serviceMenssagens.delete({
        messageId: Number(id),
        token,
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