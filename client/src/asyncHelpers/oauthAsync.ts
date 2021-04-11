const API_URL = process.env.REACT_APP_API_URL;

interface RequestGoogleAuthUrlResponse {
    auth_url: string;
}

export async function requestUrl (): Promise<RequestGoogleAuthUrlResponse> {
    const response = await fetch(`${API_URL}/oauth2/google/authenticate`);

    return await response.json();
}

export async function requestToken (authToken: string): Promise<any> {
    const json = JSON.stringify({
        auth_token: authToken
    });

    const response = await fetch(`${API_URL}/oauth2/google/authenticate`, {
        method: 'POST',
        body: json,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response.json();
}