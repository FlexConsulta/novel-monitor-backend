import Models from "../database/schemas/default.js";
import TableServers from "../database/models/servers.model.js";
import TableDatabase from "../database/models/databases.model.js";
import { Op } from "sequelize";

const getAll = async (req, res, next) => {
  try {
    res.status(400);
    const { page, paginate, name, url, ativo, port } = req.query;

    let filter = [];

    if (name) filter = [{ name: { [Op.iLike]: `%${name}%` } }];
    if (url) filter = [...filter, { url: { [Op.iLike]: `%${url}%` } }];
    if (ativo) filter = [...filter, { ativo }];
    if (port) filter = [...filter, { port }];

    const data = await Models.getAll({
      page,
      paginate,
      filter,
      sort: [["name", "ASC"]],
      model: TableServers,
    });
    const dataActive = await Models.getAll({
      page,
      paginate,
      filter: [{ ativo: true }],
      model: TableServers,
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
    id = Number(id);
    if (isNaN(id)) throw new Error("O formato do ID está incorreto!");

    const data = await Models.getOne({
      model: TableServers,
      filter: { id },
    });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum servidor foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    res.status(400);

    let { name, url } = req.body;
    let hasName = await Models.getOne({
      model: TableServers,
      filter: { name },
      attributes: ["id"],
    });
    if (hasName) {
      res.status(409);
      throw new Error("Nome já utilizado");
    }

    const data = await Models.createOne({
      model: TableServers,
      data: req.body,
    });

    res.status(200);
    res.send(data);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    res.status(400);
    const { id } = req.params;
    let { name, url } = req.body;

    let rsltContensServer = await Models.getOne({
      model: TableServers,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltContensServer) {
      res.status(404);
      throw new Error("Servidor não encontrado");
    }

    if (name) {
      let hasName = await Models.getOne({
        model: TableServers,
        filter: { name },
        attributes: ["id"],
      });
      if (hasName && hasName.id !== Number(id)) {
        res.status(409);
        throw new Error("Nome já utilizado");
      }
    }

    const data = await Models.updateOne({
      model: TableServers,
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

    console.log(id);

    let rsltServer = await Models.getOne({
      model: TableServers,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltServer) {
      res.status(404);
      throw new Error("Servidor não encontrado");
    }

    let hasServerDatabase = await Models.getOne({
      model: TableDatabase,
      filter: { id_server: id },
      attributes: ["id"],
    });

    if (hasServerDatabase) {
      res.status(500);
      throw new Error(
        "Existem bancos de dados relacionados à este servidor, não é possível excluí-lo."
      );
    }

    await Models.deleteOne({
      model: TableServers,
      filter: { id },
    });

    res.status(200);
    res.send(id);
  } catch (error) {
    next(error);
  }
};

export default { getAll, getOne, create, update, deleteOne };
