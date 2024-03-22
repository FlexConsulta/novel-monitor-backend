import express from "express";

const router = express.Router();

import ResumeController from "../controllers/resume.controller.js";

router.route("/api/resume").get(ResumeController.getAll);

export default router;
