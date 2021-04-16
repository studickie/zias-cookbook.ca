import { ObjectId } from 'mongodb';
import User from '../../models/User';

export interface DbBase {
    _id: string | ObjectId;
    // createdOn: Date;
    // updatedOn: Date;
}

export interface DbUser extends DbBase, User {}