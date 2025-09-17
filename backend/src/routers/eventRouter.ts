import { Router } from "express";
import { eventController } from "../controllers/eventController";

const router = Router();

router.get("/", eventController.getAll);
router.get("/:id", eventController.getById);
router.post("/", eventController.create);
router.patch("/:id", eventController.update);
router.delete("/:id", eventController.remove);

export default router;
