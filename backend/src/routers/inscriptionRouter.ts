import { Router } from "express";
import { inscriptionController } from "../controllers/inscriptionController";

const router = Router();

router.post("/:id/inscriptions", inscriptionController.create);
router.get("/:id/inscriptions", inscriptionController.getByEvent);
router.delete("/inscriptions/:id", inscriptionController.remove);

export default router;
