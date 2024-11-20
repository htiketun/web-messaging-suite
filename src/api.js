import axios from 'axios';

// Helper to get CSRF token from cookies
function getCsrfToken() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
}

// Define your base URLs
const baseURLs = {
    data: 'http://127.0.0.1:8888/api',
    socket: 'http://127.0.0.1:8000',
};

// Function to get the desired baseURL
function getBaseURL(type = 'data') {
    return baseURLs[type] || baseURLs.data;
}

// Create an axios instance factory
function createApi(type = 'data') {
    const api = axios.create({
        baseURL: getBaseURL(type),
        headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('auth_token') && {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            }),
            ...(getCsrfToken() && { 'X-CSRFToken': getCsrfToken() }),
        },
        withCredentials: true,
    });

    api.interceptors.request.use((config) => {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        const authToken = localStorage.getItem('auth_token');
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (
                error.response &&
                error.response.status === 401 &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    try {
                        const res = await axios.post(
                            `${getBaseURL(type)}/token/refresh/`,
                            {
                                refresh: refreshToken,
                            },
                        );
                        const newAuthToken = res.data.access;
                        localStorage.setItem('auth_token', newAuthToken);

                        originalRequest.headers[
                            'Authorization'
                        ] = `Bearer ${newAuthToken}`;
                        return api(originalRequest);
                    } catch (refreshError) {
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('refresh_token');
                    }
                }
            }
            return Promise.reject(error);
        },
    );

    return api;
}

export const api = createApi('data');
export const socketApi = createApi('socket');

export default { api, socketApi };
// Commit 6: 2024-07-12T16:59:16
// Commit 8: 2024-07-17T09:22:33
// Commit 15: 2024-08-02T18:34:30
// Commit 32: 2024-09-11T13:56:35
// Commit 44: 2024-10-09T15:10:55
// Commit 45: 2024-10-12T00:01:06
// Commit 55: 2024-11-04T09:24:08
// Commit 61: 2024-11-18T10:31:59
// Commit 62: 2024-11-20T18:37:25
