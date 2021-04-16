const API_URL = process.env.REACT_APP_API_URL;

interface RequestGoogleAuthUrlResponse {
    auth_url: string;
}

export async function requestUrl (): Promise<RequestGoogleAuthUrlResponse> {
    const response = await fetch(`${API_URL}/account/authenticate/google`);

    return await response.json();
}

export async function requestToken (authToken: string): Promise<{ token: string }> {
    const json = JSON.stringify({
        auth_token: authToken
    });

    const response = await fetch(`${API_URL}/account/authenticate/google`, {
        method: 'POST',
        body: json,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response.json();
}