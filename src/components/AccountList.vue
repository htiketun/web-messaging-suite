<template>
    <div class="p-4 max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-4 text-center text-blue-700">
            Your Telegram Accounts
        </h2>
        <ul class="space-y-3 mb-6">
            <li
                v-for="acc in accounts"
                :key="acc.id"
                class="flex items-center bg-white shadow rounded-lg px-4 py-3 hover:bg-blue-50 transition"
            >
                <div class="flex-1">
                    <div class="font-semibold text-lg text-gray-800">
                        {{ acc.phone || 'QR login' }}
                    </div>
                    <div class="text-gray-500 text-sm">
                        {{ acc.username || 'No username' }}
                    </div>
                </div>
                <button
                    class="ml-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:scale-105 hover:shadow-lg transition"
                    @click="selectAccount(acc)"
                >
                    Open Chat
                </button>
            </li>
        </ul>
        <div class="flex flex-col sm:flex-row gap-2 mb-4 justify-center">
            <button
                class="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg font-semibold hover:scale-105 hover:shadow transition"
                @click="showAdd = true"
            >
                <i class="mdi mdi-phone mr-2"></i>Add Phone Account
            </button>
            <button
                class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg font-semibold hover:scale-105 hover:shadow transition"
                @click="showQR = true"
            >
                <i class="mdi mdi-qrcode mr-2"></i>Add QR Account
            </button>
        </div>

        <AddTelegramAccount
            v-if="showAdd"
            @added="refresh"
            @close="showAdd = false"
        />
        <QRLogin v-if="showQR" @added="refresh" @close="showQR = false" />
        <ChatWindow v-if="selectedAccount" :account="selectedAccount" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AddTelegramAccount from './AddTelegramAccount.vue';
import QRLogin from './QRLogin.vue';
import ChatWindow from './ChatWindow.vue';
import { api } from '../api.js';
const accounts = ref([]);
const showAdd = ref(false);
const showQR = ref(false);
const selectedAccount = ref(null);
async function refresh() {
    const res = await api.get('/telegram-accounts');
    accounts.value = res.data.data;
}
function selectAccount(acc) {
    selectedAccount.value = acc;
}
onMounted(refresh);
</script>
<!-- Commit 21: 2024-08-16T19:21:13 -->
<!-- Commit 138: 2025-05-17T14:34:28 -->
