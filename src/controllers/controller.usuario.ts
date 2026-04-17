import { Request, Response } from "express";
import { ServiceUsuarios } from "../services/serviceUsuario.js";

export class ControllerUsuario {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const serviceUsuarios = new ServiceUsuarios();
      const result = await serviceUsuarios.register({
        name,
        email,
        password,
      });

      return res.status(201).json(result);
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        error: error instanceof Error ? error.message : "Erro interno",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const serviceUsuarios = new ServiceUsuarios();
      const result = await serviceUsuarios.login({
        email,
        password,
      });

      return res.json(result);
    } catch (error) {
      console.error(error);

      return res.status(401).json({
        error: error instanceof Error ? error.message : "Erro interno",
      });
    }
  }
}