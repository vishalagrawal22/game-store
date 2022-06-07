import express from "express";
import * as gameController from "../controllers/gameController.js";

const router = express.Router();

router.get("/", gameController.gameList);

export default router;
