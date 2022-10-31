import Sequelize from "../index.js";
import { DataTypes } from "sequelize";

const View_databases = Sequelize.define(
  "view_databases",
  {
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    id_database: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "databases",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "view_databases",
  }
);

export default View_databases;
