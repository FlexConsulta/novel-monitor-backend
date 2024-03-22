import Sequelize from "../index.js";
import { DataTypes } from "sequelize";
import TableClients from "./clients.model.js";

const Telefones_Clients = Sequelize.define(
  "telefone_clients",
  {
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      //unique: true,
      validate: {
        validatePhone: function (value) {
          if (!(/(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/g.test(value))) {
            throw new Error("O formato deve ser de telefone");
          }
        },
      },
    },
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "telefone_clients",
  }
);
Telefones_Clients.belongsTo(TableClients, {
  constraint: true,
  allowNull: false,
  foreignkey: "idcliente",
  onDelete: "cascade",
});

TableClients.hasMany(Telefones_Clients, {
  foreignkey: "idcliente",
});

export default Telefones_Clients;
