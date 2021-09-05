const webadminBase = `/webadmin`;

export const accountTokens = {
    get: `${webadminBase}/accounttokens`,
    getById: `${webadminBase}/accounttokens/:accountTokenId`,
    post: `${webadminBase}/accounttokens`
}