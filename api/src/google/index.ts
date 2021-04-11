import { GaxiosPromise } from 'gaxios';
import { Auth, oauth2_v2, google } from 'googleapis';

export type IGoogleService = ReturnType<typeof googleMethods>;

export default function googleService (): IGoogleService {
    // TODO: use JSON file provided by google rather than environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('"googleService" is undefined');
    }

    const oauth2Client = new google.auth.OAuth2({ clientId, clientSecret, redirectUri });

    return googleMethods(oauth2Client);
}

type AuthenicationScope = 'basic';

function googleMethods (oauth2Client: Auth.OAuth2Client) {

    const requestScopes = (scope: AuthenicationScope): string[] => {
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

    return {
        generateAuthenticationUrl: (scope: AuthenicationScope): string => {
            const scopes = requestScopes(scope);
    
            const authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes
            });
    
            return authUrl;
        },
        verifyAuthenticationCode: async (code: string): Promise<{ user: oauth2_v2.Schema$Userinfo , tokens: Auth.Credentials}> => {
            const { tokens } = await oauth2Client.getToken(code);

            oauth2Client.setCredentials(tokens);
            
            const user = await google.oauth2({
                version: 'v2',
                auth: oauth2Client
            }).userinfo.get();

            return { user: user.data, tokens };
        }
    };
}