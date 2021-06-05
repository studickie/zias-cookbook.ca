import { AccountDefaultCredentials } from './AccountDefaultCredentials';
import { AccountOauth2Google } from './AccountOauth2Google';

export enum AccountEmailPermissions {
    true = 0,
    false = 1
}

export enum AccountAuthMethod {
    default = 0,
    google = 1
}

export enum AccountActivityStatus {
    active = 0,
    unverified = 1,
    deactivated = 2
}

export interface Account {
    createdOn: Date;
    lastUpdatedOn: Date;
    authMethod: AccountAuthMethod;
    activityStatus: AccountActivityStatus;
    email: string;
    emailSendPermission: AccountEmailPermissions;
    accountCredentials?: AccountDefaultCredentials,
    oauth2Google?: AccountOauth2Google;
}