import Models from "../database/schemas/default";
import TableUsers from "../database/models/users.model";
import TablePerson from "../database/models/persons.model";
import TableClients from "../database/models/clients.model";
import TableProfile from "../database/models/profiles.model";
import TableViewDatabase from "../database/models/views.databases.model";
import TableProfiles from "../database/models/profiles.model";
import TablePersons from "../database/models/persons.model";
import { Op } from "sequelize";

const create = async (req, res, next) => {
  try {
    res.status(400);
    const { id_person, id_profile, id_client } = req.body;

    const obj = {
      person: { id: id_person },
      profile: { id: id_profile },
      client: { id: id_client },
    };

    let rslPersons = await Models.getOne({
      model: TablePerson,
      filter: { id: obj.person.id },
      attributes: ["id"],
    });

    if (!rslPersons) {
      res.status(404);
      throw new Error("Pessoa não encontrada");
    }

    let rsltprofile = await Models.getOne({
      model: TableProfile,
      filter: { id: obj.profile.id },
      attributes: ["id"],
    });

    if (!rsltprofile) {
      res.status(404);
      throw new Error("Perfil não encontrado");
    }

    if (id_client) {
      let rsltClient = await Models.getOne({
        model: TableClients,
        filter: { id: obj.client.id },
        attributes: ["id"],
      });

      if (obj?.client?.id && !rsltClient) {
        res.status(404);
        throw new Error("Cliente não encontrado");
      }
    }

    let rslPersonsUnique = await Models.getOne({
      model: TableUsers,
      filter: { id_person },
      attributes: ["id"],
    });
    if (rslPersonsUnique) {
      res.status(409);
      throw new Error("Pessoa já Cadastrada");
    }

    const data = await Models.createOne({
      model: TableUsers,
      data: req.body,
    });

    res.status(200);
    res.send(data || "Nenhum usuario foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    res.status(400);
    const { page, paginate, name, email, profile, active } = req.query;

    let filterPerson;
    let filterProfile;
    let filter;

    if (name) filterPerson = [{ name: { [Op.iLike]: `%${name}%` } }];
    if (email)
      filterPerson = [...filterPerson, { email: { [Op.iLike]: `%${email}%` } }];
    if (profile) filterProfile = [{ name: { [Op.iLike]: `%${profile}%` } }];
    if (active) filter = [{ active }];

    TableUsers.associate([TablePersons, TableProfiles, TableClients]);

    const data = await Models.getAll({
      page,
      paginate,
      model: TableUsers,
      filter,
      sort: [[TablePersons, "name", "ASC"]],

      include: [
        { model: TablePersons, where: filterPerson },
        { model: TableClients },
        { model: TableProfiles, where: filterProfile },
      ],
    });

    const dataActive = await Models.getAll({
      page,
      paginate,
      model: TableUsers,
      filter: [{ active: true }],
      include: [
        { model: TablePersons, where: filterPerson },
        { model: TableClients },
        { model: TableProfiles, where: filterProfile },
      ],
    });

    res.status(!data ? 404 : 200);
    res.send({ ...data, totalActiveRecords: dataActive.total });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    res.status(400);

    let { id } = req.params;

    if (isNaN(id)) throw new Error("O formato do ID está incorreto!");

    TableUsers.associate([TablePersons, TableProfiles, TableClients]);

    const data = await Models.getOne({
      model: TableUsers,
      filter: { id },
      include: [
        { model: TablePersons },
        { model: TableClients },
        { model: TableProfiles },
      ],
    });

    res.status(!data ? 404 : 200);

    delete data?.dataValues?.person?.dataValues?.password;

    res.send(data || "Nenhum usuario foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    res.status(400);
    let { id } = req.params;

    let { id_person, id_profile, id_client } = req.body;

    let rsltContensUser = await Models.getOne({
      model: TableUsers,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltContensUser) {
      res.status(404);
      throw new Error("Usuario não encontrado");
    }

    const obj = {
      person: { id: id_person },
      profile: { id: id_profile },
      client: { id: id_client },
    };

    let rslPersons = await Models.getOne({
      model: TablePerson,
      filter: { id: obj.person.id },
      attributes: ["id"],
    });

    if (!rslPersons) {
      res.status(404);
      throw new Error("Pessoa não encontrada");
    }

    let rsltprofile = await Models.getOne({
      model: TableProfile,
      filter: { id: obj.profile.id },
      attributes: ["id"],
    });

    if (!rsltprofile) {
      res.status(404);
      throw new Error("Perfil não encontrado");
    }

    if (id_client) {
      let rsltClient = await Models.getOne({
        model: TableClients,
        filter: { id: obj.client.id },
        attributes: ["id"],
      });

      if (!rsltClient) {
        res.status(404);
        throw new Error("Cliente não encontrado");
      }
    }

    const data = await Models.updateOne({
      model: TableUsers,
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

    let rsltUsers = await Models.getOne({
      model: TableUsers,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltUsers) {
      res.status(404);
      throw new Error("Usuário não encontrado");
    }

    let id_user = rsltUsers;

    let hasUserView = await Models.getOne({
      model: TableViewDatabase,
      filter: id_user,
      attributes: ["id"],
    });

    if (hasUserView) {
      res.status(500);
      throw new Error(
        "Não foi possível excluir o Usuário, pois possui dependência(s)"
      );
    }

    await Models.deleteOne({
      model: TableUsers,
      filter: { id },
    });
    res.status(200);
    res.send(id);
  } catch (error) {
    next(error);
  }
};

export default { create, getAll, deleteOne, getOne, update };
