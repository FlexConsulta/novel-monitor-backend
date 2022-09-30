import express from "express";
import expressValidator from "../middlewares/express-validator";
const router = express.Router();

import SendForgotPasswordMailController from "../controllers/SendForgotPasswordMail.controller";

router
  .route("/api/passwordrecovery")
  .get()
  .post(
    // fieldsValidations("authenticate"),
    expressValidator,
    SendForgotPasswordMailController.recovery
  );


export default router;
