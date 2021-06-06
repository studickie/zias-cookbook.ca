import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

// import path from 'path';
// import fs from 'fs';
import logger from '../helpers/logger';

const mailHost = process.env.MAIL_HOST;
const mailUser = process.env.MAIL_USER;
const mailPass = process.env.MAIL_PASS;

class MailerService {
    private _mail: Mail;

    constructor() {
        this._mail = nodemailer.createTransport({
            host: mailHost,
            port: 2525,
            secure: false,
            auth: {
                user: mailUser,
                pass: mailPass
            }
        }, {
            from: 'no_reply@ziascookbook.ca'
        });
    }

    /**
     *  Send an email to the app admin requesting permission to create an app account
     */
    public sendSignupRequest(emailFrom: string, requestId: string): void {
        // new Promise<string>((resolve, reject) => {
        //     let replacedHtml = '';

        //     const readable = fs.createReadStream(path.resolve(__dirname, '../../public/signupRequest.html'));

        //     readable.on('data', (chunk) => {
        //         replacedHtml = replacedHtml.concat(chunk.toString().replace(/###REQUEST_ID###/g, requestId));
        //     });

        //     readable.on('end', () => resolve(replacedHtml));

        //     readable.on('error', (err) => reject(err));
        // })
        // .then(value => {
        //     // TODO: replace emailTo address with environment variable
        //     console.log('send mail')
        // })
        // .catch(error => {
        //     //TODO: log error
        // });
    }

    /**
     *  Send an email to a user accepting their request for signup permissions
     */
    // public sendAcceptSignupResponse(emailTo: string): void {

    // }

    /**
     *  Send an email to a user declining their request for signup permissions
     */
    // public sendDeclineSignupResponse(emailTo: string): void {

    // }

    private async sendEmail(emailTo: string, subject: string, body: string): Promise<void> {
        try {
            await this._mail.sendMail({
                to: emailTo,
                subject: subject,
                text: 'Plaintext version of email',
                html: body
            });

            return;

        } catch (e) {
            logger.error(e);

            return;

        } finally {
            // TODO: log email event
        }
    }
}

export default new MailerService();