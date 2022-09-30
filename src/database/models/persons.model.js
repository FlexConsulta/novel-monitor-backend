import Sequelize from "../index.js";
import { DataTypes } from "sequelize";
import sequelizePaginate from 'sequelize-paginate';

const Persons = Sequelize.define(
  "persons",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    photo: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
    exp: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "persons",
  }
);
sequelizePaginate.paginate(Persons);

export default Persons;
