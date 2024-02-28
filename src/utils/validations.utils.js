import { body } from "express-validator";

const fields = (type) => {
  let data = null;

  switch (type) {
    case "clients":
      data = [
        body("name").not().isEmpty().trim().escape(),
        // body("cnpj").matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/),
      ];
      break;
    case "servers":
      data = [
        body("name").not().isEmpty().trim().escape(),
        body("url").not().isEmpty().trim().escape(),
        body("port").not().isEmpty().isNumeric(),
      ];
      break;
    case "databases":
      data = [
        body("name_client").not().isEmpty().trim().escape(),
        body("user_client").not().isEmpty().trim().escape(),
        body("password_client").not().isEmpty().trim().escape(),
        body("port_client").not().isEmpty().trim().escape(),
        body("schemabd").not().isEmpty().trim().escape(),
        body("schemabd_default").not().isEmpty().trim().escape(),
      ];
      break;
    case "logs":
      data = [body("description").not().isEmpty().trim().escape()];
      break;
    case "profile":
      data = [
        body("name").not().isEmpty().trim().escape(),
        body("type").isIn(["administracao", "clientes"]),
      ];
      break;
    case "persons":
      data = [
        body("name").not().isEmpty().trim().escape(),
        body("email").isEmail(),
        body("password").isLength({ min: 8 }).optional({ nullable: false }),
        body("phone").isMobilePhone().optional({ nullable: true }),
      ];
      break;
    case "authenticate":
      data = [
        body("email").isEmail().not().isEmpty(),
        body("password").isLength({ min: 8 }).not().isEmpty(),
      ];
      break;
    case "users":
      data = [
        body("active").isBoolean(),
        body("id_person").isInt(),
        body("id_profile").isInt(),
        body("id_client").isInt().optional({ nullable: true }),
      ];
      break;
    case "clientsUp":
      data = [
        body("name")
          .not()
          .isEmpty()
          .trim()
          .escape()
          .optional({ nullable: true }),
      ];
      break;
    case "serversUp":
      data = [
        body("name")
          .not()
          .isEmpty()
          .trim()
          .escape()
          .optional({ nullable: true }),
        body("url")
          .not()
          .isEmpty()
          .trim()
          .escape()
          .optional({ nullable: true }),
        body("port").not().isEmpty().isNumeric(),
      ];
      break;
    case "databasesUp":
      data = [
        body("id_server").isInt(),
        body("name_client")
          .not()
          .isEmpty()
          .trim()
          .escape()
          .optional({ nullable: true }),
        body("user_client")
          .not()
          .isEmpty()
          .trim()
          .escape()
          .optional({ nullable: true }),
        body("password_client")
          .not()
          .isEmpty()
          .trim()
          .escape()
          .optional({ nullable: true }),
        body("port_client")
          .not()
          .isEmpty()
          .trim()
          .escape()
          .optional({ nullable: true }),
        body("schemabd")
          .not()
          .isEmpty()
          .trim()
          .escape()
          .optional({ nullable: true }),
        body("schemabd_default")
          .not()
          .isEmpty()
          .trim()
          .escape()
          .optional({ nullable: true }),
      ];
      break;
    case "logsUp":
      data = [
        body("description")
          .not()
          .isEmpty()
          .trim()
          .escape()
          .optional({ nullable: true }),
      ];
      break;
    case "profileUp":
      data = [
        body("name")
          .not()
          .isEmpty()
          .trim()
          .escape()
          .optional({ nullable: true }),
        body("type")
          .isIn(["administracao", "clientes"])
          .optional({ nullable: true }),
      ];
      break;
    case "personsUp":
      data = [
        body("name")
          .not()
          .isEmpty()
          .trim()
          .escape()
          .optional({ nullable: true }),
        body("email").isEmail().optional({ nullable: true }),
        body("password").isLength({ min: 8 }).optional({ nullable: true }),
        body("phone").isMobilePhone().optional({ nullable: true }),
      ];
      break;
    case "usersUp":
      data = [
        body("active").isBoolean().optional({ nullable: true }),
        body("id_person").isInt().optional({ nullable: true }),
        body("id_profile").isInt().optional({ nullable: true }),
        body("id_client").isInt().optional({ nullable: true }),
      ];
      break;
  }

  return data;
};

export default fields;
