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

View_databases.associate = (model) => {
  View_databases.belongsTo(model.users, { foreignKey: "id_user", as: "user" });
  View_databases.belongsTo(model.databases, {
    foreignKey: "id_database",
    as: "database",
  });
};

export default View_databases;
