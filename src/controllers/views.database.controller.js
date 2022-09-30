import Models from "../database/schemas/default";
import TableViewsDatabase from "../database/models/views.databases.model";
import TableUsers from "../database/models/users.model";
import TableDatabase from "../database/models/databases.model";

const create = async (req, res, next) => {
  try {
    res.status(400);

    let { id_user, id_database } = req.body;

    const obj = {
      user: { id: id_user },
      database: { id: id_database },
    };

    let rsltUser = await Models.getOne({
      model: TableUsers,
      filter: obj.user.id,
      attributes: ["id"],
    });

    if (!rsltUser){
      res.status(404)
      throw new Error("Usuario não encontrado");
    }

    let rsltDatabase = await Models.getOne({
      model: TableDatabase,
      filter: obj.database.id,
      attributes: ["id"],
    });

    if (!rsltDatabase){
      res.status(404)
      throw new Error("Banco de dados não encontrado");
    } 

    const data = await Models.createOne({
      model: TableViewsDatabase,
      data: req.body,
    });

    res.status(200);
    res.send(data);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    res.status(400);
    const data = await Models.getAll({
      model: TableViewsDatabase,
    });

    res.status(!data ? 404 : 200);
    res.send(data || " Nenhum view database foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    res.status(400);

    let { id } = req.params;

    if (isNaN(id)) throw new Error("O formato do ID está incorreto!");

    const data = await Models.getOne({
      model: TableViewsDatabase,
      filter: { id },
    });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum view database foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    res.status(400);
    let { id } = req.params;

    let rsltContensView = await Models.getOne({
      model: TableViewsDatabase,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltContensView){
      res.status(404)
      throw new Error("viewdatabase não encontrado");
    }


    let { id_user, id_database } = req.body;

    const obj = {
      user: { id: id_user },
      database: { id: id_database },
    };

    let rsltUser = await Models.getOne({
      model: TableUsers,
      filter: obj.user.id,
      attributes: ["id"],
    });

    if (!rsltUser){
      res.status(404)
      throw new Error("Usuario não encontrado");
    }
     
    let rsltDatabase = await Models.getOne({
      model: TableDatabase,
      filter: obj.database.id,
      attributes: ["id"],
    });

    if (!rsltDatabase){
      res.status(404)
      throw new Error("Banco de dados não encontrado");
    } 

    const data = await Models.updateOne({
      model: TableViewsDatabase,
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

    let rsltViews = await Models.getOne({
      model: TableViewsDatabase,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltViews){
      res.status(404)
      throw new Error("view database não encontrado");
    }

    await Models.deleteOne({
      model: TableViewsDatabase,
      filter: { id },
    });
    res.status(200);
    res.send(id);
  } catch (error) {
    next(error);
  }
};

export default { create, getAll, deleteOne, getOne, update };
