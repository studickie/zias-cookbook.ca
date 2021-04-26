import { Db, ObjectId } from 'mongodb';
import { DbBase } from './dataTypes';

export default abstract class MongoAccess<T extends DbBase> {
    private readonly _context: Db;
    private readonly _collection: string;

    constructor(context: Db, collection: string) {
        this._context = context;
        this._collection = collection;
    }
    
    public async find(filters?: Partial<T>): Promise<T[]> {
        if (filters?._id) { 
            filters._id = new ObjectId(filters._id);
        }

        return await this._context.collection(this._collection).find(filters).toArray();
    }

    public async findOne(filters: Partial<T>): Promise<T | null> {
        if (filters?._id) { 
            filters._id = new ObjectId(filters._id);
        }

        return await this._context.collection(this._collection).findOne(filters);
    }

    public async insertOne(insertDoc: Omit<T, Extract<DbBase, '_id'>>): Promise<T | null> {

        const response = await this._context.collection(this._collection).insertOne(insertDoc);

        return response.result.ok ? response.ops[0] : null;
    }


    public async updateOne(filters: Partial<T>, updateObj: Partial<T>): Promise<boolean> {
        if (filters?._id) { 
            filters._id = new ObjectId(filters._id);
        }

        const response = await this._context.collection(this._collection).updateOne(filters, updateObj);
        
        return (response.result.ok && response.modifiedCount > 0) ? true: false;
    }

    public async removeOne(filters: Partial<T>): Promise<boolean> {
        const response = await this._context.collection(this._collection).deleteOne(filters);

        return true;   
    }
}