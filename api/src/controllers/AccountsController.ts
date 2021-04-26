//import { DbAccount } from '../database/mongodb/dataTypes';
//import { IDataContext } from '../database';
import GoogleService  from '../services/GoogleService';

const instance: InstanceType<typeof AccountsController> | undefined = undefined;

class AccountsController {
    //private _dbContext: IDataContext;
    private _google: GoogleService;

    constructor(/*dbContext: IDataContext,*/ googleService: GoogleService) {
        // TODO//: add Database Service for data access
        //this._dbContext = dbContext;
        // TODO//: add Google Service for Oauth2
        this._google = googleService;
        // TODO: add Model for create/ update operations
    }

    public generateOauth2Url(): string {
        return this._google.generateAuthenticationUrl('basic');
    }

    public async verifyOauth2User(code: string): Promise<string | null> {
        try {
            const userInfo = await this._google.verifyAuthenticationCode(code);

            // const matchedUser = await this._dbContext.findOne<DbAccount>('accounts', { 
            //     googleId: (userInfo.user.id as string) 
            // });

            let token: string = ''; 
            // if (matchedUser !== null) {
            //     token = '';
                
            // } else {
            //     //const insertUser = await this._dbContext.insertOne<DbAccount>('accounts', { });

            //     token = '';
            // }
            
            return token;
            
        } catch (e) {
            return null;
        }
    }
}