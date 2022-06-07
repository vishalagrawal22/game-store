import express from "express";
import * as gameController from "../controllers/gameController.js";

const router = express.Router();

router.get("/", gameController.gameList);

router.get("/create", gameController.getGameCreate);
router.post("/create", gameController.postGameCreate);

router.get("/:id", gameController.gameDetail);

router.get("/:id/update", gameController.getGameUpdate);
router.post("/:id/update", gameController.postGameUpdate);

router.get("/:id/delete", gameController.getGameDelete);
router.post("/:id/delete", gameController.postGameDelete);

export default router;
