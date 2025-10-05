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
                        'flex-1 py-3 px-2 text-sm font-semibold focus:outline-none transition duration-150',
                        user.id === selectedAccountId
                            ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-100'
                            : 'text-gray-500 hover:bg-blue-50',
                    ]"
                    style="min-width: 100px"
                >
                    <div class="flex flex-col items-center">
                        <img
                            :src="
                                user.avatarType === 'base64'
                                    ? `data:image/jpeg;base64,${user.avatar}`
                                    : user.avatar
                            "
                            class="w-8 h-8 rounded-full mb-1 border-2 border-blue-100 shadow"
                        />
                        <div class="truncate max-w-[80px]">
                            {{ user.name.split(' ')[0] }}
                        </div>
                        <span
                            v-if="user.unread"
                            class="bg-blue-500 text-white text-xs px-2 rounded-full mt-1"
                        >
                            {{ user.unread }}
                        </span>
                    </div>
                </button>
            </div>
        </div>
        <!-- Desktop: User List -->
        <div
            class="flex-1 overflow-y-auto px-2 py-2 hidden md:block bg-gray-50"
        >
            <div class="sticky top-0 z-10 bg-gray-50 pb-2">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Search users..."
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 mb-2"
                />
            </div>
            <ul>
                <li
                    v-for="user in filteredUsers"
                    :key="user.id"
                    class="flex items-center p-3 rounded-xl hover:bg-blue-100 cursor-pointer mb-2 transition duration-150"
                    :class="
                        user.id === selectedAccountId
                            ? 'bg-blue-100 border border-blue-300 shadow'
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
                        class="w-12 h-12 rounded-full mr-3 border-2 border-blue-100 shadow"
                    />
                    <div class="flex-1 min-w-0">
                        <div
                            class="font-semibold truncate text-gray-900 flex items-center"
                        >
                            {{ user.name }}
                            <span
                                v-if="user.active"
                                class="ml-2 inline-block w-2 h-2 rounded-full bg-green-400"
                                title="Active"
                            ></span>
                        </div>
                        <div class="text-xs text-gray-400 truncate">
                            Last seen: {{ user.lastSeen }}
                        </div>
                        <div class="text-xs text-gray-500 truncate mt-1">
                            <span v-if="user.username"
                                >@{{ user.username }}</span
                            >
                            <span v-if="user.phone" class="ml-2"
                                >+{{ user.phone }}</span
                            >
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
    users.value.filter((user) =>
        user.name.toLowerCase().includes(search.value.toLowerCase()),
    ),
);

function selectAccount(user) {
    selectedAccountId.value = user.id;
    emit('account-selected', user);
}

import { api } from '../../api';

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
                avatar: account.photo
                    ? mediaUrl + account.photo
                    : 'https://ui-avatars.com/api/?name=' +
                      (account.first_name || 'User') +
                      '&background=random&size=128',
                avatarType: account.photo ? 'image' : 'url',
                lastSeen: account.last_seen || 'Online',
                unread: account.unread_count || 0,
                active: account.is_active,
            }));
            // Select first account by default
            selectedAccountId.value = users.value[0]?.id || null;
        }
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    fetchTelegramAccounts();
});
</script>
