import express from "express";
const router = express.Router();
import expressValidator from "../middlewares/express-validator";
import fieldsValidations  from "../utils/validations.utils";

import ProfilesController from "../controllers/profiles.controller";

router
  .route("/api/profile")
  .post(
    fieldsValidations("profile"),
    expressValidator,
    ProfilesController.create
  )
  .get(ProfilesController.getAll);
router
  .route("/api/profile/:id")
  .get(ProfilesController.getOne)
  .put(
    fieldsValidations("profileUp"),
    expressValidator,
    ProfilesController.update
  )
  .delete(ProfilesController.deleteOne);

export default router;
