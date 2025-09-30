<template>
    <div
        class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 px-2 sm:px-0"
    >
        <div class="absolute top-4 right-4 sm:top-8 sm:right-8 z-30">
            <div
                class="inline-flex items-center bg-white/80 backdrop-blur rounded-full shadow-lg px-3 py-1 sm:px-4 sm:py-2 border-2 border-indigo-200"
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
        <div class="relative w-full max-w-sm sm:max-w-md">
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
                @submit.prevent="register"
                class="bg-white p-4 pt-16 sm:p-10 sm:pt-20 rounded-3xl shadow-2xl border border-gray-100 relative"
            >
                <div class="flex flex-col items-center mb-6 sm:mb-8">
                    <h2
                        class="text-2xl sm:text-4xl font-extrabold text-indigo-700 mb-2 tracking-tight"
                    >
                        {{ $t('signup.title') }}
                    </h2>
                    <p class="text-gray-500 text-sm sm:text-base">
                        {{ $t('signup.subtitle') }}
                    </p>
                </div>
                <div class="mb-4 sm:mb-6">
                    <label
                        class="block mb-2 text-gray-700 font-semibold text-sm sm:text-base"
                        for="name"
                        >{{ $t('signup.name') }}</label
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
                                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                                />
                                <path
                                    d="M4.22 19.78C5.64 17.5 8.62 16 12 16s6.36 1.5 7.78 3.78"
                                />
                            </svg>
                        </span>
                        <input
                            v-model="name"
                            id="name"
                            type="text"
                            required
                            class="w-full pl-10 pr-3 py-2 sm:py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 transition text-sm sm:text-base"
                            :placeholder="$t('signup.namePlaceholder')"
                        />
                    </div>
                </div>
                <div class="mb-4 sm:mb-6">
                    <label
                        class="block mb-2 text-gray-700 font-semibold text-sm sm:text-base"
                        for="email"
                        >{{ $t('signup.email') }}</label
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
                            class="w-full pl-10 pr-3 py-2 sm:py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 transition text-sm sm:text-base"
                            :placeholder="$t('signup.emailPlaceholder')"
                        />
                    </div>
                </div>
                <div class="mb-4 sm:mb-6">
                    <label
                        class="block mb-2 text-gray-700 font-semibold text-sm sm:text-base"
                        for="password"
                        >{{ $t('signup.password') }}</label
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
                            class="w-full pl-10 pr-12 py-2 sm:py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 transition text-sm sm:text-base"
                            :placeholder="$t('signup.passwordPlaceholder')"
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
                                    ? $t('signup.hidePassword')
                                    : $t('signup.showPassword')
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
                <div class="mb-6 sm:mb-8">
                    <label
                        class="block mb-2 text-gray-700 font-semibold text-sm sm:text-base"
                        for="password_confirmation"
                        >{{ $t('signup.confirmPassword') }}</label
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
                            v-model="password_confirmation"
                            id="password_confirmation"
                            required
                            class="w-full pl-10 pr-12 py-2 sm:py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 transition text-sm sm:text-base"
                            :placeholder="
                                $t('signup.confirmPasswordPlaceholder')
                            "
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 sm:py-3 rounded-xl font-bold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition text-base sm:text-lg tracking-wide"
                >
                    {{ $t('signup.signupBtn') }}
                </button>
                <p
                    v-if="error"
                    class="text-red-500 mt-4 sm:mt-6 text-center font-medium text-sm sm:text-base"
                >
                    {{ error }}
                </p>
                <div
                    class="mt-6 sm:mt-8 text-center text-gray-400 text-xs sm:text-sm"
                >
                    <span>{{ $t('signup.alreadyHaveAccount') }}</span>
                    <router-link
                        to="/login"
                        class="text-indigo-600 font-semibold hover:underline ml-1"
                        >{{ $t('signup.signin') }}</router-link
                    >
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../../api';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const name = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const error = ref('');
const showPassword = ref(false);
const router = useRouter();

function changeLanguage() {
    localStorage.setItem('locale', locale.value);
    // vue-i18n will reactively update
}

const register = async () => {
    error.value = '';
    if (password.value !== password_confirmation.value) {
        error.value = t('signup.passwordsNotMatch');
        return;
    }
    if (password.value.length < 8) {
        error.value = t('login.passwordTooShort');
        return;
    }
    try {
        const response = await api.post('/register/', {
            name: name.value,
            email: email.value,
            password: password.value,
            password2: password_confirmation.value,
        });
        if (response.data && response.data.errors) {
            error.value = Object.values(response.data.errors).flat().join(' ');
            return;
        }
        if (response.status === 201) {
            await api
                .post('/login/', {
                    email: email.value,
                    password: password.value,
                })
                .then((res) => {
                    if (res.status !== 200) {
                        error.value = t('signup.registrationFailed');
                        return;
                    }
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
                });
        }
    } catch (e) {
        console.error(e.response);
        if (e.response && e.response.status === 400) {
            // Handle 400 error response
            if (e.response.data && e.response.data) {
                error.value = Object.values(e.response.data).flat().join(' ');
            } else if (e.response.data && e.response.data.message) {
                error.value = e.response.data.message;
            } else {
                error.value = t('signup.registrationFailed');
            }
        } else {
            error.value =
                e.response?.data?.message || t('signup.registrationFailed');
        }
    }
};
</script>
