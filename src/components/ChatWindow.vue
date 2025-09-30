<template>
    <div class="mt-6 mb-6 max-w-2xl mx-auto p-4 bg-white rounded-2xl shadow-lg">
        <h3 class="font-bold text-lg mb-2 text-blue-700">
            Chat as
            <span class="text-gray-800">{{
                account.phone || account.username
            }}</span>
        </h3>
        <div class="flex flex-col sm:flex-row gap-2 mb-4">
            <input
                v-model="chatId"
                placeholder="Chat ID"
                class="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-200"
            />
            <button
                class="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:scale-105 transition"
                @click="refresh"
            >
                Show Messages
            </button>
        </div>
        <div class="flex items-end gap-2 mb-3">
            <textarea
                v-model="message"
                placeholder="Type message..."
                class="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-200"
                rows="2"
            ></textarea>
            <button
                class="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg px-6 py-2 font-bold hover:scale-105 transition"
                @click="send"
            >
                Send
            </button>
        </div>
        <div v-if="sent" class="text-green-700 mb-2 animate-bounce">Sent!</div>
        <div class="mt-6 max-h-80 overflow-y-auto">
            <h4 class="font-semibold mb-2 text-gray-700">Last 50 messages:</h4>
            <div v-for="msg in messages" :key="msg.id" class="flex mb-3">
                <div
                    :class="
                        msg.is_outgoing
                            ? 'ml-auto bg-blue-100 border border-blue-300 text-right rounded-l-2xl rounded-br-2xl px-4 py-2 max-w-xs'
                            : 'mr-auto bg-gray-100 border border-gray-300 text-left rounded-r-2xl rounded-bl-2xl px-4 py-2 max-w-xs'
                    "
                >
                    <div class="text-xs text-gray-400 mb-1">
                        [{{ msg.date }}] {{ msg.is_outgoing ? 'You' : 'From' }}
                    </div>
                    <div class="text-base text-gray-800 break-words">
                        {{ msg.message }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import api from '../api.js';

const props = defineProps(['account']);
const chatId = ref('');
const message = ref('');
const sent = ref(false);
const messages = ref([]);
function send() {
    api.post('/telegram-accounts/send-message', {
        telegram_account_id: props.account.id,
        chat_id: chatId.value,
        message: message.value,
    }).then(() => {
        sent.value = true;
        setTimeout(() => (sent.value = false), 1000);
        message.value = '';
        refresh();
    });
}
function refresh() {
    api.get('/telegram-accounts/messages', {
        params: { telegram_account_id: props.account.id },
    }).then((res) => {
        messages.value = res.data;
    });
}
watch(
    () => props.account,
    () => {
        refresh();
    },
);
</script>
