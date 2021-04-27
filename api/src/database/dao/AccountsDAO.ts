import { Db } from "mongodb";
import MongoAccess from "../mongodb/MongoAccess";
import { DbAccount } from "../mongodb/dataTypes";

export default class AccountsDAO extends MongoAccess<DbAccount> {
    constructor(Db: Db) {
        super(Db, 'accounts');
    }
}