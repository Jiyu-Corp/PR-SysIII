import axios, { AxiosHeaders, Method } from "axios"

const API_PROTOCOL = 'http'
const PRSYS_API_PORT = 3001
const PRSYS_API_URL = `${API_PROTOCOL}://localhost:${PRSYS_API_PORT}`

// Need a better place
type PRSYSResources = 'access' | 'client' | 'brand' | 'vehicle-type' | 'vehicle';

function requestPRSYS(resource: PRSYSResources, endpoint: string, method: Method, body?: object, params?: object): Promise<any> {
    endpoint = `${resource}/${endpoint}`;

    const jwtToken = sessionStorage.getItem('jwt_token');
    let headers: AxiosHeaders | undefined;
    if(jwtToken) {
        headers = new AxiosHeaders();
        headers.set('Authorization', `Bearer ${jwtToken}`)
    }

    return request(PRSYS_API_URL, endpoint, method, body, params, headers);
}

async function request(url: string, endpoint: string, method: Method, body?: object, params?: object, headers?: AxiosHeaders): Promise<any> {
    try {
        const response = await axios({
            baseURL: url,
            url: endpoint,
            method,
            data: body,
            params: params,
            headers: {
                'Content-Type': 'application/json',
                ... headers
            },
        });
        return response.data;
    } catch (error: any) {
        // Optionally, you can process error here or just rethrow
        throw error.response?.data || error.message || error;
    }
}

export {
    requestPRSYS,
    request
}