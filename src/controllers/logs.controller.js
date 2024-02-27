import Models from "../database/schemas/default";
import TableLogs from "../database/models/logs.model";
import TableDatabase from "../database/models/databases.model";
import { Sequelize } from "sequelize";
import { Api } from "../services/api";
import ViewLogs from "../database/models/views.log.model";

const getAll = async (req, res, next) => {
  try {
    const { page, paginate } = req.query;

    // console.log(page, paginate);

    res.status(400);
    TableLogs.associate([TableDatabase]);

    const data = await Models.getAll({
      model: ViewLogs,
      sort: [["name_default", "asc"]],
      // page,
      // paginate: paginate || 999999,
    });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum Log foi encontrado!");
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const getAllByServer = async (req, res, next) => {
  const { id_server } = req.query;

  try {
    res.status(400);

    TableLogs.associate([TableDatabase]);

    const databasis = await Models.getAllDefault({
      model: TableDatabase,
      filter: { id_server: id_server },
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("id")), "id_database"],
      ],
    });

    const data = [];

    await Promise.all(
      databasis.map(async (database) => {
        const searchedDatabase = await Models.getAllLimited({
          model: TableLogs,
          limit: 1,
          filter: { id_database: database.dataValues.id_database },
          sort: [["created_at", "DESC"]],
          include: [{ model: TableDatabase }],
        });
        if (searchedDatabase) data.push(searchedDatabase[0].dataValues);
      })
    );

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum Log foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const getAllByDataBase = async (req, res, next) => {
  const { id_database, page, paginate } = req.query;

  try {
    res.status(400);

    TableLogs.associate([TableDatabase]);

    const data = await Models.getAll({
      model: TableLogs,
      page,
      filter: { id_database },
      paginate: paginate || 999999,
      sort: [["created_at", "DESC"]],
      include: [{ model: TableDatabase }],
    });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum Log foi encontrado!");
  } catch (error) {
    next(error);
  }
};
const getAllByCustomer = async (req, res, next) => {
  const { id_customer } = req.query;

  try {
    res.status(400);

    TableLogs.associate([TableDatabase]);

    const databasis = await Models.getAllDefault({
      model: TableDatabase,
      filter: { id_client: id_customer },
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("id")), "id_database"],
      ],
    });

    const data = [];

    await Promise.all(
      databasis.map(async (database) => {
        const searchedDatabase = await Models.getAllLimited({
          model: TableLogs,
          limit: 1,
          filter: { id_database: database.dataValues.id_database },
          sort: [["created_at", "DESC"]],
          include: [{ model: TableDatabase }],
        });
        if (searchedDatabase) data.push(searchedDatabase[0].dataValues);
      })
    );

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum Log foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    res.status(400);

    let { id_database } = req.body;

    const obj = { id: id_database };
    let rsltDatabase = await Models.getOne({
      model: TableDatabase,
      filter: obj.id,
      attributes: ["id"],
    });

    if (!rsltDatabase) {
      res.status(404);
      throw new Error("Database não encontrada");
    }

    const data = await Models.createOne({ model: TableLogs, data: req.body });

    res.status(200);
    res.send(data);
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    res.status(400);

    let { id } = req.params;

    if (isNaN(id)) throw new Error("O formato do ID está incorreto!");

    const data = await Models.getOne({ model: TableLogs, filter: { id } });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum Log foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    res.status(400);
    let { id } = req.params;

    let rsltContensLogs = await Models.getOne({
      model: TableLogs,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltContensLogs) {
      res.status(404);
      throw new Error("Log não encontrado");
    }

    let { id_database } = req.body;

    if (id_database) {
      const obj = { id: id_database };
      let rsltDatabase = await Models.getOne({
        model: TableDatabase,
        filter: obj.id,
        attributes: ["id"],
      });

      if (!rsltDatabase) {
        res.status(404);
        throw new Error("Banco de Dados não encontrado");
      }
    }

    req.body["updated_at"] = Sequelize.fn("NOW");
    const data = await Models.updateOne({
      model: TableLogs,
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

    let rsltLog = await Models.getOne({
      model: TableLogs,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltLog) {
      res.status(404);
      throw new Error("Log não encontrado");
    }

    await Models.deleteOne({
      model: TableLogs,
      filter: { id },
    });
    res.status(200);
    res.send(id);
  } catch (error) {
    next(error);
  }
};

TableLogs.associate = () => {
  TableLogs.belongsTo(TableDatabase, {
    foreignKey: "id_database",
    targetKey: "id",
  });
};

const syncDatabases = async () => {
  await Api.post("/refresh");
};

const testConnection = async (req, res, next) =>{
  const { id_database } = req.query;
  const newLog = await Api.get(`/test-connection?id_database=${id_database}`)
  res.send(newLog.data.description).status(200)
}

export default {
  getAll,
  create,
  getOne,
  update,
  deleteOne,
  getAllByServer,
  getAllByCustomer,
  getAllByDataBase,
  getAll,
  syncDatabases,
  testConnection,
};
