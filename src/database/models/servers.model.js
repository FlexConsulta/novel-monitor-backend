import Sequelize from "../index.js";
import { DataTypes } from "sequelize";
import sequelizePaginate from "sequelize-paginate";

const Servers = Sequelize.define(
  "servers",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    port: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "servers",
  }
);

sequelizePaginate.paginate(Servers);

export default Servers;
