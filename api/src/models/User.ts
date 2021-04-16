export default class User {
    constructor (
        public googleId: string,
        public googleToken: string,
        public googleRef?: string
    ){ }
}