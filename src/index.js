import express from "express";
import "express-async-errors";
// import "dotenv";
import cors from "cors";

import ErrorHandling from "./middlewares/errors.handling.middlewares.js";

import ClientsRoutes from "./routes/clients.routes.js";
import ServersRoutes from "./routes/servers.routes.js";
import DatabasesRoutes from "./routes/databases.routes.js";
import LogsRoutes from "./routes/logs.routes.js";
import ProfileRoutes from "./routes/profiles.route.js";
import PersonsRoutes from "./routes/persons.route.js";
import AuthenticatePersonsRoutes from "./routes/authenticate.persons.route.js";
import UsersRoutes from "./routes/users.routes.js";
import ViewsDatabaseRoutes from "./routes/views.database.routes.js";
import EmailController from "./routes/email.route.js";
import authenticate from "./middlewares/authenticate.js";
import SendForgotPasswordMail from "./routes/SendForgotPassword.route.js";
import Resume from "./routes/resume.route.js";

const { PORT, HOST } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(SendForgotPasswordMail);
app.use(AuthenticatePersonsRoutes);
app.use(authenticate);
app.use(ClientsRoutes);
app.use(ServersRoutes);
app.use(DatabasesRoutes);
app.use(LogsRoutes);
app.use(ProfileRoutes);
app.use(PersonsRoutes);
app.use(UsersRoutes);
app.use(ViewsDatabaseRoutes);
app.use(EmailController);
app.use(ErrorHandling);
app.use(Resume);

app.listen(PORT, () => {
  console.log(`O servidor está online: [${HOST}:${PORT}]`);
});
