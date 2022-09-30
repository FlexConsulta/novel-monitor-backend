import express from "express";

const router = express.Router();

import EmailController from "../controllers/emails.controller";

router
  .route("/api/email")
  .get(EmailController.getAll);


export default router;
