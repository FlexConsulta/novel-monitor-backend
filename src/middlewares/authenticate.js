import Models from "../database/schemas/default";
import TablePersons from "../database/models/persons.model";
import jwt from 'jsonwebtoken';
// import {promisify} from "util";
const { verify } = jwt;

export default async (req, res, next) => {

    const authHeader = req.headers.authorization;
    res.status(401);

    if (!authHeader) {
        throw new Error("Token de autenticação não informado!")
    }

    const [, token] = authHeader.split([" "]);

    try {
        const { sub: id } = verify(token, process.env.JWT_TOKEN);

        const { dataValues: person } = await Models.getOne({
            model: TablePersons,
            filter: { id },
        });

        if (!person) {
            throw new Error("Usuário inválido!");
        }
        res.status(200);


    } catch (error) {
        throw new Error("Token inválido");
    }
    next()

};
