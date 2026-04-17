import { Request, Response } from "express";
import { ServiceRooms } from "../services/serviceRooms.js";

export class ControllerRooms {
  async index(req: Request, res: Response) {
    try {
      const serviceRooms = new ServiceRooms();
      const rooms = await serviceRooms.index();

      return res.json(rooms);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: error instanceof Error ? error.message : "Erro interno",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { code, name, is_global } = req.body;

      const serviceRooms = new ServiceRooms();
      const result = await serviceRooms.create({
        code,
        name,
        is_global,
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