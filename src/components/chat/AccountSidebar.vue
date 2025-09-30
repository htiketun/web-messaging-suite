<template>
    <aside class="h-full p-0 bg-white flex flex-col shadow-md w-full">
        <!-- Mobile: Tabs -->
        <div class="md:hidden border-b overflow-x-auto">
            <div class="flex min-w-max">
                <button
                    v-for="user in filteredUsers"
                    :key="user.id"
                    @click="selectAccount(user)"
                    :class="[
                        'flex-1 py-3 px-2 text-sm font-semibold focus:outline-none transition',
                        user.id === selectedAccountId
                            ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                            : 'text-gray-500 hover:bg-blue-50',
                    ]"
                    style="min-width: 100px"
                >
                    <span
                        v-if="user.unread"
                        class="bg-blue-500 text-white text-xs px-1 rounded-full ml-1"
                    >
                        {{ user.unread }}
                    </span>
                    <img
                        :src="
                            user.avatarType === 'base64'
                                ? `data:image/jpeg;base64,${user.avatar}`
                                : user.avatar
                        "
                        class="w-8 h-8 rounded-full mx-auto mb-1 border-2 border-blue-100"
                    />
                    <div class="truncate">{{ user.name.split(' ')[0] }}</div>
                </button>
            </div>
        </div>
        <!-- Desktop: User List -->
        <ul class="flex-1 overflow-y-auto px-2 py-2 hidden md:block">
            <li
                v-for="user in filteredUsers"
                :key="user.id"
                class="flex items-center p-3 rounded-xl hover:bg-blue-100 cursor-pointer mb-2 transition"
                :class="
                    user.id === selectedAccountId
                        ? 'bg-blue-100 border border-blue-300'
                        : user.active
                        ? 'bg-blue-50 border border-blue-200'
                        : ''
                "
                @click="selectAccount(user)"
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
                    <div class="font-semibold truncate text-gray-900">
                        {{ user.name }}
                        <div class="text-xs text-gray-400 truncate">
                            Last seen: {{ user.lastSeen }}
                        </div>
                    </div>
                    <div class="text-xs text-gray-400 truncate">
                        {{ user.username ? `@${user.username}` : '' }}
                        {{ user.phone ? `+${user.phone}` : '' }}
                    </div>
                </div>
                <span
                    v-if="user.unread"
                    class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2 min-w-[2rem] text-center"
                >
                    {{ user.unread }}
                </span>
            </li>
            <li
                v-if="filteredUsers.length === 0"
                class="text-center text-gray-400 py-8"
            >
                No users found.
            </li>
        </ul>
    </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
const emit = defineEmits(['account-selected']);

const search = ref('');
const users = ref([]);

const selectedAccountId = ref(users.value[0]?.id || null);

const filteredUsers = computed(() =>
    users.value.filter((user) =>
        user.name.toLowerCase().includes(search.value.toLowerCase()),
    ),
);

function selectAccount(user) {
    selectedAccountId.value = user;
    emit('account-selected', user);
}

import { onMounted, inject } from 'vue';
import api from '../../api';

const mediaUrl = inject('mediaUrl', 'http://127.0.0.1:8888/');

async function fetchTelegramAccounts() {
    try {
        const response = await api.post('/telegram/accounts/');
        if (response && response.data) {
            users.value = response.data.map((account) => ({
                id: account.id,
                name: `${account.first_name} ${account.last_name || ''}`.trim(),
                username: account.username || '',
                phone: account.phone || '',
                session_file: account.session_file,
                avatar:
                    mediaUrl + account.photo ||
                    'https://ui-avatars.com/api/?name=' +
                        (account.name || 'User') +
                        '&background=random&size=128',
                avatarType: 'image',
                lastSeen: account.last_seen || 'Online',
                unread: account.unread_count || 0,
                active: account.is_active,
            }));
        }
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    fetchTelegramAccounts();
});
</script>
