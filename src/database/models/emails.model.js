import Sequelize from "../index.js";
import { DataTypes } from "sequelize";
import TableClients from "./clients.model";

const Emails_Clients = Sequelize.define(
  "emails_clients",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "O formato tem que ser email!",
        }
      }
    },

  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "emails_clients",
  }
);
Emails_Clients.belongsTo(TableClients, {
  constraint: true,
  allowNull: false,
  foreignkey: "client_id",
  onDelete: "cascade",
});

TableClients.hasMany(Emails_Clients, {
  foreignkey: "client_id",
});
export default Emails_Clients;
