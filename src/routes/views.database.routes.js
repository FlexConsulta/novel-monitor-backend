import express from "express";
import expressValidator from "../middlewares/express-validator.js";
import fieldsValidations  from "../utils/validations.utils.js";
const router = express.Router();

import ViewsDatabaseController from "../controllers/views.database.controller.js";

router
  .route("/api/view")
  .get(ViewsDatabaseController.getAll)
  .post(ViewsDatabaseController.create);

router
  .route("/api/view/:id")
  .get(ViewsDatabaseController.getOne)
  .put(ViewsDatabaseController.update)
  .delete(ViewsDatabaseController.deleteOne);

export default router;
