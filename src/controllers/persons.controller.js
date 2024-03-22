import Models from "../database/schemas/default.js";
import TablePersons from "../database/models/persons.model.js";
import { hash } from "bcrypt";
import { Op } from "sequelize";
import { resolve } from "path";
import crypto from "crypto";
import Transporter from "../services/email.service.js";

const create = async (req, res, next) => {
  try {
    res.status(400);

    const { phone, email, name } = req.body;

    const newPassword = crypto.randomBytes(20).toString("hex").substring(0, 8);
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



    const templatePath = `
    <style>
    .container {
        width: 800px;
        font-family: Arial, Helvetica, sans-serif;
        align-items: center;
        display: flex;
        flex-direction: column;
    }
</style>

<div class="container">
    <span>Oi, ${mailVariables.name} </span>
    <br>
    <br>
    <span>Você foi cadastrado no monitor de banco de dados da Novel, sua senha é:  ${mailVariables.newPassword}</span>
    <br>
    <h3>Equipe | <strong>DCL Brasil Tecnologia</strong></h3>
</div>
`

    await Transporter({
      from: 'syncbackupdlcbrasiltecnologia@gmail.com',
      to: process.env.EMAIL_FOR_TEST || email,
      subject: "Monitor Backup",
      text: templatePath,
      html: templatePath,

    })
      .then((result) => console.log(`[>] Mail enviado com sucesso: [${result.envelope.to}]`))
      .catch((err) => console.log(`[>] Ocorreu um erro no envio do mail: ${err}`));

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
