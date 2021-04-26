import { Db, MongoClient } from 'mongodb';

const dbHost = process.env.DB_HOST || '';
const dbName = process.env.DB_NAME || '';
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';

type AccessConstructor = <T>(Repo: new (db: Db) => T) => InstanceType<typeof Repo>;

export default async function databaseLoader(): Promise<AccessConstructor> {
    
    const client = new MongoClient(`mongodb://${dbUser}:${dbPass}@${dbHost}/${dbName}`, {
        useUnifiedTopology: true
    });

    await client.connect();

    return (DAO) => new DAO(client.db(dbName));
}