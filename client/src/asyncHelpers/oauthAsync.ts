const API_URL = process.env.REACT_APP_API_URL;

export async function requestUrl (): Promise<{
    authUrl: string;
}> {
    const response = await fetch(`${API_URL}/accounts/authenticate/google`);

    return await response.json();
}

export async function requestToken (authToken: string): Promise<{ 
    token: string 
}> {
    const jsonData = JSON.stringify({
        auth_token: authToken
    });

    const response = await fetch(`${API_URL}/accounts/authenticate/google`, {
        method: 'POST',
        body: jsonData,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response.json();
}