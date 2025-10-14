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

