<template>
    <header
        class="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 px-4 sm:px-6 py-2 sm:py-0 bg-white border-b"
    >
        <div
            class="relative flex items-center w-full sm:w-auto mb-2 sm:mb-0"
        ></div>

        <div class="flex items-center w-full sm:w-auto justify-end">
            <div class="relative mx-2">
                <button
                    class="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-indigo-50 transition-colors duration-200 focus:outline-none"
                    @click="showLangDropdown = !showLangDropdown"
                >
                    <img
                        v-if="locale === 'en'"
                        src="https://flagcdn.com/us.svg"
                        alt="English"
                        class="w-5 h-5 ml-1 rounded-full border"
                    />
                    <img
                        v-else-if="locale === 'cn'"
                        src="https://flagcdn.com/cn.svg"
                        alt="中文"
                        class="w-5 h-5 ml-1 rounded-full border"
                    />
                    <img
                        v-else
                        src="https://flagcdn.com/mm.svg"
                        alt="မြန်မာ"
                        class="w-5 h-5 ml-1 rounded-full border"
                    />
                    <span class="font-medium text-indigo-700">
                        {{
                            locale === 'en'
                                ? 'English'
                                : locale === 'cn'
                                ? '中文'
                                : 'မြန်မာ'
                        }}
                    </span>
                    <svg
                        class="w-4 h-4 ml-1 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
                <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                >
                    <div
                        v-show="showLangDropdown"
                        class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    >
                        <button
                            class="flex items-center w-full px-4 py-2 text-left hover:bg-indigo-50 text-indigo-700 font-medium rounded-t-lg gap-2"
                            :class="{ 'bg-indigo-100': locale === 'en' }"
                            @click="
                                locale = 'en';
                                changeLanguage();
                                showLangDropdown = false;
                            "
                        >
                            <img
                                src="https://flagcdn.com/us.svg"
                                alt="English"
                                class="w-5 h-5 rounded-full border"
                            />
                            <span>English</span>
                            <svg
                                v-if="locale === 'en'"
                                class="ml-auto w-4 h-4 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </button>
                        <button
                            class="flex items-center w-full px-4 py-2 text-left hover:bg-indigo-50 text-indigo-700 font-medium gap-2"
                            :class="{ 'bg-indigo-100': locale === 'mm' }"
                            @click="
                                locale = 'mm';
                                changeLanguage();
                                showLangDropdown = false;
                            "
                        >
                            <img
                                src="https://flagcdn.com/mm.svg"
                                alt="မြန်မာ"
                                class="w-5 h-5 rounded-full border"
                            />
                            <span>မြန်မာ</span>
                            <svg
                                v-if="locale === 'mm'"
                                class="ml-auto w-4 h-4 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </button>
                        <button
                            class="flex items-center w-full px-4 py-2 text-left hover:bg-indigo-50 text-indigo-700 font-medium rounded-b-lg gap-2"
                            :class="{ 'bg-indigo-100': locale === 'cn' }"
                            @click="
                                locale = 'cn';
                                changeLanguage();
                                showLangDropdown = false;
                            "
                        >
                            <img
                                src="https://flagcdn.com/cn.svg"
                                alt="中文"
                                class="w-5 h-5 rounded-full border"
                            />
                            <span>中文</span>
                            <svg
                                v-if="locale === 'cn'"
                                class="ml-auto w-4 h-4 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </button>
                    </div>
                </transition>
                <div
                    v-show="showLangDropdown"
                    class="fixed inset-0 z-40"
                    @click="showLangDropdown = false"
                ></div>
            </div>
            <div class="relative">
                <button
                    class="transition-colors duration-300 rounded-lg sm:px-4 sm:py-2 focus:outline-none hover:bg-gray-100"
                    @click="dropdownOpen = !dropdownOpen"
                >
                    <span class="sr-only">User Menu</span>
                    <div class="flex items-center md:-mx-2">
                        <div
                            class="hidden md:mx-2 md:flex md:flex-col md:items-end md:leading-tight"
                        >
                            <span class="font-semibold text-sm text-gray-800">
                                {{ profile?.name || 'N/A' }}
                            </span>
                            <span class="text-sm text-gray-600">
                                {{ profile?.role || '' }}
                            </span>
                        </div>

                        <img
                            class="flex-shrink-0 w-10 h-10 overflow-hidden bg-gray-100 rounded-full md:mx-2"
                            :src="`${
                                profile?.image ||
                                'https://ui-avatars.com/api/?name=' +
                                    (profile?.name || 'User') +
                                    '&background=random&size=128'
                            }`"
                            :alt="profile?.name || 'user profile photo'"
                        />
                    </div>
                </button>

                <transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                >
                    <div
                        class="absolute right-0 z-50 w-56 p-2 bg-white border rounded-lg top-16 lg:top-20"
                        v-show="dropdownOpen"
                    >
                        <router-link to="/profile">
                            <div
                                class="px-4 py-2 text-gray-800 transition-colors duration-300 rounded-lg cursor-pointer hover:bg-gray-100"
                            >
                                {{ $t('profile.title') }}
                            </div>
                        </router-link>
                        <router-link to="/saved-messages">
                            <div
                                class="px-4 py-2 text-gray-800 transition-colors duration-300 rounded-lg cursor-pointer hover:bg-gray-100"
                            >
                                {{ $t('header.saved_messages') }}
                            </div>
                        </router-link>
                        <router-link to="/todo">
                            <div
                                class="px-4 py-2 text-gray-800 transition-colors duration-300 rounded-lg cursor-pointer hover:bg-gray-100"
                            >
                                {{ $t('header.to_dos') }}
                            </div>
                        </router-link>
                    </div>
                </transition>
            </div>
            <div
                v-show="dropdownOpen"
                class="fixed inset-0 z-30"
                @click="dropdownOpen = false"
            ></div>

            <button
                class="relative p-2 mx-3 text-gray-400 transition-colors duration-300 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100"
            >
                <span class="sr-only">Notifications</span>
                <span
                    class="absolute top-0 right-0 w-2 h-2 mt-1 mr-2 bg-blue-700 rounded-full"
                ></span>
                <span
                    class="absolute top-0 right-0 w-2 h-2 mt-1 mr-2 bg-blue-700 rounded-full animate-ping"
                ></span>

                <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>
            </button>

            <button
                @click="logout"
                class="p-2 text-gray-400 transition-colors duration-300 rounded-full focus:outline-none hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100"
            >
                <span class="sr-only">{{ $t('header.logout') }}</span>

                <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                </svg>
            </button>
        </div>
        <div
            v-if="showConfirm"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div class="bg-white rounded-lg p-6">
                <h2 class="text-lg font-semibold mb-4">
                    {{ $t('header.confirm_logout') }}
                </h2>
                <p class="mb-4">{{ $t('header.confirm_logout_message') }}</p>
                <div class="flex justify-end">
                    <button
                        @click="confirmLogout"
                        class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        {{ $t('header.confirm_logout_yes') }}
                    </button>
                    <button
                        @click="cancelLogout"
                        class="px-4 py-2 ml-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        {{ $t('header.confirm_logout_no') }}
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api';
import { useI18n } from 'vue-i18n';

const dropdownOpen = ref(false);
const showLangDropdown = ref(false);
const router = useRouter();
const showConfirm = ref(false);
const { locale } = useI18n();

const profile = reactive({
    name: '',
    email: '',
    image: '',
    isOldImage: false,
});

function handleProfileImageChanged() {
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
        Object.assign(profile, JSON.parse(savedProfile));
    }
}

onMounted(() => {
    window.addEventListener('profileImageChanged', handleProfileImageChanged);
    handleProfileImageChanged();
});

onUnmounted(() => {
    window.removeEventListener(
        'profileImageChanged',
        handleProfileImageChanged,
    );
});

function changeLanguage() {
    localStorage.setItem('locale', locale.value);
}

const logout = async () => {
    showConfirm.value = true;
};

const confirmLogout = async () => {
    await api
        .post('/logout/')
        .then(() => {
            localStorage.removeItem('auth_token');
            router.push('/login');
        })
        .catch(() => {
            localStorage.removeItem('auth_token');
            router.push('/login');
        });
    showConfirm.value = false;
};

const cancelLogout = () => {
    showConfirm.value = false;
};
</script>
