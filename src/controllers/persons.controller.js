import Models from "../database/schemas/default";
import TablePersons from "../database/models/persons.model";
import { hash } from "bcrypt";
import { Op } from "sequelize";
import { resolve } from "path";
import crypto from "crypto";
import sendMail from "../services/email.service";

const create = async (req, res, next) => {
  try {
    res.status(400);

    const { phone, email, name } = req.body;

    const newPassword = crypto.randomBytes(20).toString("hex").substring(0, 8);
    const __dirname = resolve();
    const templatePath = resolve(__dirname, "src", "utils", "newPassword.hbs");
    const passwordHash = await hash(newPassword, 10);

    if (email) {
      let hasEmail = await Models.getOne({
        model: TablePersons,
        filter: { email },
        attributes: ["id"],
      });

      if (hasEmail) {
        res.status(409);
        throw new Error("Email ja utilizado");
      }
    }

    const data = await Models.createOne({
      model: TablePersons,
      data: { ...req.body, password: passwordHash },
    });

    const mailVariables = {
      name,
      newPassword,
    };
    sendMail(
      process.env.EMAIL_FOR_TEST || email,
      "Cadastro de Usuário",
      mailVariables,
      templatePath
    );

    res.status(200);
    res.send(data || "Nenhuma pessoa foi encontrada!");
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { page, paginate } = req.query;

    res.status(400);
    const data = await Models.getAll({
      model: TablePersons,
      page,
      paginate,
    });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhuma pessoa foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    res.status(400);

    let { id } = req.params;

    if (isNaN(id)) throw new Error("O formato do ID está incorreto!");

    const data = await Models.getOne({ model: TablePersons, filter: { id } });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhuma pessoa foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    res.status(400);
    let { id } = req.params;

    let rsltContensPerson = await Models.getOne({
      model: TablePersons,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltContensPerson) {
      res.status(404);
      throw new Error("Pessoa não encontrada");
    }

    let { email } = req.body;
    if (email) {
      let hasEmail = await Models.getOne({
        model: TablePersons,
        filter: {
          email,
          id: {
            [Op.ne]: id,
          },
        },
        attributes: ["id"],
      });
      if (hasEmail) {
        console.log("id --", id);
        console.log("hasEmail", hasEmail.dataValues);
        res.status(409);
        throw new Error("Email ja utilizado");
      }
    }

    const data = await Models.updateOne({
      model: TablePersons,
      data: req.body,
      filter: { id },
    });

    res.status(200);
    res.send(data);
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    res.status(400);
    const { id } = req.params;

    let rsltPersons = await Models.getOne({
      model: TablePersons,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltPersons) {
      res.status(404);
      throw new Error("Pessoa não encontrada");
    }

    await Models.deleteOne({
      model: TablePersons,
      filter: { id },
    });

    res.status(200);
    res.send(id);
  } catch (error) {
    next(error);
  }
};

export default { create, getAll, deleteOne, getOne, update };
