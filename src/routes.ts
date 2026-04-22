import { Router } from "express";
import { auth } from "./middlewares/auth.js";

import { ControllerUsuario } from "./controllers/controller.usuario.js";
import { ControllerRooms } from "./controllers/controller.rooms.js";
import { ControllerMessages } from "./controllers/controller.messages.js";

const router = Router();

const controllerUsuario = new ControllerUsuario();
const controllerRooms = new ControllerRooms();
const controllerMessages = new ControllerMessages();

router.get("/", (req, res) => {
  return res.json({ message: "API running 🚀" });
});

// públicas
router.post("/register", (req, res) =>
  controllerUsuario.register(req, res)
);

router.post("/login", (req, res) =>
  controllerUsuario.login(req, res)
);

// tudo abaixo protegido
router.use(auth);

// user

router.get("/profile", (req, res) =>
  controllerUsuario.profile(req, res)
);

// salas

router.get("/rooms", (req, res) =>
  controllerRooms.index(req, res)
);

router.post("/rooms", (req, res) =>
  controllerRooms.create(req, res)
);

// mensagens

router.get("/messages/:roomCode", (req, res) =>
  controllerMessages.indexByRoom(req, res)
);

router.post("/messages", (req, res) =>
  controllerMessages.create(req, res)
);

router.put("/messages/:id", (req, res) =>
  controllerMessages.update(req, res)
);

router.delete("/messages/:id", (req, res) =>
  controllerMessages.delete(req, res)
);
export default router;