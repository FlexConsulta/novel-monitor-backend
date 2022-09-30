import Models from "../database/schemas/default.js";
import TableEmails from "../database/models/emails.model.js";

const getAll = async (req, res, next) => {
  try {
    res.status(400);
    const { email } = req.query
    if (!email) throw new Error("Valor invalido")
    const data = await Models.getAll({
      model: TableEmails,
      filter: { email },
    });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum email foi encontrado");
  } catch (error) {
    next(error);
  }
};




export default { getAll }