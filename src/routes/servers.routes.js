import express from "express";
import expressValidator from "../middlewares/express-validator";
import fieldsValidations  from "../utils/validations.utils";
const router = express.Router();

import ServersController from "../controllers/servers.controller";

router
  .route("/api/servers")
  .get(ServersController.getAll)
  .post(
    fieldsValidations("servers"),
    expressValidator,
    ServersController.create
  );

router
  .route("/api/servers/:id")
  .get(ServersController.getOne)
  .put(
    fieldsValidations("serversUp"),
    expressValidator,
    ServersController.update
  )
  .delete(ServersController.deleteOne);

export default router;
