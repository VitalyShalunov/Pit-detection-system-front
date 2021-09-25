const API_URL = 'http://localhost:8000';
const AUTH_URL = 'https://localhost:44336/api/account';

class HttpError extends Error {
    httpStatus: number;

    constructor(message: string, httpStatus: number) {
        super(message);
        this.httpStatus = httpStatus;
    }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            try {
                const resp = await response.json();
                return resp || [];
            } catch (error) {
                throw new Error(error as any);
            }
        }
        return (response as unknown) as T;
    }
    throw new HttpError(`Response: [${response.status}] ${response.statusText}`, response.status);
};

export const fetchFunctionAuth = async <T>(urlParams: string): Promise<T> => {
    const res = await fetch(`${AUTH_URL}${urlParams}`, );
    return handleResponse<T>(res);
};

export const postFunctionAuth = async <T>(urlParams: string, body: any): Promise<T> => {
    const res = await fetch(`${AUTH_URL}${urlParams}`, {
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
        headers: [
            ['Content-Type', 'application/json'],
            ['Access-Control-Allow-Origin', '*'],
            ['access-control-expose-headers', '*'],
            ['Access-Control-Allow-Credentials', 'true']
        ],
    });
    return handleResponse<T>(res);
};

    export const fetchFunctionApi = async <T>(urlParams: string | URL, requestInit?: RequestInit): Promise<T> => {
        let res;
        if (urlParams instanceof URL) {
            res = await fetch(urlParams.toString(), {
                credentials: "include",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'access-control-expose-headers': '*',
                }
            });
        } else {
            res = await fetch(`${API_URL}${urlParams}`, {
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:8000',
                    'Access-Control-Request-Headers': 'Content-Type',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Cache': 'no-cache'
                },
            });
        }

        console.log('res', res);
        
        return handleResponse<T>(res);
    };

export const postFunctionApi = async <T>(urlParams: string, body: any): Promise<T> => {
    const header = new Headers({
        'Access-Control-Request-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:8000',
    });

    const res = await fetch(`${API_URL}${urlParams}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: header,
    });
    return handleResponse<T>(res);
};

export const patchFunctionApi = async <T>(urlParams: string | URL, body: any): Promise<T> => {
    const res = await fetch(`${API_URL}${urlParams}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return handleResponse<T>(res);
};

export const putFunctionApi = async <T>(urlParams: string | URL, body: any): Promise<T> => {
    const res = await fetch(`${API_URL}${urlParams}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return handleResponse<T>(res);
};

export const deleteFunctionApi = async (urlParams: string | URL): Promise<boolean> => {
    const res = await fetch(`${API_URL}${urlParams}`, {
        method: 'DELETE',
    });
    return res.ok;
};
