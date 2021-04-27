import GoogleService from './GoogleService';

export default function servicesLoader(): {
    google: InstanceType<typeof GoogleService>
} {
    return {
        google: new GoogleService()
    };
}