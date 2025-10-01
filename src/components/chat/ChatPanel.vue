<template>
    <div
        v-if="chatId"
        class="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen"
    >
        <!-- Chat Header -->
        <div
            class="flex items-center justify-between p-4 border-b bg-white/90 backdrop-bl-md sticky top-0 z-10 shadow"
        >
            <div class="flex items-center gap-3">
                <div class="relative">
                    <img
                        :src="
                            user.avatarType === 'base64'
                                ? `data:image/jpeg;base64,${user.avatar}`
                                : user.avatar
                        "
                        class="w-12 h-12 rounded-full border-2 border-blue-100 object-cover"
                        alt="Avatar"
                    />
                    <span
                        v-if="user.is_online"
                        class="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow"
                        title="Online"
                    ></span>
                </div>
                <div>
                    <div
                        class="font-semibold text-base md:text-lg text-gray-800"
                    >
                        {{ user ? user.name : 'User Name' }}
                    </div>
                    <div class="text-xs text-gray-500 flex items-center gap-1">
                        {{ user.last_seen }}
                    </div>
                </div>
            </div>
            <button
                class="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="More options"
            >
                <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    class="text-gray-500"
                >
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                </svg>
            </button>
        </div>
        <!-- Chat Messages -->
        <div
            ref="messagesContainer"
            class="flex-1 overflow-y-auto px-2 py-2 sm:px-4 sm:py-4 md:px-8 space-y-4 sm:space-y-6 bg-transparent scroll-smooth"
        >
            <div
                v-for="msg in messages"
                :key="msg.id"
                class="space-y-2 flex flex-col"
                :class="msg.fromMe ? 'items-end' : 'items-start'"
            >
                <div class="text-xs text-gray-400 px-2">{{ msg.time }}</div>
                <div
                    :class="[
                        'p-3 rounded-2xl shadow max-w-[80vw] sm:max-w-[60vw] md:max-w-lg break-words',
                        msg.fromMe
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : 'bg-white rounded-bl-md border border-gray-100',
                    ]"
                >
                    <span v-html="msg.text"></span>
                </div>
                <!-- Attachments -->
                <div
                    v-if="msg.attachment"
                    class="flex items-center space-x-2 ml-2 bg-white/90 rounded-lg p-2 shadow border border-gray-100"
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                        class="w-8 h-8"
                        alt="Attachment"
                    />
                    <div>
                        <div class="font-semibold text-sm">
                            {{ msg.attachment.name }}
                        </div>
                        <div class="text-xs text-gray-500">
                            {{ msg.attachment.pages }} pages •
                            {{ msg.attachment.type }}
                        </div>
                    </div>
                    <a
                        class="ml-2 text-blue-500 hover:underline"
                        :href="msg.attachment.link"
                        download
                    >
                        ⬇️
                    </a>
                </div>
            </div>
        </div>
        <!-- Chat Input -->
        <div
            class="p-2 sm:p-3 md:p-4 bg-white/95 border-t flex items-center gap-2 sticky z-10 backdrop-blur-md"
        >
            <!-- Emoji Button -->
            <div class="relative">
                <button
                    class="p-2 rounded-full hover:bg-gray-100 transition"
                    title="Add emoji"
                    type="button"
                    @click="showEmojiPicker = !showEmojiPicker"
                    aria-label="Add emoji"
                >
                    <span class="text-xl">😊</span>
                </button>
                <div
                    v-if="showEmojiPicker"
                    class="absolute bottom-12 left-0 z-20 bg-white rounded-lg shadow-lg p-2"
                    @mousedown.stop
                >
                    <EmojiPicker @select="onEmojiSelect" />
                </div>
            </div>

            <!-- Attachment Button -->
            <label
                class="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                title="Attach file"
                aria-label="Attach file"
            >
                <input type="file" class="hidden" @change="onFileChange" />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-6 h-6 text-gray-500"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.07-7.07a4 4 0 00-5.656-5.657l-7.071 7.07a6 6 0 108.485 8.486l6.364-6.364"
                    />
                </svg>
            </label>
            <input
                v-model="input"
                type="text"
                placeholder="Type your message"
                class="flex-1 px-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-300 transition text-sm md:text-base"
                @keyup.enter="sendMessage"
                aria-label="Type your message"
                autocomplete="off"
            />
            <button
                @click="sendMessage"
                :disabled="!input.trim()"
                class="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-full shadow hover:from-blue-600 hover:to-indigo-600 transition font-semibold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Send
            </button>
        </div>
    </div>
    <div
        v-else
        class="flex-1 flex items-center justify-center bg-white min-h-screen"
    >
        <div class="text-center px-4">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-20 w-20 mb-4 text-gray-300 mx-auto"
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
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
                {{ $t('chat.select_conversation') }}
            </h2>
            <p class="text-gray-600">
                {{ $t('chat.select_conversation_description') }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    chatId: {
        type: [String, Number],
        default: null,
    },
    user: {
        type: Object,
        default: null,
    },
    chatAccountUser: {
        type: Object,
        default: null,
    },
});

const input = ref('');
const messages = ref([]);
const showEmojiPicker = ref(false);
const messagesContainer = ref(null);

function onEmojiSelect(emoji) {
    input.value += emoji.i;
    showEmojiPicker.value = false;
}

async function sendMessage() {
    if (props.chatAccountUser && props.chatAccountUser.id) {
        if (input.value.trim()) {
            await api
                .post('/chats/' + props.chatId + '/send/', {
                    text: input.value,
                    session_file: props.chatAccountUser.session_file,
                })
                .then(() => {
                    input.value = '';
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                });
        }
    }
}

function onFileChange(e) {
    const file = e.target.files[0];
    if (file) {
        // You can implement file upload logic here
        // For better UX, show a loader or preview
        // Example: show a toast "Uploading file..."
    }
}

import api from '../../api';
import { onUnmounted, inject } from 'vue';

let chatSocket = null;
const socketUrl = inject('socketUrl', 'ws://localhost:8000/ws/');

function setupWebSocket() {
    if (props.chatAccountUser && props.chatAccountUser.id) {
        chatSocket = new WebSocket(`${socketUrl}telegram-messages/`);
        chatSocket.onopen = () => {
            const payload = {
                session_file: props.chatAccountUser.session_file,
                chat_id: props.chatId,
                direction: 'new',
                limit: 10,
                type: 'messageSync',
            };
            chatSocket.send(JSON.stringify(payload));
        };
        chatSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.status === 'messageSync') {
                fetchChat();
            }
        };
    }
}

onUnmounted(() => {
    if (chatSocket) {
        chatSocket.close();
        chatSocket = null;
    }
});

async function fetchChat() {
    try {
        const response = await api.post(
            '/chats/' + props.chatId + '/messages/',
        );
        if (response && response.data) {
            const newMessages = response.data.results
                .map((message) => ({
                    id: message.id,
                    fromMe: message.chat_id != message.sender_id,
                    text: message.text,
                    time: message.date
                        ? new Date(message.date).toLocaleString()
                        : '',
                    attachment: message.attachment,
                }))
                .reverse();
            // Only scroll if messages changed
            const isSame =
                messages.value.length === newMessages.length &&
                messages.value.every(
                    (msg, idx) => msg.id === newMessages[idx].id,
                );
            messages.value = newMessages;
            if (!isSame) {
                await nextTick();
                if (messagesContainer.value) {
                    messagesContainer.value.scrollTop =
                        messagesContainer.value.scrollHeight;
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}

watch(
    () => props.chatId,
    (newId) => {
        if (newId) {
            if (chatSocket) {
                chatSocket.close();
                chatSocket = null;
            }
            fetchChat();
            setupWebSocket();
        } else {
            messages.value = [];
            if (chatSocket) {
                chatSocket.close();
                chatSocket = null;
            }
        }
    },
    { immediate: true },
);

watch(
    () => messages.value,
    async () => {
        await nextTick();
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop =
                messagesContainer.value.scrollHeight;
        }
    },
    { deep: true },
);
</script>

<style scoped>
.flex-1::-webkit-scrollbar {
    display: none;
}
.flex-1 {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
input[type='text']:focus {
    outline: none;
}
</style>
