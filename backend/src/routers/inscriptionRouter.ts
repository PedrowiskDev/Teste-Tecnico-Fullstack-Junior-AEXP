import { Router } from "express";
import { inscriptionController } from "../controllers/inscriptionController";

const router = Router();

router.post("/:id/inscriptions", inscriptionController.create);
router.get("/:id/inscriptions", inscriptionController.getByEvent);
router.get(
  "/:id/inscriptions/count",
  inscriptionController.getInscriptionCount
);
router.delete(
  "/:eventId/inscriptions",
  inscriptionController.removeByEventAndPhone
);

export default router;
