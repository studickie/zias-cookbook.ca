import { OAuth2Client } from 'google-auth-library';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_SECRET;
//const redirectUri = process.env.GOOGLE_REDIRECT_URI;

class GoogleService2 {
    private _client: OAuth2Client;

    constructor() {
        this._client = new OAuth2Client({ clientId, clientSecret });
    }

    public async verify(token: string): Promise<unknown> {
        try {
            const ticket = await this._client.verifyIdToken({
                idToken: token,
                audience: clientId
            });

            const payload = ticket.getPayload();

            return payload;

        } catch(e) {
            // TODO: log error

            return null;
        }
    }
}

export default new GoogleService2();