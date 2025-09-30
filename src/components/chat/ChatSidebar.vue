<template>
    <aside
        v-if="accountId"
        class="h-full p-4 bg-white flex flex-col shadow-lg w-full md:max-w-sm transition-all duration-300 sm:max-w-full sm:p-2 sm:rounded-none"
    >
        <div class="mb-4 flex flex-col gap-2">
            <input
                type="text"
                :placeholder="t('chat.search_placeholder')"
                class="px-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-400 outline-none transition"
                v-model="search"
            />
            <div class="flex gap-2 items-center">
                <select
                    v-model="genderFilter"
                    class="rounded px-2 py-1 bg-gray-100 text-sm"
                >
                    <option value="">{{ t('chat.all_genders') }}</option>
                    <option value="male">{{ t('chat.male') }}</option>
                    <option value="female">{{ t('chat.female') }}</option>
                </select>
                <input
                    type="number"
                    v-model.number="ageMin"
                    :placeholder="t('chat.age_min')"
                    min="0"
                    class="w-20 rounded px-2 py-1 bg-gray-100 text-sm"
                />
                <span>-</span>
                <input
                    type="number"
                    v-model.number="ageMax"
                    :placeholder="t('chat.age_max')"
                    min="0"
                    class="w-20 rounded px-2 py-1 bg-gray-100 text-sm"
                />
                <button
                    v-if="genderFilter || ageMin || ageMax"
                    @click="
                        genderFilter = '';
                        ageMin = '';
                        ageMax = '';
                    "
                    class="ml-auto text-sm text-red-500 hover:underline"
                    :title="t('chat.clear_filters')"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
        <ul class="flex-1 overflow-y-auto space-y-2">
            <li
                v-for="user in filteredUsers"
                :key="user.id"
                class="flex items-center p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition group"
                :class="
                    user.id === selectedChatId
                        ? 'bg-blue-100 border border-blue-300'
                        : user.active
                        ? 'bg-blue-50 border border-blue-200'
                        : ''
                "
                @click="selectChat(user)"
            >
                <img
                    :src="
                        user.avatarType === 'base64'
                            ? `data:image/jpeg;base64,${user.avatar}`
                            : user.avatar
                    "
                    class="w-12 h-12 rounded-full mr-3 border-2 border-blue-100"
                />
                <div class="flex-1 min-w-0">
                    <div class="text-xs text-gray-500 flex items-center gap-2">
                        <span v-if="user.gender" class="flex items-center">
                            <svg
                                v-if="user.gender === 'male'"
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 mr-1 text-blue-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <circle
                                    cx="10"
                                    cy="14"
                                    r="5"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    fill="none"
                                />
                                <path
                                    d="M19 5v4m0-4h-4m4 0l-6 6"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            <svg
                                v-else-if="user.gender === 'female'"
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 mr-1 text-pink-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 14v7m0 0H9m3 0h3m-3-7a5 5 0 100-10 5 5 0 000 10z"
                                />
                            </svg>
                            <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 mr-1 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="5"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    fill="none"
                                />
                            </svg>
                        </span>
                        <span
                            v-if="user.age"
                            class="flex items-center ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium shadow-sm"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3 w-3 mr-1 text-blue-400"
                                fill="none"
                                viewBox="0 0 20 20"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 6a4 4 0 100 8 4 4 0 000-8zm0 0V4m0 12v-2"
                                />
                            </svg>
                            {{ user.age }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="font-semibold truncate text-gray-900">
                            {{ user.name }}
                        </div>

                        <div
                            v-if="user.last_message_time"
                            class="text-xs text-gray-400 ml-2 whitespace-nowrap"
                        >
                            {{ formatTime(user.last_message_time) }}
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <span
                            class="text-xs text-gray-500 truncate flex items-center"
                            v-if="user.last_message && user.last_message.text"
                        >
                            {{ user.last_message.text }}
                        </span>
                        <span
                            v-if="user.unread_count > 0"
                            class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2 min-w-[2rem] text-center font-bold shadow"
                        >
                            {{ user.unread_count }}
                        </span>
                    </div>
                </div>
            </li>
        </ul>
    </aside>
    <aside
        v-else
        class="h-full p-4 bg-white flex flex-col shadow-lg max-w-xs w-full md:max-w-sm transition-all duration-300 sm:max-w-full sm:p-2 sm:rounded-none"
    >
        <div
            class="flex flex-col items-center justify-center h-full text-center text-gray-500"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16 mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
            </svg>
            <p class="text-lg font-medium">
                {{ t('chat.no_account_selected') }}
            </p>
            <p class="mt-2 text-sm">{{ t('chat.select_account') }}</p>
        </div>
    </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

function formatTime(time) {
    if (!time) return '';
    const date = new Date(time);
    if (isNaN(date.getTime())) return time;
    const today = new Date();
    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
    if (isToday) {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    } else {
        return date.toLocaleDateString();
    }
}

const { t } = useI18n();
const props = defineProps({
    accountId: {
        type: [String, Number],
        default: null,
    },
    chatAccountUser: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(['chat-selected']);

const selectedChatId = ref(null);

function selectChat(user) {
    selectedChatId.value = user;
    emit('chat-selected', user);
}

const search = ref('');
const users = ref([]);

// New filter states
const genderFilter = ref('');
const ageMin = ref('');
const ageMax = ref('');

// Filtered users with gender and age range
const filteredUsers = computed(() =>
    users.value.filter((user) => {
        // Search filter
        if (
            search.value &&
            !user.name.toLowerCase().includes(search.value.toLowerCase())
        ) {
            return false;
        }
        // Gender filter
        if (genderFilter.value && user.gender !== genderFilter.value) {
            return false;
        }
        // Age filter
        // Handle age as a single number or a range string like "20 - 30"
        let ageMinUser = null;
        let ageMaxUser = null;
        if (typeof user.age === 'string' && user.age.includes('-')) {
            const [minStr, maxStr] = user.age.split('-').map((s) => s.trim());
            ageMinUser = Number(minStr);
            ageMaxUser = Number(maxStr);
        } else {
            const ageNum = Number(user.age);
            if (!isNaN(ageNum)) {
                ageMinUser = ageMaxUser = ageNum;
            }
        }
        if (
            ageMin.value !== '' &&
            (ageMaxUser === null || ageMaxUser < ageMin.value)
        ) {
            return false;
        }
        if (
            ageMax.value !== '' &&
            (ageMinUser === null || ageMinUser > ageMax.value)
        ) {
            return false;
        }
        return true;
    }),
);

import api from '../../api';
// WebSocket connection for real-time chat sync status
import { onUnmounted, inject } from 'vue';

const mediaUrl = inject('mediaUrl', 'http://127.0.0.1:8001/');

const socketUrl = inject('socketUrl', 'ws://127.0.0.1:8002/ws/');

let socket = null;

function setupWebSocket() {
    if (props.chatAccountUser && props.chatAccountUser.id) {
        socket = new WebSocket(`${socketUrl}telegram-chats/`);
        socket.onopen = () => {
            // Send telegram_account_id for chat sync
            const payload = {
                session_file: props.chatAccountUser.session_file,
                type: 'chatSync',
            };
            socket.send(JSON.stringify(payload));
        };
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Handle status updates (progress, success, error)
            // Example: show notification or reload chat list
            if (data.status === 'chatSync') {
                fetchChatLists();
            }
            // You can handle 'progress' and 'error' as needed
        };
    }
}

onUnmounted(() => {
    if (socket) {
        socket.close();
        socket = null;
    }
});

async function fetchChatLists() {
    try {
        const response = await api.post('/chats/', {
            telegram_account_id: props.accountId,
        });
        if (response && response.data) {
            users.value = response.data.map((account) => ({
                gender: account.gender ?? 'unknown',
                id: account.id,
                is_active: account.is_active ?? false,
                is_favorite: account.is_favorite ?? false,
                last_message: account.last_message ?? null,
                last_message_id: account.last_message_id ?? null,
                last_message_time: account.last_message_time ?? null,
                last_seen: account.last_seen ?? 'Online',
                name: account.name,
                oldest_message_id: account.oldest_message_id ?? null,
                oldest_message_time: account.oldest_message_time ?? null,
                avatar:
                    mediaUrl + account.photo ||
                    'https://ui-avatars.com/api/?name=' +
                        (account.name || 'User') +
                        '&background=random&size=128',
                avatarType: 'image',
                telegram_account_id: account.telegram_account_id,
                type: account.type,
                unread_count: account.unread_count ?? 0,
                username: account.username ?? '',
                age: account.age ?? '',
                gender: account.gender ?? '',
            }));
        }
    } catch (error) {
        console.error(error);
    }
}

watch(
    () => props.accountId,
    (newId) => {
        if (newId) {
            if (socket) {
                socket.close();
                socket = null;
            }
            fetchChatLists();
            setupWebSocket();
        } else {
            users.value = [];
            selectedChatId.value = null;
            if (socket) {
                socket.close();
                socket = null;
            }
        }
    },
    { immediate: true },
);
</script>
