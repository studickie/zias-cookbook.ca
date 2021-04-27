import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

const mailHost = process.env.MAIL_HOST;
const mailUser = process.env.MAIL_USER;
const mailPass = process.env.MAIL_PASS;

export default class MailerService {
    private _mailClient: Mail;

    constructor() {
        this._mailClient = nodemailer.createTransport({
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

    public sendChangePassword(email: string, token: string): void {
        const newPass = 'new!Pass?1234';

        const verifyUrl = `a href=http://localhost:4000/auth/resetPassword/${token}/?pass=${newPass}&verifyPass=${newPass}`;

        this.sendEmail(email, 'Zia\'s Cookbook - Reset Password', verifyUrl);
    }

    public sendVerificationEmail(email: string, token: string): void {
        const verifyUrl = `<a href='http://localhost:4000/auth/verifyEmail/${token}'>Verify Now</a>`;

        this.sendEmail(email, 'Zia\'s Cookbook - Verify Email', verifyUrl);
    }

    private async sendEmail(to: string, subject: string, body: string): Promise<void> {
        try {
            await this._mailClient.sendMail({
                to: to,
                subject: subject,
                text: 'Plaintext version of email',
                html: body
            });

            return;

        } catch (e) {
            console.log('Error - sendEmail', e);

            return;
        }
    }
}