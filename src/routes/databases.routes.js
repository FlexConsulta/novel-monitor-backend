import express from "express";
import expressValidator from "../middlewares/express-validator.js";
import fieldsValidations  from "../utils/validations.utils.js";
const router = express.Router();
import DatabasesController from "../controllers/databases.controller.js";

router
  .route("/api/databases")
  .get(DatabasesController.getAll)
  .post(
    fieldsValidations("databases"),
    expressValidator,
    DatabasesController.create
  );

router
  .route("/api/databases/:id")
  .get(DatabasesController.getOne)
  .put(
    fieldsValidations("databasesUp"),
    expressValidator,
    DatabasesController.update
  )
  .delete(DatabasesController.deleteOne);

export default router;
