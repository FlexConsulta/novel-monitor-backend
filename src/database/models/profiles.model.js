import Sequelize from "../index.js";
import { DataTypes } from "sequelize";
import sequelizePaginate from 'sequelize-paginate';

const Profiles = Sequelize.define(
  "profiles",
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(["administracao", "clientes"]),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "profiles",
  }
);
sequelizePaginate.paginate(Profiles);

export default Profiles;
