import express from "express";
const router = express.Router();
import expressValidator from "../middlewares/express-validator.js";
import fieldsValidations  from "../utils/validations.utils.js";

import ProfilesController from "../controllers/profiles.controller.js";

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
