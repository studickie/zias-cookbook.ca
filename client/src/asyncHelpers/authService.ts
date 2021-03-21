const API_URL = process.env.REACT_APP_API_URL;

export function requestZCTest (): unknown {
    return fetch(`${API_URL}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log('response data', data);
    });
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