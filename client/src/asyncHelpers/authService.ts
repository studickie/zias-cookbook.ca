const DOMAIN_URL = process.env.REACT_APP_DOMAIN_URL;

export async function requestZCTest (): Promise<Response> {
    const response = await fetch(`${DOMAIN_URL}/api`, {
        method: 'GET'
    });

    return await response.json();
}

export async function requestGoogleSignin (googleToken: any): Promise<Response> {
    const response = await fetch(`${DOMAIN_URL}/api/auth/google_signin`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ token: googleToken })
    });

    return await response.json();
}