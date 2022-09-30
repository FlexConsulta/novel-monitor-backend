import express from "express";
import expressValidator from "../middlewares/express-validator";
import fieldsValidations  from "../utils/validations.utils";
const router = express.Router();

import AuthenticatePersonsController from "../controllers/authenticate.persons.controller";

router
  .route("/api/authenticate")
  .get()
  .post(
    fieldsValidations("authenticate"),
    expressValidator,
    AuthenticatePersonsController.execute
  );


export default router;
