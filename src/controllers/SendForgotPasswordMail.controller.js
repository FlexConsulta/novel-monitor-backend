import crypto from "crypto";
import { hash } from "bcrypt";
import Transporter from "../services/email.service.js";
import Models from "../database/schemas/default.js";
import TablePersons from "../database/models/persons.model.js";

const recovery = async (req, res, next) => {
    try {
        const { email } = req.body;

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

        const templatePath = `
            <style>
            .container {
            width: 800px;
            font-family: Arial, Helvetica, sans-serif;
            align-items: center;
            display: flex;
            flex-direction: column;
            }
            </style>

            <div class="container">
            <span>Oi, ${mailVariables.name} </span>
            <br>
            <br>
            <span>Você solicitou alteração de senha, sua nova senha é: ${mailVariables.newPassword}</span>
            <br>
            <h3>Equipe | <strong>DCL Brasil Tecnologia</strong></h3>
            </div>
        `

        await Transporter({
            from: 'syncbackupdlcbrasiltecnologia@gmail.com',
            to: email,
            subject: "Monitor Backup",
            text: templatePath,
            html: templatePath,

        })
            .then((result) => console.log(`[>] Mail enviado com sucesso: [${result.envelope.to}]`))
            .catch((err) => console.log(`[>] Ocorreu um erro no envio do mail: ${err}`));

        delete data.password;

        res.status(200).send(data);
    } catch (error) {
        next(error)
    }
}
export default { recovery };