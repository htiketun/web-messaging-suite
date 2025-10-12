<template>
    <aside class="h-full p-0 bg-white flex flex-col shadow-md w-full">
        <!-- Mobile: Horizontal Scrollable Cards -->
        <div class="md:hidden border-b bg-gray-50">
            <!-- Mobile Search Bar -->
            <div class="p-3 pb-2">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Search accounts..."
                    class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                />
            </div>

            <!-- Horizontal Scrollable Account Cards -->
            <div
                class="overflow-x-auto pb-2 scrollbar-hide"
                style="-webkit-overflow-scrolling: touch"
            >
                <div class="flex gap-3 px-3 min-w-max">
                    <button
                        v-for="user in filteredUsers"
                        :key="user.id"
                        @click="selectAccount(user)"
                        :class="[
                            'flex-shrink-0 p-3 rounded-xl transition-all duration-200 transform active:scale-95',
                            user.id === selectedAccountId
                                ? 'bg-blue-500 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-700 hover:bg-blue-50 shadow-md hover:shadow-lg border border-gray-200',
                        ]"
                        style="min-width: 120px"
                    >
                        <div class="flex flex-col items-center relative">
                            <!-- Avatar with online indicator -->
                            <div class="relative mb-2">
                                <img
                                    :src="
                                        user.avatarType === 'base64'
                                            ? `data:image/jpeg;base64,${user.avatar}`
                                            : user.avatar
                                    "
                                    class="w-12 h-12 rounded-full border-2 shadow-sm"
                                    :class="
                                        user.id === selectedAccountId
                                            ? 'border-white'
                                            : 'border-blue-100'
                                    "
                                />
                                <span
                                    v-if="user.active"
                                    class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                                    :class="
                                        user.id === selectedAccountId
                                            ? 'bg-green-300'
                                            : 'bg-green-400'
                                    "
                                    title="Online"
                                ></span>
                            </div>

                            <!-- User Name -->
                            <div
                                class="text-xs font-semibold text-center leading-tight mb-1 max-w-[100px]"
                            >
                                <div class="truncate">
                                    {{ user.name.split(' ')[0] }}
                                </div>
                                <div
                                    v-if="user.name.split(' ')[1]"
                                    class="truncate opacity-75"
                                >
                                    {{ user.name.split(' ')[1] }}
                                </div>
                            </div>

                            <!-- Username/Phone -->
                            <div
                                class="text-xs opacity-75 text-center truncate max-w-[100px]"
                            >
                                <span v-if="user.username"
                                    >@{{ user.username }}</span
                                >
                                <span v-else-if="user.phone"
                                    >+{{ user.phone }}</span
                                >
                            </div>

                            <!-- Unread Badge -->
                            <span
                                v-if="user.unread"
                                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-lg"
                            >
                                {{ user.unread > 99 ? '99+' : user.unread }}
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            <!-- No users message for mobile -->
            <div
                v-if="filteredUsers.length === 0"
                class="text-center text-gray-400 py-8 text-sm"
            >
                <div class="mb-2">👤</div>
                <div>No accounts found</div>
                <div class="text-xs mt-1">Try adjusting your search</div>
            </div>
        </div>
        <!-- Desktop: User List -->
        <div
            class="flex-1 overflow-y-auto px-3 py-3 hidden md:block bg-gray-50"
        >
            <!-- Desktop Search Bar -->
            <div class="sticky top-0 z-10 bg-gray-50 pb-3">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Search accounts..."
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                />
            </div>

            <!-- Account List -->
            <div class="space-y-2">
                <div
                    v-for="user in filteredUsers"
                    :key="user.id"
                    class="flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 hover:transform hover:scale-[1.02] active:scale-[0.98]"
                    :class="
                        user.id === selectedAccountId
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-white hover:bg-blue-50 shadow-sm hover:shadow-md border border-gray-100 hover:border-blue-200'
                    "
                    @click="selectAccount(user)"
                >
                    <!-- Avatar with Status -->
                    <div class="relative flex-shrink-0 mr-4">
                        <img
                            :src="
                                user.avatarType === 'base64'
                                    ? `data:image/jpeg;base64,${user.avatar}`
                                    : user.avatar
                            "
                            class="w-14 h-14 rounded-full border-2 shadow-md object-cover"
                            :class="
                                user.id === selectedAccountId
                                    ? 'border-white'
                                    : 'border-blue-100'
                            "
                        />
                        <span
                            v-if="user.active"
                            class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            :class="
                                user.id === selectedAccountId
                                    ? 'bg-green-300'
                                    : 'bg-green-400'
                            "
                            title="Online"
                        ></span>
                    </div>

                    <!-- User Info -->
                    <div class="flex-1 min-w-0">
                        <div
                            class="font-semibold text-base mb-1 truncate flex items-center"
                        >
                            {{ user.name }}
                        </div>
                        <div class="text-sm mb-1 truncate opacity-75">
                            +{{ user.phone }}
                        </div>
                        <div
                            class="text-sm truncate opacity-75 flex items-center gap-2"
                        >
                            <span
                                v-if="user.username"
                                class="flex items-center"
                            >
                                @{{ user.username }}
                            </span>
                        </div>
                    </div>

                    <!-- Unread Badge -->
                    <div class="flex-shrink-0 ml-3">
                        <span
                            v-if="user.unread"
                            class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full min-w-[24px] h-6 shadow-lg"
                            :class="
                                user.id === selectedAccountId
                                    ? 'bg-white text-blue-500'
                                    : 'bg-red-500 text-white'
                            "
                        >
                            {{ user.unread > 99 ? '99+' : user.unread }}
                        </span>
                    </div>
                </div>

                <!-- No users message for desktop -->
                <div
                    v-if="filteredUsers.length === 0"
                    class="text-center text-gray-400 py-12"
                >
                    <div class="mb-4">
                        <svg
                            class="w-16 h-16 mx-auto opacity-50"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div class="text-lg font-medium mb-2">
                        No accounts found
                    </div>
                    <div class="text-sm">
                        Try adjusting your search criteria
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
const emit = defineEmits(['account-selected']);

const search = ref('');
const users = ref([]);

const selectedAccountId = ref(null);

const filteredUsers = computed(() =>
    users.value.filter(
        (user) =>
            user.name.toLowerCase().includes(search.value.toLowerCase()) ||
            (user.username &&
                user.username
                    .toLowerCase()
                    .includes(search.value.toLowerCase())) ||
            (user.phone && user.phone.includes(search.value)),
    ),
);

// Mobile responsive helper
const isMobile = computed(() => window.innerWidth < 768);

function selectAccount(user) {
    selectedAccountId.value = user.id;
    emit('account-selected', user);
}

import { api } from '../../api';

const mediaUrl = inject('mediaUrl', 'http://127.0.0.1:8888/');

async function fetchTelegramAccounts() {
    try {
        const response = await api.post('/user/telegram-accounts/');
        if (response && response.data && response.data.telegram_accounts) {
            console.log(response.data);
            users.value = response.data.telegram_accounts.map((account) => ({
                id: account.id,
                name: `${account.first_name} ${account.last_name || ''}`.trim(),
                username: account.username || '',
                phone: account.phone || '',
                session_file: account.session_file,
                avatar: account.photo
                    ? mediaUrl + account.photo
                    : 'https://ui-avatars.com/api/?name=' +
                      (account.first_name || 'User') +
                      '&background=random&size=128',
                avatarType: account.photo ? 'image' : 'url',
                lastSeen: account.last_seen
                    ? new Date(account.last_seen).toLocaleString()
                    : 'Online',
                unread: account.unread_count || 0,
                active: account.is_active,
            }));
            // // Select first account by default and emit event
            // if (users.value.length > 0) {
            //     selectedAccountId.value = users.value[0].id;
            //     emit('account-selected', users.value[0]);
            // }
        }
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    fetchTelegramAccounts();
});
</script>

<style scoped>
/* Hide scrollbar for mobile horizontal scroll */
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Smooth scroll behavior */
.overflow-x-auto {
    scroll-behavior: smooth;
}

/* Touch improvements for mobile */
@media (max-width: 767px) {
    button {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
    }

    /* Better touch targets */
    .flex-shrink-0 {
        min-height: 44px;
        min-width: 44px;
    }
}

/* Desktop hover enhancements */
@media (min-width: 768px) {
    .hover\:transform:hover {
        transition: all 0.2s ease-in-out;
    }

    .hover\:scale-\[1\.02\]:hover {
        transform: scale(1.02);
    }

    .active\:scale-\[0\.98\]:active {
        transform: scale(0.98);
    }
}

/* Pulse animation for unread badges */
@keyframes pulse-red {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}

.bg-red-500 {
    animation: pulse-red 2s infinite;
}

/* Smooth transitions */
* {
    transition-property: background-color, border-color, color, fill, stroke,
        opacity, box-shadow, transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}
</style>
