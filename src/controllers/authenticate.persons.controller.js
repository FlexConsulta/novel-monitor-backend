import Models from "../database/schemas/default";
import TablePersons from "../database/models/persons.model";
import TableUsers from "../database/models/users.model";
import TableProfiles from "../database/models/profiles.model";
import TableClients from "../database/models/clients.model";
import { compare } from "bcrypt";
import jwt from 'jsonwebtoken';
const { sign } = jwt;

const execute = async (req, res, next) => {
  try {

    res.status(400);

    const { email, password } = req.body;

    TableUsers.associate([TablePersons, TableProfiles, TableClients])

    const user = await Models.getOne({
      model: TableUsers,
      include: [
        {
          model: TablePersons,
          where: { email }
        },
        { model: TableClients },
        { model: TableProfiles }
      ]
    });

    if (!user) {
      res.status(404)
      throw new Error("Email ou senha incorretos!");
    }
    const { person, active, profile, client } = user;

    const passwordMatch = await compare(password, person.password);

    if (!passwordMatch) {
      throw new Error("Email ou senha incorretos!");
    }

    const token = sign({
      data: {
        active,
        name: person.name,
        profile: profile.type,
        client: client?.name
      },
    }, process.env.JWT_TOKEN, {
      subject: person.id.toString(),
      expiresIn: "1d"
    })

    res.status(200);

    res.send(
      {
        person:
        {
          id: person.id,
          name: person.name,
          photo: person.photo,
          email: person.email,
          phone: person.phone
        }, token
      });

  } catch (error) {
    next(error);
  }
};

export default { execute };
