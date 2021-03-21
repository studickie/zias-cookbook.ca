const API_URL = process.env.REACT_APP_API_URL;

export async function requestZCTest (): Promise<Response> {
    const response = await fetch(`${API_URL}`, {
        method: 'GET'
    });

    return await response.json();
}

export async function requestGoogleSignin (googleToken: any): Promise<Response> {
    const response = await fetch(`${API_URL}/auth/google_signin`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ token: googleToken })
    });

    return await response.json();
}