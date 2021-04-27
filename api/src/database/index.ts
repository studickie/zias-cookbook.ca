import mongoose from 'mongoose';

const dbHost = process.env.DB_HOST || '';
const dbName = process.env.DB_NAME || '';
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';

mongoose.connection.on('error', () => {
    // TODO: log error
});

// TODO: add event subscriptions to better monitor connection behavior, debug

export default async function databaseLoader(): Promise<void> {
    try {
        await mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}/${dbName}`, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (e) {
        // TODO: log error

        process.exit(1);
    }
}