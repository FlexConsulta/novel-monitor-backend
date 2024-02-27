import Models from "../database/schemas/default.js";
import TableClients from "../database/models/clients.model";
import TableDatabase from "../database/models/databases.model";
import TableServers from "../database/models/servers.model";
import TableLogs from "../database/models/logs.model";

const getAll = async (req, res, next) => {
  try {
    res.status(400);

    const rsltClients = await Models.getAll({ model: TableClients });
    const rsltServers = await Models.getAll({ model: TableServers });
    const rsltDatabases = await Models.getAll({ model: TableDatabase, filter : {
      sincronizacao : true
    } });
    const rsltLogs = await Models.getAllLastLogs({ model: TableLogs, dbs: rsltDatabases?.total });

    const data = {
      clients: rsltClients,
      servers: rsltServers,
      databases: rsltDatabases,
      logs: rsltLogs
    }

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum informação foi encontrado");


  } catch (error) {
    next(error);
  }
};

export default { getAll };
