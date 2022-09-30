import Models from "../database/schemas/default.js";
import TableClients from "../database/models/clients.model";
import TableDatabase from "../database/models/databases.model";
import TableLogs from "../database/models/logs.model";
import TablePersons from "../database/models/persons.model";
import TableServers from "../database/models/servers.model";
import TableUsers from "../database/models/users.model";

const getAll = async (req, res, next) => {
  try {
    res.status(400);

    const clients = await Models.getAll({
      model: TableClients,
    });
    const databases = await Models.getAll({
      model: TableDatabase,
    });
    const logs = await Models.getAll({
      model: TableLogs,
    });
    const persons = await Models.getAll({
      model: TablePersons,
    });
    const servers = await Models.getAll({
      model: TableServers,
    });
    const users = await Models.getAll({
      model: TableUsers,
    });

    const data = {
      // docs: servers.docs,
      clients: clients.total,
      clientsAtive: clients.docs.filter((client) => client.sincronizacao)
        .length,
      databases: databases.total,
      dataBasesAtive: databases.docs.filter((client) => client.sincronizacao)
        .length,
      logs: logs.total,
      persons: persons.total,
      servers: servers.total,
      serversAtive: servers.docs.filter((server) => server.active).length,
      users: users.total,
      usersAtive: users.docs.filter((user) => user.active).length,
    };

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum email foi encontrado");
  } catch (error) {
    next(error);
  }
};

export default { getAll };
