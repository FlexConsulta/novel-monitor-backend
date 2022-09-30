import {Router} from "express";
import expressValidator from "../middlewares/express-validator";
import fieldsValidations  from "../utils/validations.utils";
const router = Router();
import PersonsController from "../controllers/persons.controller";

router
  .route("/api/persons")
  .get(PersonsController.getAll)
  .post(
    fieldsValidations("persons"),
    expressValidator,
    PersonsController.create
  );

router
  .route("/api/persons/:id")
  .get(PersonsController.getOne)
  .put(
    fieldsValidations("personsUp"),
    expressValidator,
    PersonsController.update
  )
  .delete(PersonsController.deleteOne);

export default router;
