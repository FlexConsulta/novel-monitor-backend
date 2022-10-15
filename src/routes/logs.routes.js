import express from "express";
const router = express.Router();
import expressValidator from "../middlewares/express-validator";
import fieldsValidations from "../utils/validations.utils";

import LogsController from "../controllers/logs.controller";

router
  .route("/api/logs")
  .get(LogsController.getAll)
  .post(fieldsValidations("logs"), expressValidator, LogsController.create);

router.route("/api/logs/server").get(LogsController.getAllByServer);

router.route("/api/logs/customer").get(LogsController.getAllByCustomer);

router.route("/api/logs/database").get(LogsController.getAllByDataBase);

router
  .route("/api/logs/:id")
  .get(LogsController.getOne)
  .put(fieldsValidations("logsUp"), expressValidator, LogsController.update)
  .delete(LogsController.deleteOne);

export default router;
