import SchemaValidation from '../helpers/schemaValidation';
import Accounts from './Accounts';

export default function modelsLoader(): {
    accounts: InstanceType<typeof Accounts>
} {
    const schemaValidation = SchemaValidation();

    return {
        accounts: new Accounts(schemaValidation('account'))
    };
}