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
                        <!-- Real-time connection status -->
                        <span class="mx-2">•</span>
                        <div class="flex items-center gap-1">
                            <div
                                class="w-2 h-2 rounded-full"
                                :class="{
                                    'bg-green-500':
                                        connectionStatus === 'connected' &&
                                        isMonitoring,
                                    'bg-yellow-500':
                                        connectionStatus === 'connecting',
                                    'bg-red-500':
                                        connectionStatus === 'error' ||
                                        connectionStatus === 'disconnected',
                                    'bg-gray-400': !isMonitoring,
                                }"
                                :title="getConnectionStatusText()"
                            ></div>
                            <span class="text-xs">
                                {{ getConnectionStatusText() }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <!-- Mark all as read button -->
                <button
                    @click="markMessagesAsRead"
                    class="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                    title="Mark all messages as read"
                >
                    Mark Read
                </button>

                <!-- Test WebSocket button (for debugging) -->
                <button
                    @click="testWebSocketConnection"
                    class="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition"
                    title="Test WebSocket connection"
                >
                    Test WS
                </button>
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
                :data-message-id="msg.id"
                :data-from-me="msg.fromMe"
                :ref="(el) => el && observeMessage(el)"
            >
                <div class="text-xs text-gray-400 px-2">{{ msg.time }}</div>
                <div
                    :class="[
                        'p-3 rounded-2xl shadow max-w-[80vw] sm:max-w-[60vw] md:max-w-lg break-words relative cursor-pointer',
                        msg.fromMe
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : 'bg-white rounded-bl-md border border-gray-100',
                        msg.status === 'sending' ? 'opacity-70' : '',
                        msg.status === 'failed'
                            ? 'bg-red-100 border-red-300'
                            : '',
                    ]"
                    @click="
                        !msg.fromMe &&
                            !msg.isRead &&
                            markSpecificMessageAsRead(msg.id)
                    "
                >
                    <!-- Unread indicator dot -->

                    <span v-html="msg.text"></span>

                    <!-- Message status indicators -->
                    <div
                        v-if="msg.fromMe"
                        class="flex items-center justify-end mt-1 gap-1"
                    >
                        <!-- Edited indicator -->
                        <span v-if="msg.isEdited" class="text-xs opacity-70">
                            edited
                        </span>

                        <!-- Status indicator -->
                        <div class="text-xs opacity-70">
                            <span v-if="msg.status === 'sending'">⏳</span>
                            <span
                                v-else-if="msg.status === 'failed'"
                                class="text-red-300"
                                >❌</span
                            >
                            <span v-else-if="msg.status === 'delivered'"
                                >✓</span
                            >
                            <span
                                v-else-if="msg.status === 'read'"
                                class="text-blue-300"
                                >✓✓</span
                            >
                            <span v-else-if="msg.status === 'sent'">✓</span>
                        </div>
                    </div>

                    <!-- Edited indicator for received messages -->
                    <div
                        v-if="!msg.fromMe && msg.isEdited"
                        class="text-xs text-gray-400 mt-1"
                    >
                        edited
                    </div>
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
        class="flex-1 flex items-center justify-center bg-white min-h-screen border border-gray-200"
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
const isMonitoring = ref(false);
const connectionStatus = ref('disconnected');

function onEmojiSelect(emoji) {
    input.value += emoji.i;
    showEmojiPicker.value = false;
}

async function sendMessage() {
    if (
        props.chatAccountUser &&
        props.chatAccountUser.id &&
        input.value.trim() &&
        realtimeSocket &&
        realtimeSocket.readyState === WebSocket.OPEN
    ) {
        const messageText = input.value.trim();
        const tempId = Date.now(); // Temporary ID for optimistic UI

        // Add message optimistically to UI
        const optimisticMessage = {
            id: tempId,
            fromMe: true,
            text: messageText,
            time: new Date().toLocaleString(),
            attachment: null,
            isOptimistic: true, // Mark as optimistic
            status: 'sending',
        };

        messages.value.push(optimisticMessage);
        input.value = '';

        // Scroll to bottom
        await nextTick();
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop =
                messagesContainer.value.scrollHeight;
        }

        try {
            // Send message through WebSocket instead of API
            const messageData = {
                type: 'send_message',
                chat_id: parseInt(props.chatId),
                text: messageText,
                session_file: props.chatAccountUser.session_file,
                temp_id: tempId, // Include temp ID for response matching
            };

            realtimeSocket.send(JSON.stringify(messageData));

            console.log('Message sent via WebSocket:', messageData);
        } catch (error) {
            console.error('Error sending message via WebSocket:', error);

            // Mark message as failed
            const messageIndex = messages.value.findIndex(
                (msg) => msg.id === tempId,
            );
            if (messageIndex !== -1) {
                messages.value[messageIndex] = {
                    ...messages.value[messageIndex],
                    status: 'failed',
                    isOptimistic: false,
                };
            }
        }
    } else {
        // Fallback to API if WebSocket is not available
        console.warn('WebSocket not connected, falling back to API...');
        await sendMessageViaAPI();
    }
}

// Fallback function to send via API
async function sendMessageViaAPI() {
    if (
        props.chatAccountUser &&
        props.chatAccountUser.id &&
        input.value.trim()
    ) {
        const messageText = input.value.trim();
        const tempId = Date.now();

        // Add message optimistically to UI
        const optimisticMessage = {
            id: tempId,
            fromMe: true,
            text: messageText,
            time: new Date().toLocaleString(),
            attachment: null,
            isOptimistic: true,
            status: 'sending',
        };

        messages.value.push(optimisticMessage);
        input.value = '';

        // Scroll to bottom
        await nextTick();
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop =
                messagesContainer.value.scrollHeight;
        }

        try {
            const response = await api.post(
                '/chats/' + props.chatId + '/send/',
                {
                    text: messageText,
                    session_file: props.chatAccountUser.session_file,
                },
            );

            // Update optimistic message with real data
            const messageIndex = messages.value.findIndex(
                (msg) => msg.id === tempId,
            );
            if (messageIndex !== -1) {
                messages.value[messageIndex] = {
                    ...messages.value[messageIndex],
                    id: response.data.message_id || tempId,
                    status: 'sent',
                    isOptimistic: false,
                };
            }
        } catch (error) {
            console.error('Error sending message via API:', error);

            // Mark message as failed
            const messageIndex = messages.value.findIndex(
                (msg) => msg.id === tempId,
            );
            if (messageIndex !== -1) {
                messages.value[messageIndex] = {
                    ...messages.value[messageIndex],
                    status: 'failed',
                    isOptimistic: false,
                };
            }
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

function getConnectionStatusText() {
    if (connectionStatus.value === 'connected' && isMonitoring.value) {
        return 'Live';
    } else if (connectionStatus.value === 'connecting') {
        return 'Connecting...';
    } else if (connectionStatus.value === 'error') {
        return 'Error';
    } else if (connectionStatus.value === 'disconnected') {
        return 'Offline';
    } else if (!isMonitoring.value) {
        return 'Not monitoring';
    }
    return 'Unknown';
}

import { api, socketApi } from '../../api';

import { onUnmounted, inject, onMounted } from 'vue';

let realtimeSocket = null;
const socketUrl = inject('socketUrl', 'ws://localhost:8000/ws/');

function setupRealtimeWebSocket() {
    if (realtimeSocket) {
        realtimeSocket.close();
    }

    connectionStatus.value = 'connecting';
    realtimeSocket = new WebSocket(`${socketUrl}messages`);

    realtimeSocket.onopen = () => {
        connectionStatus.value = 'connected';
        console.log('Real-time WebSocket connected');

        // Send initial connection confirmation
        realtimeSocket.send(
            JSON.stringify({
                type: 'ping',
            }),
        );
    };

    realtimeSocket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Real-time message received:', data);

            if (data.type === 'new_message') {
                handleNewMessage(data);
            } else if (data.type === 'message_edited') {
                handleEditedMessage(data);
            } else if (data.type === 'message_sent') {
                handleMessageSent(data);
            } else if (data.type === 'message_send_error') {
                handleMessageSendError(data);
            } else if (data.type === 'message_read_update') {
                handleMessageReadStatusUpdate(data);
            } else if (data.type === 'messages_marked_read') {
                handleAllMessagesReadUpdate(data);
            } else if (data.type === 'read_update_success') {
                handleReadUpdateSuccess(data);
            } else if (data.type === 'read_update_error') {
                handleReadUpdateError(data);
            } else if (data.type === 'pong') {
                console.log('WebSocket ping/pong successful');
            } else if (data.type === 'connection_established') {
                console.log('WebSocket connection established:', data.message);
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    };

    realtimeSocket.onclose = () => {
        connectionStatus.value = 'disconnected';
        console.log('Real-time WebSocket disconnected');

        // Auto-reconnect after 3 seconds
        setTimeout(() => {
            if (props.chatId && props.chatAccountUser) {
                setupRealtimeWebSocket();
            }
        }, 3000);
    };

    realtimeSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        connectionStatus.value = 'error';
    };
}

function handleNewMessage(data) {
    // Only handle messages for the current chat
    if (data.chat_id == props.chatId) {
        const newMessage = {
            id: data.message_id,
            fromMe: data.sender.id == props.chatAccountUser?.id,
            text: data.text || '',
            time: data.date
                ? new Date(data.date).toLocaleString()
                : new Date().toLocaleString(),
            attachment: null, // Handle attachments if needed
            isNew: true, // Mark as new for scrolling
            isRead: false, // New messages start as unread
            status:
                data.sender.id == props.chatAccountUser?.id
                    ? 'sent'
                    : 'received',
        };

        // Check if message already exists to avoid duplicates
        const existingMessage = messages.value.find(
            (msg) => msg.id === newMessage.id,
        );
        if (!existingMessage) {
            messages.value.push(newMessage);

            // Scroll to bottom for new messages
            nextTick(() => {
                if (messagesContainer.value) {
                    messagesContainer.value.scrollTop =
                        messagesContainer.value.scrollHeight;
                }
            });
        }
    }
}

function handleEditedMessage(data) {
    // Only handle messages for the current chat
    if (data.chat_id == props.chatId) {
        const messageIndex = messages.value.findIndex(
            (msg) => msg.id === data.message_id,
        );
        if (messageIndex !== -1) {
            // Update the existing message
            messages.value[messageIndex] = {
                ...messages.value[messageIndex],
                text: data.text || '',
                time: data.date
                    ? new Date(data.date).toLocaleString()
                    : messages.value[messageIndex].time,
                isEdited: true,
            };
        }
    }
}

function handleMessageSent(data) {
    // Handle successful message send confirmation
    if (data.chat_id == props.chatId && data.temp_id) {
        const messageIndex = messages.value.findIndex(
            (msg) => msg.id === data.temp_id && msg.isOptimistic,
        );
        if (messageIndex !== -1) {
            // Update optimistic message with real data
            messages.value[messageIndex] = {
                ...messages.value[messageIndex],
                id: data.message_id || data.temp_id,
                status: 'sent',
                isOptimistic: false,
                time: data.date
                    ? new Date(data.date).toLocaleString()
                    : messages.value[messageIndex].time,
            };
            console.log('Message send confirmed:', data);
        }
    }
}

function handleMessageSendError(data) {
    // Handle message send error
    if (data.chat_id == props.chatId && data.temp_id) {
        const messageIndex = messages.value.findIndex(
            (msg) => msg.id === data.temp_id && msg.isOptimistic,
        );
        if (messageIndex !== -1) {
            // Mark message as failed
            messages.value[messageIndex] = {
                ...messages.value[messageIndex],
                status: 'failed',
                isOptimistic: false,
            };
            console.error('Message send failed:', data.error);
        }
    }
}

async function startMonitoring() {
    if (!props.chatAccountUser?.session_file) {
        console.error('No session file available for monitoring');
        return;
    }

    try {
        const response = await socketApi.post('/realtime/start-monitoring/', {
            session_file: props.chatAccountUser.session_file,
            chat_ids: props.chatId ? [parseInt(props.chatId)] : null,
        });

        if (response.data.status === 'success') {
            isMonitoring.value = true;
            console.log('Started monitoring:', response.data);
        }
    } catch (error) {
        console.error('Error starting monitoring:', error);
    }
}

async function stopMonitoring() {
    if (!props.chatAccountUser?.session_file) return;

    try {
        await socketApi.post('/realtime/stop-monitoring/', {
            session_file: props.chatAccountUser.session_file,
        });

        isMonitoring.value = false;
        console.log('Stopped monitoring');
    } catch (error) {
        console.error('Error stopping monitoring:', error);
    }
}

onMounted(() => {
    // Initialize WebSocket connection when component mounts
    setupRealtimeWebSocket();

    // Setup message read observer
    setupMessageReadObserver();
});

onUnmounted(() => {
    // Clean up when component unmounts
    if (realtimeSocket) {
        realtimeSocket.close();
        realtimeSocket = null;
    }

    // Stop monitoring when leaving the chat
    if (isMonitoring.value) {
        stopMonitoring();
    }

    // Cleanup message observer
    unobserveAllMessages();
});

async function fetchChat() {
    try {
        const response = await api.post(
            '/chats/' + props.chatId + '/messages/',
        );
        if (response && response.data) {
            messages.value = response.data.results
                .map((message) => {
                    const isFromMe = message.chat_id != message.sender_id;
                    return {
                        id: message.id,
                        fromMe: isFromMe,
                        text: message.text,
                        time: message.date
                            ? new Date(message.date).toLocaleString()
                            : '',
                        attachment: message.attachment,
                        isRead: message.is_read || false,
                        status: isFromMe
                            ? message.is_read
                                ? 'read'
                                : 'delivered'
                            : 'received',
                    };
                })
                .reverse();
            // Scroll to bottom only if the latest message is upcoming (new)
            await nextTick();
            if (messagesContainer.value && messages.value.length) {
                const lastMsg = messages.value[messages.value.length - 1];
                // Example: if lastMsg.fromMe or lastMsg.isNew, scroll to bottom
                if (lastMsg.fromMe || lastMsg.isNew) {
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
    async (newId, oldId) => {
        if (newId) {
            // Stop monitoring for the previous chat
            if (oldId && isMonitoring.value) {
                await stopMonitoring();
            }

            // Load messages for the new chat
            await fetchChat();

            // Start monitoring for the new chat
            if (props.chatAccountUser?.session_file) {
                await startMonitoring();
            }
        } else {
            // Clear messages when no chat is selected
            messages.value = [];

            // Stop monitoring
            if (isMonitoring.value) {
                await stopMonitoring();
            }
        }
    },
    { immediate: true },
);

// Watch for changes in chat account user
watch(
    () => props.chatAccountUser,
    async (newUser, oldUser) => {
        if (newUser && newUser !== oldUser) {
            // Restart monitoring with new user session
            if (isMonitoring.value) {
                await stopMonitoring();
            }

            if (props.chatId) {
                await startMonitoring();
            }
        }
    },
);

// Read/Unread Control Functions
async function markMessagesAsRead() {
    if (!props.chatId || !props.chatAccountUser?.session_file) return;

    try {
        // Mark messages as read via WebSocket
        if (realtimeSocket && realtimeSocket.readyState === WebSocket.OPEN) {
            realtimeSocket.send(
                JSON.stringify({
                    type: 'mark_messages_read',
                    chat_id: parseInt(props.chatId),
                    session_file: props.chatAccountUser.session_file,
                }),
            );
        } else {
            // Fallback to API
            await api.post(`/chats/${props.chatId}/mark-read/`, {
                session_file: props.chatAccountUser.session_file,
            });
        }

        console.log('Messages marked as read for chat:', props.chatId);
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
}

async function markSpecificMessageAsRead(messageId) {
    if (!props.chatId || !props.chatAccountUser?.session_file || !messageId)
        return;

    try {
        // Mark specific message as read via WebSocket
        if (realtimeSocket && realtimeSocket.readyState === WebSocket.OPEN) {
            realtimeSocket.send(
                JSON.stringify({
                    type: 'mark_message_read',
                    chat_id: parseInt(props.chatId),
                    message_id: messageId,
                    session_file: props.chatAccountUser.session_file,
                }),
            );
        } else {
            // Fallback to API
            await api.post(
                `/chats/${props.chatId}/messages/${messageId}/mark-read/`,
                {
                    session_file: props.chatAccountUser.session_file,
                },
            );
        }

        // Update message status locally
        const messageIndex = messages.value.findIndex(
            (msg) => msg.id === messageId,
        );
        if (messageIndex !== -1 && !messages.value[messageIndex].fromMe) {
            messages.value[messageIndex].isRead = true;
        }
    } catch (error) {
        console.error('Error marking message as read:', error);
    }
}

function handleMessageReadStatusUpdate(data) {
    // Handle read status updates from WebSocket
    if (data.chat_id == props.chatId) {
        if (data.message_ids && Array.isArray(data.message_ids)) {
            // Update multiple messages
            data.message_ids.forEach((messageId) => {
                const messageIndex = messages.value.findIndex(
                    (msg) => msg.id === messageId,
                );
                if (messageIndex !== -1) {
                    messages.value[messageIndex].status = data.status || 'read';
                    messages.value[messageIndex].isRead = true;
                }
            });
        } else if (data.message_id) {
            // Update single message
            const messageIndex = messages.value.findIndex(
                (msg) => msg.id === data.message_id,
            );
            if (messageIndex !== -1) {
                messages.value[messageIndex].status = data.status || 'read';
                messages.value[messageIndex].isRead = true;
            }
        }
    }
}

function handleAllMessagesReadUpdate(data) {
    // Handle bulk read status update for all messages in chat
    if (data.chat_id == props.chatId) {
        messages.value.forEach((message, index) => {
            if (!message.fromMe) {
                messages.value[index].isRead = true;
                messages.value[index].status = 'read';
            }
        });
        console.log('All messages marked as read for chat:', data.chat_id);
    }
}

function handleReadUpdateSuccess(data) {
    // Handle successful read update confirmation
    console.log('Read update successful:', data);

    if (data.chat_id == props.chatId) {
        if (data.action === 'mark_all_read') {
            // All messages marked as read
            messages.value.forEach((message, index) => {
                if (!message.fromMe) {
                    messages.value[index].isRead = true;
                    messages.value[index].status = 'read';
                }
            });
        } else if (data.action === 'mark_message_read' && data.message_id) {
            // Specific message marked as read
            const messageIndex = messages.value.findIndex(
                (msg) => msg.id === data.message_id,
            );
            if (messageIndex !== -1) {
                messages.value[messageIndex].isRead = true;
                messages.value[messageIndex].status = 'read';
            }
        }
    }
}

function handleReadUpdateError(data) {
    // Handle read update errors
    console.error('Read update error:', data.error);

    // You could show a toast notification here
    // toast.error(`Failed to mark message as read: ${data.error}`);
}

// Test WebSocket functionality
function testWebSocketConnection() {
    if (realtimeSocket && realtimeSocket.readyState === WebSocket.OPEN) {
        console.log('WebSocket is connected, sending test ping...');
        realtimeSocket.send(
            JSON.stringify({
                type: 'ping',
            }),
        );
    } else {
        console.log('WebSocket connection status:', realtimeSocket?.readyState);
        console.log(
            'Connection states - CONNECTING:',
            WebSocket.CONNECTING,
            'OPEN:',
            WebSocket.OPEN,
            'CLOSING:',
            WebSocket.CLOSING,
            'CLOSED:',
            WebSocket.CLOSED,
        );
    }
}

// Intersection Observer for automatic read marking
const messageObserver = ref(null);

function setupMessageReadObserver() {
    if (!window.IntersectionObserver) return;

    const readTimeouts = new Map();

    messageObserver.value = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const messageId = entry.target.dataset.messageId;
                const isFromMe = entry.target.dataset.fromMe === 'true';

                if (entry.isIntersecting) {
                    // Only mark incoming messages as read
                    if (messageId && !isFromMe) {
                        // Clear any existing timeout for this message
                        if (readTimeouts.has(messageId)) {
                            clearTimeout(readTimeouts.get(messageId));
                        }

                        // Set new timeout for read marking
                        const timeoutId = setTimeout(() => {
                            if (entry.isIntersecting) {
                                const message = messages.value.find(
                                    (msg) => msg.id == messageId,
                                );
                                if (message && !message.isRead) {
                                    markSpecificMessageAsRead(
                                        parseInt(messageId),
                                    );
                                }
                            }
                            readTimeouts.delete(messageId);
                        }, 1000); // Mark as read after 1 second of visibility

                        readTimeouts.set(messageId, timeoutId);
                    }
                } else {
                    // Clear timeout when message goes out of view
                    if (readTimeouts.has(messageId)) {
                        clearTimeout(readTimeouts.get(messageId));
                        readTimeouts.delete(messageId);
                    }
                }
            });
        },
        {
            threshold: 0.5, // Message must be 50% visible
            rootMargin: '0px',
        },
    );
}

function observeMessage(messageElement) {
    if (messageObserver.value && messageElement) {
        messageObserver.value.observe(messageElement);
    }
}

function unobserveAllMessages() {
    if (messageObserver.value) {
        messageObserver.value.disconnect();
    }
}

watch(messages, async () => {
    await nextTick();
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop =
            messagesContainer.value.scrollHeight;
    }
});
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
