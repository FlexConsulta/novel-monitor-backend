import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const CLIENT_ID = '305664284396-pkhsb8nvmqj3i49164l8s5d4bletmars.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04Mfy86dKevgCCgYIARAAGAQSNwF-L9IrK3SWAzVawUX8N1iquB7dE6NCmr1rvd2KFaIRKDG2JU0XhQjrNvx55twL8JJmEYZnwl4'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail(mailOptions) {
    try {

        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'syncbackupdlcbrasiltecnologia@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken

            }
        })

        const result = await transport.sendMail(mailOptions)
        console.log({result});
        return result

    } catch (error) {
        console.log({error});
        return error
    }

}

export default  sendMail