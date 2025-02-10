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
// Commit 69: 2024-12-07T03:17:50
// Commit 74: 2024-12-18T20:24:43
// Commit 76: 2024-12-23T12:17:03
// Commit 78: 2024-12-28T04:29:20
// Commit 84: 2025-01-11T05:45:41
// Commit 94: 2025-02-03T15:20:24
// Commit 102: 2025-02-22T08:10:28
// Commit 103: 2025-02-24T17:13:22
// Commit 110: 2025-03-13T02:05:29
// Commit 123: 2025-04-12T11:33:21
// Commit 137: 2025-05-15T05:58:17
// Commit 142: 2025-05-26T22:42:32
// Commit 147: 2025-06-07T15:43:10
// Commit 177: 2025-08-16T20:34:20
// Commit 178: 2025-08-19T05:00:19
// Commit 180: 2025-08-23T20:58:00
// Commit 3: 2024-07-05T16:41:40
// Commit 10: 2024-07-22T01:26:40
// Commit 11: 2024-07-24T10:01:40
// Commit 36: 2024-09-20T22:34:00
// Commit 37: 2024-09-23T06:00:26
// Commit 55: 2024-11-04T08:53:04
// Commit 81: 2025-01-04T05:40:29
// Commit 97: 2025-02-10T15:30:12
