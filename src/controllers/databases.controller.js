import Models from "../database/schemas/default.js";
import TableDatabases from "../database/models/databases.model.js";
import TableServer from "../database/models/servers.model.js";
import TableClients from "../database/models/clients.model.js";
import TableLogs from "../database/models/logs.model.js";
import TableViewDatabase from "../database/models/views.databases.model.js";
import { Op } from "sequelize";

const getAll = async (req, res, next) => {
  try {
    res.status(400);
    const { page, paginate, server, client, namedefault, sincronizacao } =
      req.query;

    let filter = [];
    let filterServer;
    let filterClient;

    if (namedefault)
      filter = [{ name_default: { [Op.iLike]: `%${namedefault}%` } }];
    if (sincronizacao) filter = [...filter, { sincronizacao }];

    if (server) filterServer = [{ name: { [Op.iLike]: `%${server}%` } }];

    if (client) filterClient = [{ name: { [Op.iLike]: `%${client}%` } }];

    TableDatabases.associate([TableServer, TableClients]);

    const data = await Models.getAll({
      page,
      paginate: paginate || 99999999,
      filter,
      sort: [["name_default", "asc"]],
      model: TableDatabases,
      include: [
        { model: TableServer, where: filterServer },
        { model: TableClients, where: filterClient },
      ],
    });

    const dataActive = await Models.getAll({
      page,
      paginate,
      filter: [{ sincronizacao: true }], // fazer filtros
      model: TableDatabases,
      include: [{ model: TableServer }],
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
      model: TableDatabases,
      filter: { id },
      include: [TableServer],
    });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum banco de dados foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    res.status(400);

    const { id_server } = req.body;

    let hasServer = await Models.getOne({
      model: TableServer,
      filter: { id: id_server },
      attributes: ["id"],
    });
    //Verificar
    if (!hasServer) {
      res.status(404);
      throw new Error("Server não encontrado");
    }

    const data = await Models.createOne({
      model: TableDatabases,
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
    const { id_server } = req.body;

    let rsltContensDatabase = await Models.getOne({
      model: TableDatabases,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltContensDatabase) {
      res.status(404);
      throw new Error("Banco de Dados não encontrado");
    }

    if (id_server) {
      let obj = { id: id_server };
      let hasServer = await Models.getOne({
        model: TableServer,
        filter: { id: obj.id },
        attributes: ["id"],
      });

      if (!hasServer) {
        res.send(404);
        throw new Error("Server não encontrado");
      }
    }

    const data = await Models.updateOne({
      model: TableDatabases,
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

    let rsltDatabase = await Models.getOne({
      model: TableDatabases,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltDatabase) {
      res.status(404);
      throw new Error("Banco de Dados não encontado");
    }

    await Models.deleteOne({
      model: TableDatabases,
      filter: { id },
    });

    res.status(200);
    res.send({ id });
  } catch (error) {
    next(error);
  }
};

export default { getAll, getOne, create, update, deleteOne };
