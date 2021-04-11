import { Db, ObjectId } from 'mongodb';

type MongoCollection = 
    | 'users' 
    | 'userTokens';

type DbId = { _id: string | number | ObjectId | undefined };

export default abstract class BaseRepo<T extends DbId> {
    protected readonly _context: Db;
    protected readonly _collection: MongoCollection;

    constructor(context: Db, collection: MongoCollection) {
        this._context = context;
        this._collection = collection;
    }
    
    public async find (filters?: any): Promise<T[]> {
        if (filters?._id) { 
            filters._id = new ObjectId(filters._id);
        }

        return await this._context.collection(this._collection).find(filters).toArray();
    }

    public async findOne (filters: any): Promise<T | null> {
        if (filters._id) { 
            filters._id = new ObjectId(filters._id);
        }

        return await this._context.collection(this._collection).findOne(filters);
    }

    protected async insertOne (insertDoc: Omit<T, '_id'>): Promise<T | null> {
        // TODO: add "updatedOn" update to each request
        // TODO: add "createdOn" value to each request

        const response = await this._context.collection(this._collection).insertOne(insertDoc);

        return response.result.ok ? response.ops[0] : null;
    }


    protected async updateOne (filters: any, update: any ): Promise<boolean> {
        if (filters._id) { 
            filters._id = new ObjectId(filters._id);
        }
        // TODO: add "updatedOn" update to each request

        const response = await this._context.collection(this._collection).updateOne(filters, update);
        
        return (response.result.ok && response.modifiedCount > 0) ? true: false;
    }
}