import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import path from 'path';
import fs from 'fs';

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
        let replacedHtml = '';

        const readable = fs.createReadStream(path.resolve(__dirname, '../../views/signupRequest.html'));

        readable.on('data', (chunk) => {
            replacedHtml = replacedHtml.concat(chunk.toString().replace(/###REQUEST_ID###/g, requestId));
        });

        readable.on('end', () => {
            this.sendEmail('studickiecodes@gmail.com', 'New account request', replacedHtml);
        });
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
            // TODO: log error

            return;
        }
    }
}

export default new MailerService();