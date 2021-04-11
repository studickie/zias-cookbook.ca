import BaseRepo from './MongoDAO';
import User, { DbUser, DbUserAuthCredentials } from '../DTO/User';

export default class UsersRepo extends BaseRepo<DbUser> {

    constructor(context: any) {
        super(context, 'users');
    }

    async create(args: DbUserAuthCredentials): Promise<DbUser | null> {
        const createdUser = User.create(args);

        if (createdUser === null) return null;

        return await super.insertOne(createdUser);
    }

    // async create (insertDoc: DbUserAuthCredentials): Promise<DbUser | null> {
    //     const createdUser = await User.create({ email: insertDoc.email, pass: insertDoc.pass });

    //     if (createdUser === null) return null;

    //     return await super.insertOne(createdUser);
    // }

    // async verifyPassword (user: DbUserAuthCredentials): Promise<DbUser | null> {
    //     const matchedUser = await super.findOne({ email: user.email });

    //     if (matchedUser === null || !await User.validatePassword(matchedUser.pass, user.pass)) {
    //         return null;
    //     }

    //     return matchedUser;
    // }

    // async requestPasswordReset (reqEmail: Pick<DbUser, 'email'>): Promise<{ token: string } | null> {
    //     const filters = reqEmail;

    //     const currentDate = new Date();
    //     const token = crypto.randomBytes(256).toString('hex');

    //     const updateDoc = {
    //         $set: {
    //             verifyPass: token,
    //             verifyPassCreatedOn: currentDate,
    //             updatedOn: currentDate
    //         }
    //     };

    //     const response = await super.updateOne(filters, updateDoc);

    //     if (!response) return null;

    //     return { token };
    // }

    // async verifyPasswordReset (token: string, newPass: string): Promise<boolean> {
    //     const filters = {
    //         verifyPass: token,
    //         verifyPassCreatedOn: {
    //             $lt: new Date(Date.now() + 5 * (60 * 1000))
    //         }
    //     };

    //     const encryptedPass = await User.encrypt(newPass);

    //     const updateDoc = {
    //         $set: {
    //             verifyPass: null,
    //             verifyPassCreatedOn: null,
    //             pass: encryptedPass,
    //             updatedOn: new Date()
    //         }
    //     };

    //     return await super.updateOne(filters, updateDoc);
    // }

    // async verifyEmail (token: string): Promise<boolean> {
    //     const filters = {
    //         verifyEmail: token,
    //         verifyEmailCreatedOn: {
    //             $lt: new Date(Date.now() + 5 * (60 * 1000))
    //         }
    //     };

    //     const updateDoc = {
    //         $set: {
    //             active: DbUserActiveStatus.active,
    //             verifyEmail: null,
    //             verifyEmailCreatedOn: null,
    //             updatedOn: new Date()
    //         }
    //     };

    //     return await super.updateOne(filters, updateDoc);
    // }
}