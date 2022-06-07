import express from "express";
import * as deviceController from "../controllers/deviceController.js";

const router = express.Router();

router.get("/", deviceController.deviceList);

router.get("/create", deviceController.getDeviceCreate);
router.post("/create", deviceController.postDeviceCreate);

router.get("/:id", deviceController.deviceDetail);

router.get("/:id/update", deviceController.getDeviceUpdate);
router.post("/:id/update", deviceController.postDeviceUpdate);

router.get("/:id/delete", deviceController.getDeviceDelete);
router.post("/:id/delete", deviceController.postDeviceDelete);

export default router;
