import { Router } from "express";

// controllers (mantendo seus nomes)
import { ControllerUsuario } from "./controllers/controller.usuario.js";
import { ControllerRooms } from "./controllers/controller.rooms.js";
import { ControllerMessages } from "./controllers/controller.messages.js";

const router = Router();

// instâncias
const controllerUsuario = new ControllerUsuario();
const controllerRooms = new ControllerRooms();
const controllerMessages = new ControllerMessages();

/**
 * ============================
 * HEALTH CHECK
 * ============================
 */
router.get("/", (req, res) => {
  return res.json({ message: "API running 🚀" });
});

/**
 * ============================
 * USUÁRIO (AUTH)
 * ============================
 */
router.post("/register", (req, res) =>
  controllerUsuario.register(req, res)
);

router.post("/login", (req, res) =>
  controllerUsuario.login(req, res)
);

/**
 * ============================
 * ROOMS
 * ============================
 */
router.get("/rooms", (req, res) =>
  controllerRooms.index(req, res)
);

router.post("/rooms", (req, res) =>
  controllerRooms.create(req, res)
);

/**
 * ============================
 * MESSAGES
 * ============================
 */
router.get("/messages/:roomCode", (req, res) =>
  controllerMessages.indexByRoom(req, res)
);

router.post("/messages", (req, res) =>
  controllerMessages.create(req, res)
);

export default router;