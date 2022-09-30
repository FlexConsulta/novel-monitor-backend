import Sequelize from "../index.js";
import { DataTypes } from "sequelize";
import Profiles from "./profiles.model.js";
import Clients from "./clients.model.js";
import Persons from "./persons.model.js";
import sequelizePaginate from "sequelize-paginate";

const Users = Sequelize.define(
  "users",
  {
    id_person: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      onDelete: "CASCADE",
      references: {
        model: "persons",
        key: "id",
      },
    },
    id_profile: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "profiles",
        key: "id",
      },
    },
    id_client: {
      type: DataTypes.INTEGER,
      references: {
        model: "clients",
        key: "id",
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "users",
  }
);

Users.associate = () => {
  Users.hasOne(Persons, {
    foreignKey: "id",
    sourceKey: "id_person",
    onDelete: "cascade",
  });
  Users.belongsTo(Clients, { foreignKey: "id_client", targetKey: "id" });
  Users.hasOne(Profiles, { foreignKey: "id", sourceKey: "id_profile" });
};

sequelizePaginate.paginate(Users);

export default Users;
