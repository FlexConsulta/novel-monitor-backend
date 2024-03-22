import express from "express";
import expressValidator from "../middlewares/express-validator.js";
import fieldsValidations  from "../utils/validations.utils.js";
import ClientsController from "../controllers/clients.controller.js";

const router = express.Router();

router
  .route("/api/clients")
  .get(ClientsController.getAll)
  .post(
    fieldsValidations("clients"),
    expressValidator,
    ClientsController.create
  );

router
  .route("/api/clients/:id")
  .get(ClientsController.getOne)
  .put(
    fieldsValidations("clientsUp"),
    expressValidator,
    ClientsController.update
  )
  .delete(ClientsController.deleteOne);

export default router;
