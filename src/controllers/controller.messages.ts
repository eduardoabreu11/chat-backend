import { Request, Response } from "express";
import { ServiceMenssagens } from "../services/serviceMenssagens.js";

export class ControllerMessages {
  async indexByRoom(req: Request, res: Response) {
    try {
      const { roomCode } = req.params;

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
}