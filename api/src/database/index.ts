import { MongoClient } from 'mongodb';
import AccountsDAO from './dao/AccountsDAO';

const dbHost = process.env.DB_HOST || '';
const dbName = process.env.DB_NAME || '';
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';

export default async function databaseLoader(): Promise<{
    accounts: AccountsDAO
}> {
    try {
        const client = new MongoClient(`mongodb://${dbUser}:${dbPass}@${dbHost}/${dbName}`, {
            useUnifiedTopology: true
        });

        await client.connect();

        return {
            accounts: new AccountsDAO(client.db(dbName))
        };
        
    } catch (e) {
        // TODO: log system error

        process.exit(1);
    }
}