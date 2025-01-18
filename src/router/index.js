import { createRouter, createWebHistory } from 'vue-router';
import { api } from '../api';
// Lazy load components for better performance
const SignUp = () => import('../components/auth/SignUp.vue');
const Login = () => import('../components/auth/Login.vue');
const Home = () => import('../components/Home.vue');
const Profile = () => import('../components/Profile.vue');
const ToDo = () => import('../components/ToDo.vue');
const SavedMessages = () => import('../components/SavedMessages.vue');
const Dashboard = () => import('../components/Dashboard.vue');
const TelegramAccountAdd = () =>
    import('../components/telegram/TGAccountAdd.vue');

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { guest: true },
    },
    {
        path: '/register',
        name: 'SignUp',
        component: SignUp,
        meta: { guest: true },
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true },
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true },
    },
    {
        path: '/todo',
        name: 'ToDo',
        component: ToDo,
        meta: { requiresAuth: true },
    },
    {
        path: '/saved-messages',
        name: 'SavedMessages',
        component: SavedMessages,
        meta: { requiresAuth: true },
    },
    {
        path: '/app',
        name: 'TelegramAccountAdd',
        component: TelegramAccountAdd,
        meta: { requiresAuth: true },
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/login',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Optional: Add navigation guard for auth
// You can replace this with your own auth logic
router.beforeEach(async (to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('auth_token');

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'Login' });
    } else if (to.meta.guest && isAuthenticated) {
        next({ name: 'Home' });
    } else {
        next();
    }
});

export default router;
// Commit 2: 2024-07-03T08:37:43
// Commit 5: 2024-07-10T09:27:04
// Commit 18: 2024-08-09T18:46:43
// Commit 25: 2024-08-26T03:58:37
// Commit 31: 2024-09-09T05:34:50
// Commit 34: 2024-09-16T05:41:47
// Commit 44: 2024-10-09T15:10:55
// Commit 62: 2024-11-20T18:37:25
// Commit 86: 2025-01-15T21:54:01
// Commit 87: 2025-01-18T05:53:40
// Commit 89: 2025-01-22T22:26:02
// Commit 93: 2025-02-01T06:56:54
// Commit 96: 2025-02-08T07:35:03
// Commit 105: 2025-03-01T09:30:15
// Commit 116: 2025-03-27T02:45:24
// Commit 140: 2025-05-22T07:01:26
// Commit 141: 2025-05-24T14:28:46
// Commit 146: 2025-06-05T07:33:24
// Commit 153: 2025-06-21T17:08:42
// Commit 155: 2025-06-26T08:47:07
// Commit 156: 2025-06-28T17:17:26
// Commit 157: 2025-07-01T01:57:05
// Commit 158: 2025-07-03T10:05:28
// Commit 161: 2025-07-10T10:10:01
// Commit 170: 2025-07-31T11:51:24
// Commit 172: 2025-08-05T04:14:55
// Commit 177: 2025-08-16T20:34:20
// Commit 179: 2025-08-21T13:20:04
// Commit 181: 2025-08-26T04:48:16
// Commit 190: 2025-09-16T06:56:19
// Commit 195: 2025-09-27T23:20:04
// Commit 199: 2025-10-07T08:15:32
// Commit 200: 2025-10-09T16:44:10
// Commit 20: 2024-08-14T11:54:39
// Commit 37: 2024-09-23T06:00:26
// Commit 38: 2024-09-25T14:26:38
// Commit 41: 2024-10-02T14:40:54
// Commit 45: 2024-10-11T23:50:23
// Commit 65: 2024-11-27T18:20:30
// Commit 71: 2024-12-11T19:17:08
// Commit 87: 2025-01-18T06:17:35
