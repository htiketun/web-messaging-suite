<template>
    <aside
        v-if="accountId"
        class="h-full p-4 bg-white flex flex-col shadow-lg w-full md:max-w-sm transition-all duration-300 sm:max-w-full sm:p-2 sm:rounded-none"
    >
        <div class="mb-4 flex flex-col gap-2">
            <!-- Real-time connection status -->
            <div class="flex items-center justify-between px-2 py-1">
                <div class="flex items-center gap-2 text-xs">
                    <div
                        class="w-2 h-2 rounded-full"
                        :class="{
                            'bg-green-500': isRealtimeConnected,
                            'bg-red-500': !isRealtimeConnected,
                        }"
                        :title="
                            isRealtimeConnected
                                ? 'Real-time updates active'
                                : 'Real-time updates disconnected'
                        "
                    ></div>
                    <span class="text-gray-600">
                        {{ isRealtimeConnected ? 'Live' : 'Offline' }}
                    </span>
                </div>
                <button
                    v-if="
                        !isRealtimeConnected &&
                        props.chatAccountUser?.session_file
                    "
                    @click="setupRealtimeChatListWebSocket()"
                    class="text-xs text-blue-500 hover:underline"
                >
                    Reconnect
                </button>
            </div>

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
                class="flex items-center p-3 rounded-xl hover:bg-blue-100 cursor-pointer transition group border border-transparent"
                :class="
                    user.id === (selectedChatId && selectedChatId.id)
                        ? 'bg-blue-100 border-blue-300'
                        : user.is_active
                        ? 'bg-blue-50 border-blue-200'
                        : ''
                "
                @click="selectChat(user)"
                tabindex="0"
                @keydown.enter="selectChat(user)"
                aria-label="Open chat with {{ user.name || t('chat.unknown_user') }}"
            >
                <div class="relative mr-3">
                    <img
                        :src="
                            user.avatarType === 'base64'
                                ? `data:image/jpeg;base64,${user.avatar}`
                                : user.avatar ||
                                  'https://ui-avatars.com/api/?name=User&background=random&size=128'
                        "
                        class="w-12 h-12 rounded-full border-2 border-blue-100 object-cover bg-gray-100"
                        :alt="user.name || t('chat.unknown_user')"
                    />
                    <span
                        v-if="user.is_online"
                        class="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow"
                        title="Online"
                    ></span>
                </div>
                <div class="flex-1 min-w-0">
                    <div
                        class="text-xs text-gray-500 flex flex-wrap items-center gap-2"
                    >
                        <!-- Gender Icon -->
                        <span
                            v-if="user.gender"
                            class="flex items-center"
                            :title="t(`chat.${user.gender}`)"
                        >
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
                        <!-- Age Badge -->
                        <span
                            v-if="user.age"
                            class="flex items-center px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-800 text-xs font-semibold shadow-sm border border-yellow-200"
                            :title="`${t('chat.age')}: ${user.age}`"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3 w-3 mr-1 text-yellow-400"
                                fill="none"
                                viewBox="0 0 20 20"
                                stroke="currentColor"
                            >
                                <circle
                                    cx="10"
                                    cy="10"
                                    r="4"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    fill="none"
                                />
                            </svg>
                            {{ user.age }}
                        </span>
                        <!-- Last Seen -->
                        <span
                            v-if="user.last_seen"
                            class="flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium shadow-sm ml-auto"
                            :title="t('chat.last_seen')"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3 w-3 mr-1 text-green-400"
                                fill="none"
                                viewBox="0 0 20 20"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 8V5a1 1 0 10-2 0v5a1 1 0 00.293.707l3 3a1 1 0 101.414-1.414l-2.707-2.707z"
                                />
                            </svg>
                            {{ user.last_seen }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                        <div class="font-semibold truncate text-gray-900">
                            {{ user.name || t('chat.unknown_user') }}
                        </div>
                        <div
                            v-if="user.last_message_time"
                            class="text-xs text-gray-400 ml-2 whitespace-nowrap"
                        >
                            {{ formatTime(user.last_message_time) }}
                        </div>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                        <span
                            class="text-xs text-gray-500 truncate flex items-center"
                            v-if="user.last_message && user.last_message.text"
                        >
                            {{ user.last_message.text }}
                        </span>
                        <span
                            v-if="user.unread_count && user.unread_count > 0"
                            class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2 min-w-[2rem] text-center font-bold shadow"
                        >
                            {{ user.unread_count }}
                        </span>
                    </div>
                </div>
            </li>
            <li
                v-if="filteredUsers.length === 0"
                class="text-center text-gray-400 py-8"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                </svg>
                {{ t('chat.no_users_found') }}
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

function formatLastSeen(time) {
    if (!time) return '';
    const date = new Date(time);
    if (isNaN(date.getTime())) return time;
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function isOnline(user) {
    if (!user.last_seen) return false;
    const lastSeenDate = new Date(user.last_seen);
    const now = new Date();
    const diffMs = now - lastSeenDate;
    return diffMs < 2 * 60 * 1000;
}

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
import { onUnmounted, inject, onMounted } from 'vue';

const mediaUrl = inject('mediaUrl', 'http://127.0.0.1:8888/');

const socketUrl = inject('socketUrl', 'ws://localhost:8000/ws/');

let socket = null;
let chatListSocket = null;
const isRealtimeConnected = ref(false);

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

function setupRealtimeChatListWebSocket() {
    if (chatListSocket) {
        chatListSocket.close();
    }

    if (!props.chatAccountUser?.session_file) {
        return;
    }

    isRealtimeConnected.value = false;
    chatListSocket = new WebSocket(`${socketUrl}chat-list`);

    chatListSocket.onopen = () => {
        isRealtimeConnected.value = true;
        console.log('Real-time chat list WebSocket connected');

        // Request initial chat list
        chatListSocket.send(
            JSON.stringify({
                type: 'get_chat_list',
                session_file: props.chatAccountUser.session_file,
            }),
        );

        // Start monitoring for this session
        startChatListMonitoring();
    };

    chatListSocket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Real-time chat list update:', data);

            if (
                data.type === 'chat_list_initial' ||
                data.type === 'chat_list_current'
            ) {
                handleChatListUpdate(data.chats);
            } else if (data.type === 'chat_list_update') {
                handleSingleChatUpdate(data);
            } else if (data.type === 'user_status_update') {
                handleUserStatusUpdate(data);
            } else if (data.type === 'unread_count_update') {
                handleUnreadCountUpdate(data);
            } else if (data.type === 'connection_established') {
                console.log('Chat list WebSocket connection established');
            }
        } catch (error) {
            console.error('Error parsing chat list WebSocket message:', error);
        }
    };

    chatListSocket.onclose = () => {
        isRealtimeConnected.value = false;
        console.log('Real-time chat list WebSocket disconnected');

        // Auto-reconnect after 3 seconds
        setTimeout(() => {
            if (props.chatAccountUser?.session_file) {
                setupRealtimeChatListWebSocket();
            }
        }, 3000);
    };

    chatListSocket.onerror = (error) => {
        console.error('Chat list WebSocket error:', error);
        isRealtimeConnected.value = false;
    };
}

async function startChatListMonitoring() {
    if (!props.chatAccountUser?.session_file) {
        return;
    }

    try {
        const response = await api.post(
            '/realtime/start-chat-list-monitoring/',
            null,
            {
                params: { session_file: props.chatAccountUser.session_file },
            },
        );

        if (response.data.status === 'success') {
            console.log('Started chat list monitoring:', response.data);
        }
    } catch (error) {
        console.error('Error starting chat list monitoring:', error);
    }
}

async function stopChatListMonitoring() {
    if (!props.chatAccountUser?.session_file) {
        return;
    }

    try {
        await api.post('/realtime/stop-chat-list-monitoring/', null, {
            params: { session_file: props.chatAccountUser.session_file },
        });
        console.log('Stopped chat list monitoring');
    } catch (error) {
        console.error('Error stopping chat list monitoring:', error);
    }
}

function handleChatListUpdate(chats) {
    if (!Array.isArray(chats)) return;

    users.value = chats.map((chat) => ({
        id: chat.id,
        name: chat.name || 'Unknown',
        type: chat.type,
        unread_count: chat.unread_count || 0,
        is_pinned: chat.is_pinned || false,
        is_muted: chat.is_muted || false,
        last_message: chat.last_message,
        online_status: chat.online_status,
        is_online: chat.online_status?.type === 'online',
        last_seen: chat.online_status?.last_seen
            ? formatLastSeen(chat.online_status.last_seen)
            : null,
        avatar:
            chat.photo_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                chat.name || 'User',
            )}&background=random&size=128`,
        avatarType: 'image',
        // Keep existing fields for compatibility
        is_active: false,
        is_favorite: false,
        last_message_id: chat.last_message?.id,
        last_message_time: chat.last_message?.date,
        oldest_message_id: null,
        oldest_message_time: null,
        telegram_account_id: props.accountId,
        username: '',
        age: '',
        gender: '',
    }));
}

function handleSingleChatUpdate(data) {
    const chatIndex = users.value.findIndex((user) => user.id === data.chat_id);
    if (chatIndex !== -1) {
        // Update existing chat
        if (data.last_message) {
            users.value[chatIndex].last_message = data.last_message;
            users.value[chatIndex].last_message_id = data.last_message.id;
            users.value[chatIndex].last_message_time = data.last_message.date;
        }

        // Move chat to top of list for new messages
        const updatedChat = users.value[chatIndex];
        users.value.splice(chatIndex, 1);
        users.value.unshift(updatedChat);
    }
}

function handleUserStatusUpdate(data) {
    const userIndex = users.value.findIndex((user) => user.id === data.user_id);
    if (userIndex !== -1) {
        if (data.status) {
            users.value[userIndex].online_status = data.status;
            users.value[userIndex].is_online = data.status.type === 'online';
            users.value[userIndex].last_seen = data.status.last_seen
                ? formatLastSeen(data.status.last_seen)
                : null;
        }
    }
}

function handleUnreadCountUpdate(data) {
    const userIndex = users.value.findIndex((user) => user.id === data.chat_id);
    if (userIndex !== -1) {
        // This would need more specific logic based on the read update
        // For now, we can trigger a refresh of the specific chat
        console.log('Unread count update for chat:', data.chat_id);
    }
}

onMounted(() => {
    // Initialize real-time chat list WebSocket when component mounts
    if (props.chatAccountUser?.session_file) {
        setupRealtimeChatListWebSocket();
    }
});

onUnmounted(() => {
    if (socket) {
        socket.close();
        socket = null;
    }

    if (chatListSocket) {
        chatListSocket.close();
        chatListSocket = null;
    }

    // Stop monitoring when component unmounts
    if (props.chatAccountUser?.session_file) {
        stopChatListMonitoring();
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
                last_seen: formatLastSeen(account.last_seen) ?? null,
                is_online: isOnline(account) ?? false,
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

// Watch for changes in chat account user for real-time functionality
watch(
    () => props.chatAccountUser,
    async (newUser, oldUser) => {
        if (newUser && newUser !== oldUser) {
            // Stop previous monitoring
            if (oldUser?.session_file && chatListSocket) {
                await stopChatListMonitoring();
                chatListSocket.close();
                chatListSocket = null;
            }

            // Start new monitoring
            if (newUser.session_file) {
                setupRealtimeChatListWebSocket();
            }
        } else if (!newUser && oldUser) {
            // User logged out, stop monitoring
            if (chatListSocket) {
                await stopChatListMonitoring();
                chatListSocket.close();
                chatListSocket = null;
            }
        }
    },
);
</script>
