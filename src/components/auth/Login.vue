<template>
    <div
        class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 px-2 sm:px-0"
    >
        <div class="absolute top-4 right-4 sm:top-8 sm:right-8 z-30">
            <div
                class="inline-flex items-center bg-white/80 backdrop-blur rounded-full shadow-lg px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-indigo-200"
            >
                <select
                    v-model="locale"
                    @change="changeLanguage"
                    class="bg-transparent focus:outline-none text-indigo-700 font-semibold"
                >
                    <option value="en">English</option>
                    <option value="cn">中文</option>
                    <option value="mm">မြန်မာ</option>
                </select>
            </div>
        </div>
        <div class="relative w-full max-w-md mx-auto">
            <div
                class="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10"
            >
                <div
                    class="bg-white rounded-full shadow-lg p-2 sm:p-3 border-4 border-indigo-200"
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="Logo"
                        class="w-16 h-16 sm:w-20 sm:h-20"
                    />
                </div>
            </div>
            <form
                @submit.prevent="login"
                class="bg-white p-4 pt-16 sm:p-10 sm:pt-20 rounded-3xl shadow-2xl border border-gray-100 relative"
            >
                <div class="flex flex-col items-center mb-6 sm:mb-8">
                    <h2
                        class="text-2xl sm:text-4xl font-extrabold text-indigo-700 mb-2 tracking-tight"
                    >
                        {{ $t('login.title') }}
                    </h2>
                    <p class="text-gray-500 text-sm sm:text-base">
                        {{ $t('login.subtitle') }}
                    </p>
                </div>
                <div class="mb-4 sm:mb-6">
                    <label
                        class="block mb-2 text-gray-700 font-semibold"
                        for="email"
                        >{{ $t('login.email') }}</label
                    >
                    <div class="relative">
                        <span
                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-400"
                        >
                            <svg
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        </span>
                        <input
                            v-model="email"
                            id="email"
                            type="email"
                            required
                            class="w-full pl-10 pr-3 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 transition"
                            :placeholder="$t('login.emailPlaceholder')"
                        />
                    </div>
                </div>
                <div class="mb-6 sm:mb-8">
                    <label
                        class="block mb-2 text-gray-700 font-semibold"
                        for="password"
                        >{{ $t('login.password') }}</label
                    >
                    <div class="relative">
                        <span
                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-400"
                        >
                            <svg
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 17v.01M17 10V7a5 5 0 00-10 0v3m12 0v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7h12z"
                                />
                            </svg>
                        </span>
                        <input
                            :type="showPassword ? 'text' : 'password'"
                            v-model="password"
                            id="password"
                            required
                            class="w-full pl-10 pr-12 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 transition"
                            :placeholder="$t('login.passwordPlaceholder')"
                        />
                        <span
                            class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-indigo-400 hover:text-indigo-600"
                            @click="showPassword = !showPassword"
                            tabindex="0"
                            @keydown.enter.prevent="
                                showPassword = !showPassword
                            "
                            @keydown.space.prevent="
                                showPassword = !showPassword
                            "
                            :aria-label="
                                showPassword
                                    ? $t('login.hidePassword')
                                    : $t('login.showPassword')
                            "
                            role="button"
                        >
                            <svg
                                v-if="showPassword"
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.13 0 2.21.19 3.22.54M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    d="M3 3l18 18"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            <svg
                                v-else
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                                />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </span>
                    </div>
                </div>
                <button
                    type="submit"
                    class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 sm:py-3 rounded-xl font-bold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition text-base sm:text-lg tracking-wide"
                >
                    {{ $t('login.loginBtn') }}
                </button>
                <p
                    v-if="error"
                    class="text-red-500 mt-4 sm:mt-6 text-center font-medium"
                >
                    {{ error }}
                </p>
                <div
                    class="mt-6 sm:mt-8 text-center text-gray-400 text-xs sm:text-sm"
                >
                    <span>{{ $t('login.noAccount') }}</span>
                    <router-link
                        to="/register"
                        class="text-indigo-600 font-semibold hover:underline ml-1"
                        >{{ $t('login.signup') }}</router-link
                    >
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { api } from '../../api';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const email = ref('');
const password = ref('');
const error = ref('');
const showPassword = ref(false);
const router = useRouter();

function changeLanguage() {
    localStorage.setItem('locale', locale.value);
    // vue-i18n will reactively update
}

const login = async () => {
    error.value = '';
    if (password.value.length < 8) {
        error.value = t('login.passwordTooShort');
        return;
    }
    try {
        const res = await api.post('/login/', {
            email: email.value,
            password: password.value,
        });
        if (res.status !== 200) {
            error.value = t('login.loginFailed');
            return;
        }
        if (res.status === 200) {
            localStorage.setItem('auth_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            api.defaults.headers.common[
                'Authorization'
            ] = `Bearer ${res.data.access}`;
            let oldProfile = null;
            let isOldImage = false;
            try {
                oldProfile = JSON.parse(localStorage.getItem('profile'));
            } catch (e) {
                oldProfile = null;
            }
            const profileRes = await api.get('/profile/');
            const user = profileRes.data;
            let image =
                'https://ui-avatars.com/api/?name=' +
                (user.name || 'User') +
                '&background=random&size=128';
            if (
                oldProfile &&
                oldProfile.name === user.name &&
                oldProfile.email === user.email &&
                oldProfile.image
            ) {
                image = oldProfile.image;
                isOldImage = true;
            }
            const profile = {
                name: user.name,
                email: user.email,
                image: image,
                isOldImage: isOldImage,
            };
            localStorage.setItem('profile', JSON.stringify(profile));
            router.push({ name: 'Home' });
        } else {
            error.value = t('login.loginFailed');
            return;
        }
    } catch (e) {
        console.error(e);
        error.value = e.response?.data?.message || t('login.loginFailed');
    }
};
</script>
