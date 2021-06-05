const API_URL = process.env.REACT_APP_API_URL;

export async function requestOauth2Url (): Promise<{
    authUrl: string;
}> {
    const response = await fetch(`${API_URL}/accounts/authenticate/google`);

    return await response.json();
}

export async function requestOauth2Verify (authToken: string): Promise<{ 
    token: string 
}> {
    const json = JSON.stringify({
        auth_token: authToken
    });

    const response = await fetch(`${API_URL}/accounts/authenticate/google`, {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response.json();
}