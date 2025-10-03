<template>
    <div
        class="relative min-h-screen lg:flex bg-gradient-to-br from-blue-50 to-indigo-100"
    >
        <SidebarMenu />

        <main
            id="content"
            class="flex-1 pb-12 space-y-6 overflow-y-auto bg-transparent lg:h-screen md:space-y-8"
        >
            <Header />

            <section
                class="flex flex-col w-full px-6 md:justify-between md:items-center md:flex-row"
            >
                <div>
                    <h2
                        class="text-3xl font-bold text-indigo-800 drop-shadow-sm"
                    >
                        {{ t('profile.title') }}
                    </h2>
                    <p class="mt-2 text-sm text-indigo-600">
                        {{ t('profile.description') }}
                    </p>
                </div>
            </section>

            <section
                class="w-full mx-auto bg-white/90 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 space-y-8 backdrop-blur-md px-6"
                style="max-width: 90%"
            >
                <div v-if="successMessage" class="mb-4">
                    <div
                        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <strong class="font-bold">Success!</strong>
                        <span class="block sm:inline">{{
                            successMessage
                        }}</span>
                        <span
                            class="absolute top-0 bottom-0 right-0 px-4 py-3"
                            @click="successMessage = ''"
                            style="cursor: pointer"
                        >
                            <svg
                                class="fill-current h-6 w-6 text-green-500"
                                role="button"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <title>Close</title>
                                <path
                                    d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652a1 1 0 10-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
                <div v-if="errorMessage" class="mb-4">
                    <div
                        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <strong class="font-bold">Error!</strong>
                        <span class="block sm:inline">{{ errorMessage }}</span>
                        <span
                            class="absolute top-0 bottom-0 right-0 px-4 py-3"
                            @click="errorMessage = ''"
                            style="cursor: pointer"
                        >
                            <svg
                                class="fill-current h-6 w-6 text-red-500"
                                role="button"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <title>Close</title>
                                <path
                                    d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652a1 1 0 10-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
                <h3
                    class="text-xl font-bold text-indigo-700 mb-2 flex items-center gap-2"
                >
                    <svg
                        class="w-6 h-6 text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    {{ t('profile.title') || 'Profile' }}
                </h3>
                <div class="max-w-2xl mx-auto space-y-8">
                    <div class="flex flex-col items-center space-y-3">
                        <div class="relative group">
                            <img
                                :src="profile.image"
                                class="w-28 h-28 rounded-full object-cover border-4 border-indigo-200 shadow-lg transition-all duration-300 group-hover:brightness-90"
                                alt="Profile"
                            />
                            <button
                                v-if="profile.isOldImage"
                                @click="removePhoto"
                                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition"
                                title="Remove Photo"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            <label
                                class="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 cursor-pointer shadow hover:bg-indigo-700 transition"
                                title="Change Photo"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    @change="onImageChange"
                                    class="hidden"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z"
                                    />
                                </svg>
                            </label>
                        </div>
                        <span class="text-sm text-gray-500">{{
                            t('profile.photoHint')
                        }}</span>
                    </div>

                    <form @submit.prevent="saveProfile" class="space-y-5">
                        <div>
                            <label
                                class="block text-gray-700 font-semibold mb-1"
                                >{{ t('profile.name') }}</label
                            >
                            <input
                                v-model="profile.name"
                                type="text"
                                class="w-full border border-indigo-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                                required
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-gray-700 font-semibold mb-1"
                                >{{ t('profile.email') }}</label
                            >
                            <input
                                v-model="profile.email"
                                type="email"
                                class="w-full border border-indigo-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                                required
                                placeholder="your@email.com"
                            />
                        </div>
                        <button
                            type="submit"
                            class="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
                        >
                            {{ t('profile.save') }}
                        </button>
                    </form>

                    <form
                        @submit.prevent="changePassword"
                        class="space-y-5 border-t pt-6"
                    >
                        <div>
                            <label
                                class="block text-gray-700 font-semibold mb-1"
                                >{{ t('profile.currentPassword') }}</label
                            >
                            <div class="relative">
                                <input
                                    :type="
                                        showPassword.current
                                            ? 'text'
                                            : 'password'
                                    "
                                    v-model="passwords.current"
                                    class="w-full border border-indigo-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                                    required
                                />
                                <button
                                    type="button"
                                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                    @click="
                                        showPassword.current =
                                            !showPassword.current
                                    "
                                    tabindex="-1"
                                >
                                    <svg
                                        v-if="showPassword.current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
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
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                                        />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label
                                class="block text-gray-700 font-semibold mb-1"
                                >{{ t('profile.newPassword') }}</label
                            >
                            <div class="relative">
                                <input
                                    :type="
                                        showPassword.new ? 'text' : 'password'
                                    "
                                    v-model="passwords.new"
                                    class="w-full border border-indigo-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                                    required
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                    @click="
                                        showPassword.new = !showPassword.new
                                    "
                                    tabindex="-1"
                                >
                                    <svg
                                        v-if="showPassword.new"
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
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
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                                        />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label
                                class="block text-gray-700 font-semibold mb-1"
                                >{{ t('profile.confirmNewPassword') }}</label
                            >
                            <div class="relative">
                                <input
                                    :type="
                                        showPassword.confirm
                                            ? 'text'
                                            : 'password'
                                    "
                                    v-model="passwords.confirm"
                                    class="w-full border border-indigo-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                                    required
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                    @click="
                                        showPassword.confirm =
                                            !showPassword.confirm
                                    "
                                    tabindex="-1"
                                >
                                    <svg
                                        v-if="showPassword.confirm"
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
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
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                                        />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            class="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition"
                        >
                            {{ t('profile.changePassword') }}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Header from './layout/Header.vue';
import SidebarMenu from './layout/SidebarMenu.vue';
import { useI18n } from 'vue-i18n';
import { api } from '../api';

const { t } = useI18n();

const showPassword = reactive({
    current: false,
    new: false,
    confirm: false,
});

const profile = reactive({
    name: '',
    email: '',
    image: '',
    isOldImage: false,
});

const passwords = reactive({
    current: '',
    new: '',
    confirm: '',
});

const successMessage = ref('');
const errorMessage = ref('');

onMounted(() => {
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
        Object.assign(profile, JSON.parse(savedProfile));
    }
});

const saveProfile = async () => {
    successMessage.value = '';
    errorMessage.value = '';
    try {
        await api.put('/profile/update/', profile).then((response) => {
            if (response.status === 200 && response.data) {
                localStorage.setItem('profile', JSON.stringify(profile));
                successMessage.value = t('profile.profileUpdated');
            } else {
                throw new Error('Failed to save profile');
            }
        });
    } catch (error) {
        console.error('Error saving profile:', error);
        errorMessage.value = t('profile.saveError');
    }
};

function onImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        profile.image = event.target.result;
        profile.isOldImage = true;
        localStorage.setItem('profile', JSON.stringify(profile));
        const imageChangeEvent = new Event('profileImageChanged');
        window.dispatchEvent(imageChangeEvent);
        successMessage.value = t('profile.photoUpdated');
    };
    reader.readAsDataURL(file);
    // want to emit window event to notify other components if needed
}

function removePhoto() {
    successMessage.value = '';
    errorMessage.value = '';
    profile.image =
        'https://ui-avatars.com/api/?name=' +
        (profile.name || 'User') +
        '&background=random&size=128';
    profile.isOldImage = false;
    localStorage.setItem('profile', JSON.stringify(profile));
    const imageChangeEvent = new Event('profileImageChanged');
    window.dispatchEvent(imageChangeEvent);
    successMessage.value = t('profile.photoUpdated');
    successMessage.value = t('profile.photoRemoved');
}

const changePassword = async () => {
    successMessage.value = '';
    errorMessage.value = '';
    if (passwords.new !== passwords.confirm) {
        errorMessage.value = t('profile.passwordMismatch');
        return;
    }
    try {
        await api
            .post('/profile/change-password/', {
                old_password: passwords.current,
                new_password: passwords.new,
            })
            .then((response) => {
                if (response.status === 200 && response.data) {
                    passwords.current = '';
                    passwords.new = '';
                    passwords.confirm = '';
                    successMessage.value = t('profile.passwordChanged');
                } else {
                    throw new Error('Failed to change password');
                }
            });
    } catch (error) {
        if (error.response && error.response.status === 422) {
            // Show validation error message from backend if available
            errorMessage.value = t('profile.incorrectCurrentPassword');
        } else {
            errorMessage.value = t('profile.changePasswordError');
            console.error('Error changing password:', error);
        }
    }
};
</script>
