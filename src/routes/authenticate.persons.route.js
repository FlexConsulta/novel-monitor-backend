import express from "express";
import expressValidator from "../middlewares/express-validator.js";
import fieldsValidations  from "../utils/validations.utils.js";
const router = express.Router();

import AuthenticatePersonsController from "../controllers/authenticate.persons.controller.js";

router
  .route("/api/authenticate")
  .get()
  .post(
    fieldsValidations("authenticate"),
    expressValidator,
    AuthenticatePersonsController.execute
  );


export default router;
