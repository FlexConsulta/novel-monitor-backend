import crypto from "crypto";
import { hash } from "bcrypt";
import { resolve } from "path"
import sendMail from "../services/email.service";
import Models from "../database/schemas/default";
import TablePersons from "../database/models/persons.model";

const recovery = async (req, res, next) => {
    try {
        const { email } = req.body;

        const __dirname = resolve();
        const templatePath = resolve(__dirname, "src", "utils", "forgotPassword.hbs")

        const person = await Models.getOne({
            model: TablePersons,
            filter: { email }
        });

        if (!person) {
            res.status(404);
            throw new Error("Usuário não encontrado!")
        }

        const newPassword = crypto.randomBytes(20).toString('hex').substring(0, 8);
        const passwordHash = await hash(newPassword, 10);

        const mailVariables = {
            name: person.name,
            newPassword
        }

        const data = await Models.updateOne({
            model: TablePersons,
            data: { ...person, password: passwordHash },
            filter: { id: person.id },
        });

        sendMail(email, "Recuperação de senha", mailVariables, templatePath);
        delete data.password;

        res.status(200).send(data);
    } catch (error) {
        next(error)
    }
}
export default { recovery };