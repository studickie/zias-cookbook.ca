import { Auth, oauth2_v2, google } from 'googleapis';
import logger from '../helpers/logger';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

type AuthenicationScope = 'basic';

export default class GoogleService {
    private _oauth2Client: Auth.OAuth2Client;

    constructor() {
        this._oauth2Client = new google.auth.OAuth2({ 
            clientId, 
            clientSecret, 
            redirectUri 
        });
    }

    private requestScopes(scope: AuthenicationScope): string[] {
        switch (scope) {
            case 'basic':
                return [
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile'
                ];
            default:
                throw new Error('Unsupported scope requested');
        }
    }

    public generateAuthenticationUrl(scope: AuthenicationScope, state: string): string {
        const scopes = this.requestScopes(scope);

        const authUrl = this._oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            state: state
        });

        return authUrl;
    }

    public async verifyAuthenticationCode(code: string): Promise<{
        user: oauth2_v2.Schema$Userinfo,
        tokens: Auth.Credentials
    }> {
        logger.debug(`GoogleService.verifyAuthenticationCode - arguments: ${code}`);
        
        const { tokens } = await this._oauth2Client.getToken(code);
        
        this._oauth2Client.setCredentials(tokens);

        const user = await google.oauth2({
            version: 'v2',
            auth: this._oauth2Client
        }).userinfo.get();

        logger.debug(`GoogleService.verifyAuthenticationCode - user: ${JSON.stringify(user)}`);

        return { 
            user: user.data, 
            tokens 
        };
    }
}