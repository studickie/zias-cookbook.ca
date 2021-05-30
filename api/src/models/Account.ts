import { AccountDefaultCredentials } from "./AccountDefaultCredentials";
import { AccountOauth2Google } from "./AccountOauth2Google";

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