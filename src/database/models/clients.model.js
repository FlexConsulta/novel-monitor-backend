import Sequelize from "../index.js";
import { DataTypes } from "sequelize";
import sequelizePaginate from 'sequelize-paginate';

const Clients = Sequelize.define(
  "clients",
  {
    razaosocial: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cnpj: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
    },
    sincronizacao: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "clients",
  }


);
sequelizePaginate.paginate(Clients);

export default Clients;
