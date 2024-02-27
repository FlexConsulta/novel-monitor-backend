const getAll = async ({
  model,
  filter,
  attributes,
  sort,
  include,
  page,
  paginate,
}) => {
  return new Promise(async (resolve, reject) => {
    try {

      const options = {
        where: filter || {},
        attributes: attributes || null,
        order: sort || [],
        include: include,
        page,
        paginate,
      };
      const data = await model.paginate(options);

      if (data.length == 0) resolve(null);

      resolve(data);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

const getAllLimited = async ({
  model,
  filter,
  attributes,
  sort,
  include,
  limit,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        where: filter || {},
        attributes: attributes || null,
        order: sort || [],
        include,
        limit,
      };
      const data = await model.findAll(options);

      if (data.length == 0) resolve(null);

      resolve(data);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

const getAllDefault = async ({ model, filter, attributes, sort, include }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await model.findAll({
        where: filter || {},
        attributes: attributes || null,
        sort: sort || [],
        include: include,
      });

      if (data.length == 0) resolve(null);

      resolve(data);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

const getOne = async ({ model, filter, attributes, include }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await model.findOne({
        where: filter || {},
        attributes: attributes || null,
        //     raw: true,
        include: include,
      });
      resolve(data);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

const createOne = async ({ model, data, attributes, include }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await model.create(data, { raw: true, include: include });
      resolve(result);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

const updateOne = async ({ model, filter, data, attributes, include }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [, count] = await model.update(data, {
        where: filter || {},
        returning: true,
        plain: true,
        raw: true,
        include: include,
      });
      resolve(count);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

const deleteOne = async ({ model, filter }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await model.destroy({
        where: filter || {},
        returning: true,
        plain: true,
        raw: true,
      });

      resolve(data);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

const getOnePk = async ({ pk, model, filter, attributes, include }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await model.findByPk(pk, {
        where: filter || {},
        attributes: attributes || null,
        //  raw: true,
        include: include,
      });
      resolve(data);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

const getAllLastLogs = async ({
  model
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      model.sequelize.options.quoteIdentifiers = false;
      const totalBancosQuery = `
      SELECT *
      FROM (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY "group" ORDER BY id DESC) as row_num
        FROM ${model.tableName}
        WHERE "group" IN (
          SELECT "group"
          FROM ${model.tableName}
          GROUP BY "group"
          ORDER BY MIN(id)
          LIMIT 1
        )
      ) AS subquery
      `;

      const totalBanco = await model.sequelize.query(totalBancosQuery, {
        model: model,
        mapToModel: true,
      });

      const query = `
        SELECT *
        FROM (
          SELECT *, ROW_NUMBER() OVER (PARTITION BY "group" ORDER BY id DESC) as row_num
          FROM ${model.tableName}
          WHERE "group" IN (
            SELECT "group"
            FROM ${model.tableName}
            GROUP BY "group"
            HAVING COUNT(*) >= ${totalBanco.length}
            ORDER BY MIN(id)
            LIMIT 1
          )
        ) AS subquery
        WHERE row_num <= ${totalBanco.length};
      `;

      const data = await model.sequelize.query(query, {
        model: model,
        mapToModel: true,
      });

      resolve(data);
    } catch (error) {
      console.log(error)
      reject(error?.original || error?.message || error);
    }
  });
};

export default {
  getAll,
  getAllLastLogs,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  getOnePk,
  getAllLimited,
  getAllDefault,
};
