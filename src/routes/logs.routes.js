import express from "express";
const router = express.Router();
import expressValidator from "../middlewares/express-validator.js";
import fieldsValidations from "../utils/validations.utils.js";

import LogsController from "../controllers/logs.controller.js";

router
  .route("/api/logs")
  .get(LogsController.getAll)
  .post(fieldsValidations("logs"), expressValidator, LogsController.create);

router.route("/api/logs/server").get(LogsController.getAllByServer);

router.route("/api/logs/customer").get(LogsController.getAllByCustomer);

router.route("/api/logs/database").get(LogsController.getAllByDataBase);

router.route("/api/logs/sync").post(LogsController.syncDatabases);

router.route("/api/logs/test-connection").get(LogsController.testConnection);

router
  .route("/api/logs/:id")
  .get(LogsController.getOne)
  .put(fieldsValidations("logsUp"), expressValidator, LogsController.update)
  .delete(LogsController.deleteOne);

export default router;
