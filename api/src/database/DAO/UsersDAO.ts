import BaseRepo from './MongoDAO';
import User from '../../models/User';
import { DbUser } from '../dataTypes';

export default class UsersRepo extends BaseRepo<DbUser> {

    constructor(context: any) {
        super(context, 'users');
    }

    async create(params: User): Promise<DbUser | null> {
        const createdUser = new User(params.googleId, params.googleToken, params.googleRef);

        if (createdUser === null) return null;

        return await super.insertOne(createdUser);
    }
}