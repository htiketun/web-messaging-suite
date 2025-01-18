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
