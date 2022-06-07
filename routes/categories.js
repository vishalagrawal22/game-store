import express from "express";
import * as categoryController from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", categoryController.categoryList);

router.get("/create", categoryController.getCategoryCreate);
router.post("/create", categoryController.postCategoryCreate);

router.get("/:id", categoryController.categoryDetail);

router.get("/:id/update", categoryController.getCategoryUpdate);
router.post("/:id/update", categoryController.postCategoryUpdate);

router.get("/:id/delete", categoryController.getCategoryDelete);
router.post("/:id/delete", categoryController.postCategoryDelete);

export default router;
