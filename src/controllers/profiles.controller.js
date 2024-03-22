import Models from "../database/schemas/default.js";
import TableProfile from "../database/models/profiles.model.js";
import TableUsers from "../database/models/users.model.js";

const create = async (req, res, next) => {
  try {
    res.status(400);
    let { name } = req.body;

    let rsltprofile = await Models.getOne({
      model: TableProfile,
      filter: { name },
      attributes: ["id"],
    });

    if (rsltprofile){
      res.status(409)
      throw new Error("Esse perfil já existe");
    } 

    const data = await Models.createOne({
      model: TableProfile,
      data: req.body,
    });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum perfil foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {

    res.status(400);
    const data = await Models.getAll({
      model: TableProfile,
    });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum perfil foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {

    res.status(400);

    let { id } = req.params;

    if (isNaN(id)) throw new Error("O formato do ID está incorreto!");

    const data = await Models.getOne(
      { 
        model: TableProfile, 
        filter: { id } ,
        include: TableUsers
      });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum perfil foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    res.status(400);
    let { id } = req.params;

    let rsltContensProfile = await Models.getOne({
      model: TableProfile,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltContensProfile){
      res.status(404)
      throw new Error("Perfil não encontrado");
    } 


    let { name } = req.body;
    if (name) {
      let rsltprofile = await Models.getOne({
        model: TableProfile,
        filter: { name },
        attributes: ["id"],
      });

      if (rsltprofile && rsltprofile.id !== Number(id)){
        res.status(409)
        throw new Error("Esse perfil já existe");

      }
    }

    const data = await Models.updateOne({
      model: TableProfile,
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


    let rsltProfiles = await Models.getOne({
      model: TableProfile,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltProfiles){
      res.status(404)
      throw new Error("Perfil não encontrado");
    }

    let id_profile = rsltProfiles

    let hasUserProfile = await Models.getOne({
      model: TableUsers,
      filter: id_profile,
      attributes: ["id"],
    });

    if(hasUserProfile){
      res.status(500)
      throw new Error("Não foi possível excluir o Perfil, pois possui dependência(s)");
    }



    await Models.deleteOne({
      model: TableProfile,
      filter: { id },
    });
    res.status(200);
    res.send(id);
  } catch (error) {
    next(error);
  }
};

export default { create, getAll, deleteOne, getOne, update };
