<template>
    <div class="flex flex-col h-screen bg-gray-100 lg:flex-row">
        <!-- Sidebar -->
        <AccountSidebar
            @account-selected="handleAccountSelected"
            class="border-b lg:w-2/12 lg:border-b-0 lg:border-r"
        />

        <div class="block lg:hidden mt-2"></div>
        <ChatSidebar
            :accountId="selectedAccountId"
            @chat-selected="handleChatSelected"
            :chatAccountUser="selectedAccountUser"
            class="border-b lg:w-6/12 lg:border-b-0 lg:border-r"
        />

        <div class="block lg:hidden mt-2"></div>

        <!-- Chat Panel -->
        <ChatPanel
            class="flex-1 flex flex-col lg:w-2/12"
            :chatId="selectedChatId"
            :user="selectedUser"
            :chatAccountUser="selectedAccountUser"
        />
    </div>
</template>

<script setup>
import AccountSidebar from './chat/AccountSidebar.vue';
import ChatSidebar from './chat/ChatSidebar.vue';
import ChatPanel from './chat/ChatPanel.vue';
import { ref } from 'vue';

const selectedAccountId = ref(null);
const selectedChatId = ref(null);
const selectedUser = ref(null);
const selectedAccountUser = ref(null);

function handleAccountSelected(user) {
    selectedAccountId.value = user.id;
    selectedAccountUser.value = user;
    selectedChatId.value = null;
    selectedUser.value = null;
}

function handleChatSelected(user) {
    selectedChatId.value = user.id;
    selectedUser.value = user;
}
</script>
<!-- Commit 34: 2024-09-16T06:02:10 -->
