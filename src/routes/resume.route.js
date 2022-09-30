import express from "express";

const router = express.Router();

import ResumeController from "../controllers/resume.controller";

router.route("/api/resume").get(ResumeController.getAll);

export default router;
