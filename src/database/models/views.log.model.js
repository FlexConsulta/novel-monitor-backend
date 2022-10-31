import Sequelize from "../index.js";
import { DataTypes } from "sequelize";
import sequelizePaginate from "sequelize-paginate";

const ViewLogs = Sequelize.define(
  "view_databases",
  {
    id_database: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_connection: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    id_database: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_connection: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    name_default: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "vw_log",
  }
);

sequelizePaginate.paginate(ViewLogs);

export default ViewLogs;

// create VIEW vw_log
// AS SELECT
//     l.id,
//     l.id_database,
//     l.description,
//     l.status_connection,
//     l.created_at,
//     d.name_default
//    FROM logs l
//    join databases d on d.id = l.id_database
//    WHERE l.id = (( SELECT max(l2.id) AS max
//            FROM logs l2
//           WHERE l2.id_database = l.id_database))
//   GROUP BY l.id_database, l.id, l.description, l.status_connection,
//   d.name_default;
