import { ObjectId } from 'mongodb';
import { Account } from '../../models/Accounts';

export interface DbBase {
    _id: string | ObjectId;
    // createdOn: Date;
    // updatedOn: Date;
}

export interface DbAccount extends DbBase, Account {}