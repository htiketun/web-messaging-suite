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
                        <span class="mx-2">•</span>
                        <span>{{ messages.length }} messages</span>
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
                <!-- Saved messages button -->
                <button
                    @click="showSavedMessages = !showSavedMessages"
                    :class="[
                        'px-3 py-1 text-xs rounded-full transition flex items-center gap-1',
                        showSavedMessages
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600',
                    ]"
                    :title="
                        showSavedMessages
                            ? 'Hide saved messages'
                            : 'Show saved messages'
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3"
                        :fill="showSavedMessages ? 'currentColor' : 'none'"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                    </svg>
                    Saved ({{ getSavedMessagesForCurrentChat().length }})
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

        <!-- Saved Messages Panel -->
        <div
            v-if="showSavedMessages"
            class="bg-yellow-50 border-b border-yellow-200 max-h-64 overflow-y-auto"
        >
            <div class="p-3">
                <div class="flex items-center justify-between mb-3">
                    <h3
                        class="text-sm font-semibold text-yellow-800 flex items-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                        </svg>
                        Saved Messages ({{
                            getSavedMessagesForCurrentChat().length
                        }})
                    </h3>
                    <div class="flex items-center gap-2">
                        <!-- Export button -->
                        <button
                            v-if="savedMessages.length > 0"
                            @click="exportSavedMessages"
                            class="text-xs text-blue-600 hover:text-blue-800 underline"
                            title="Export all saved messages"
                        >
                            Export
                        </button>

                        <!-- Import button -->
                        <label
                            class="text-xs text-green-600 hover:text-green-800 underline cursor-pointer"
                            title="Import saved messages"
                        >
                            <input
                                type="file"
                                accept=".json"
                                @change="importSavedMessages"
                                class="hidden"
                            />
                            Import
                        </label>

                        <!-- Clear button -->
                        <button
                            v-if="getSavedMessagesForCurrentChat().length > 0"
                            @click="clearSavedMessagesForCurrentChat"
                            class="text-xs text-red-600 hover:text-red-800 underline"
                            title="Clear all saved messages for this chat"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                <!-- Search input -->
                <div
                    v-if="
                        savedMessages.filter(
                            (msg) => msg.chatId == props.chatId,
                        ).length > 0
                    "
                    class="mb-3"
                >
                    <input
                        v-model="savedMessagesSearch"
                        type="text"
                        placeholder="Search saved messages..."
                        class="w-full px-3 py-2 text-xs border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                </div>

                <div
                    v-if="
                        savedMessages.filter(
                            (msg) => msg.chatId == props.chatId,
                        ).length === 0
                    "
                    class="text-xs text-yellow-600 text-center py-4"
                >
                    No saved messages yet. Hover over messages and click the
                    bookmark icon to save them.
                </div>

                <div
                    v-else-if="
                        getSavedMessagesForCurrentChat().length === 0 &&
                        savedMessagesSearch.trim()
                    "
                    class="text-xs text-yellow-600 text-center py-4"
                >
                    No saved messages match your search "{{
                        savedMessagesSearch
                    }}".
                </div>

                <div v-else class="space-y-2">
                    <div
                        v-for="savedMsg in getSavedMessagesForCurrentChat()"
                        :key="savedMsg.id"
                        class="bg-white rounded-lg p-2 shadow-sm border border-yellow-200"
                    >
                        <div class="flex items-start justify-between gap-2">
                            <div class="flex-1 min-w-0">
                                <div class="text-xs text-gray-500 mb-1">
                                    {{
                                        savedMsg.fromMe
                                            ? 'You'
                                            : savedMsg.chatName
                                    }}
                                    •
                                    {{
                                        new Date(
                                            savedMsg.savedAt,
                                        ).toLocaleString()
                                    }}
                                </div>
                                <div
                                    class="text-sm text-gray-800 break-words"
                                    v-html="savedMsg.text"
                                ></div>
                            </div>
                            <button
                                @click="
                                    unsaveMessage(savedMsg.originalMessageId)
                                "
                                class="flex-shrink-0 text-red-500 hover:text-red-700 p-1"
                                title="Remove from saved messages"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chat Messages -->
        <div
            ref="messagesContainer"
            class="flex-1 overflow-y-auto px-2 py-2 sm:px-4 sm:py-4 md:px-8 space-y-4 sm:space-y-6 bg-transparent scroll-smooth"
            @scroll="handleScroll"
        >
            <!-- Loading indicator for older messages -->
            <div
                v-if="isLoadingMessages && hasMoreMessages"
                class="flex justify-center py-4"
            >
                <div
                    class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"
                ></div>
            </div>

            <!-- No more messages indicator -->
            <div
                v-if="!hasMoreMessages && messages.length > 0"
                class="flex justify-center py-4"
            >
                <div
                    class="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full"
                >
                    📜 Beginning of conversation
                </div>
            </div>

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
                        'p-3 rounded-2xl shadow max-w-[80vw] sm:max-w-[60vw] md:max-w-lg break-words relative cursor-pointer group',
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
                    <!-- Save/Unsave button -->
                    <button
                        @click.stop="toggleSaveMessage(msg)"
                        :class="[
                            'absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                            isMessageSaved(msg.id)
                                ? 'text-yellow-500'
                                : 'text-gray-400 hover:text-yellow-500',
                        ]"
                        :title="
                            isMessageSaved(msg.id)
                                ? 'Remove from saved messages'
                                : 'Save message'
                        "
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            :fill="
                                isMessageSaved(msg.id) ? 'currentColor' : 'none'
                            "
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                        </svg>
                    </button>

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

            <!-- Scroll to Bottom Button -->
            <button
                v-if="!isAutoScrollEnabled && messages.length > 0"
                @click="scrollToBottom(true)"
                class="fixed bottom-24 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all duration-200 z-20"
                title="Scroll to bottom"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </button>
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
import { ref, watch, nextTick, onMounted, onUnmounted, inject } from 'vue';
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
const isAutoScrollEnabled = ref(true);
const isLoadingMessages = ref(false);
const hasMoreMessages = ref(true);
const savedMessages = ref([]);
const showSavedMessages = ref(false);
const savedMessagesSearch = ref('');

function onEmojiSelect(emoji) {
    input.value += emoji.i;
    showEmojiPicker.value = false;
}

// LocalStorage management for saved messages
function loadSavedMessages() {
    try {
        const saved = localStorage.getItem('savedMessages');
        if (saved) {
            savedMessages.value = JSON.parse(saved);
            console.log(
                `Loaded ${savedMessages.value.length} saved messages from localStorage`,
            );
        } else {
            savedMessages.value = [];
        }
    } catch (error) {
        console.error('Error loading saved messages from localStorage:', error);
        savedMessages.value = [];
    }
}

function saveSavedMessages() {
    try {
        localStorage.setItem(
            'savedMessages',
            JSON.stringify(savedMessages.value),
        );
        console.log(
            `Saved ${savedMessages.value.length} messages to localStorage`,
        );
    } catch (error) {
        console.error('Error saving messages to localStorage:', error);
    }
}

function saveMessage(message) {
    const messageToSave = {
        id: message.id,
        chatId: props.chatId,
        chatName: props.user?.name || 'Unknown User',
        fromMe: message.fromMe,
        text: message.text,
        time: message.time,
        savedAt: new Date().toISOString(),
        originalMessageId: message.id,
    };

    // Check if message is already saved
    const existingIndex = savedMessages.value.findIndex(
        (msg) =>
            msg.originalMessageId === message.id && msg.chatId == props.chatId,
    );

    if (existingIndex === -1) {
        savedMessages.value.unshift(messageToSave); // Add to beginning
        saveSavedMessages();
        console.log('Message saved to localStorage:', messageToSave);
        return true;
    } else {
        console.log('Message already saved');
        return false;
    }
}

function unsaveMessage(messageId) {
    const index = savedMessages.value.findIndex(
        (msg) =>
            msg.originalMessageId === messageId && msg.chatId == props.chatId,
    );

    if (index !== -1) {
        savedMessages.value.splice(index, 1);
        saveSavedMessages();
        console.log('Message removed from saved messages');
        return true;
    }
    return false;
}

function isMessageSaved(messageId) {
    return savedMessages.value.some(
        (msg) =>
            msg.originalMessageId === messageId && msg.chatId == props.chatId,
    );
}

function clearAllSavedMessages() {
    savedMessages.value = [];
    saveSavedMessages();
    console.log('All saved messages cleared');
}

function getSavedMessagesForCurrentChat() {
    let filtered = savedMessages.value.filter(
        (msg) => msg.chatId == props.chatId,
    );

    if (savedMessagesSearch.value.trim()) {
        const searchTerm = savedMessagesSearch.value.toLowerCase();
        filtered = filtered.filter(
            (msg) =>
                msg.text.toLowerCase().includes(searchTerm) ||
                msg.chatName.toLowerCase().includes(searchTerm),
        );
    }

    return filtered.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
}

function getAllSavedMessages() {
    return savedMessages.value;
}

function toggleSaveMessage(message) {
    if (isMessageSaved(message.id)) {
        unsaveMessage(message.id);
    } else {
        saveMessage(message);
    }
}

function clearSavedMessagesForCurrentChat() {
    if (
        confirm(
            'Are you sure you want to clear all saved messages for this chat?',
        )
    ) {
        savedMessages.value = savedMessages.value.filter(
            (msg) => msg.chatId != props.chatId,
        );
        saveSavedMessages();
        console.log('Cleared saved messages for current chat');
    }
}

function exportSavedMessages() {
    try {
        const dataStr = JSON.stringify(savedMessages.value, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `saved-messages-${
            new Date().toISOString().split('T')[0]
        }.json`;
        link.click();

        URL.revokeObjectURL(url);
        console.log('Saved messages exported successfully');
    } catch (error) {
        console.error('Error exporting saved messages:', error);
    }
}

function importSavedMessages(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedMessages = JSON.parse(e.target.result);
            if (Array.isArray(importedMessages)) {
                // Merge with existing messages, avoiding duplicates
                const existingIds = new Set(
                    savedMessages.value.map(
                        (msg) => `${msg.originalMessageId}-${msg.chatId}`,
                    ),
                );
                const newMessages = importedMessages.filter(
                    (msg) =>
                        !existingIds.has(
                            `${msg.originalMessageId}-${msg.chatId}`,
                        ),
                );

                savedMessages.value = [...savedMessages.value, ...newMessages];
                saveSavedMessages();
                console.log(
                    `Imported ${newMessages.length} new saved messages`,
                );
            } else {
                throw new Error('Invalid file format');
            }
        } catch (error) {
            console.error('Error importing saved messages:', error);
            alert(
                'Error importing saved messages. Please check the file format.',
            );
        }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
}

// Enhanced scroll handling with throttling
let scrollTimeout = null;
function handleScroll() {
    if (!messagesContainer.value) return;

    // Throttle scroll events for better performance
    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
        const container = messagesContainer.value;
        if (!container) return;

        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        // Check if user is near the bottom (within 100px)
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        isAutoScrollEnabled.value = isNearBottom;

        // Load more messages when scrolled to top
        if (
            scrollTop === 0 &&
            hasMoreMessages.value &&
            !isLoadingMessages.value
        ) {
            loadMoreMessages();
        }

        // Check for messages in view and mark as read
        checkMessagesInView();
    }, 100); // Throttle to 100ms
}

// Smooth scroll to bottom
function scrollToBottom(force = false) {
    if (!messagesContainer.value) return;

    if (force || isAutoScrollEnabled.value) {
        nextTick(() => {
            if (messagesContainer.value) {
                messagesContainer.value.scrollTo({
                    top: messagesContainer.value.scrollHeight,
                    behavior: 'smooth',
                });
            }
        });
    }
}

// Get last message from the current messages array
function getLastMessage() {
    if (messages.value.length === 0) return null;
    return messages.value[messages.value.length - 1];
}

// Get message statistics
function getMessageStats() {
    const totalMessages = messages.value.length;
    const unreadMessages = messages.value.filter(
        (msg) => !msg.fromMe && !msg.isRead,
    ).length;
    const lastMessage = getLastMessage();

    return {
        total: totalMessages,
        unread: unreadMessages,
        lastMessage: lastMessage,
        hasMessages: totalMessages > 0,
    };
}

// Mark messages as read when scrolling to them
function checkMessagesInView() {
    if (!messagesContainer.value) return;

    const container = messagesContainer.value;
    const containerRect = container.getBoundingClientRect();

    // Find messages that are currently visible
    const messageElements = container.querySelectorAll('[data-message-id]');
    messageElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible =
            rect.top >= containerRect.top &&
            rect.bottom <= containerRect.bottom;

        if (isVisible) {
            const messageId = element.dataset.messageId;
            const isFromMe = element.dataset.fromMe === 'true';

            if (!isFromMe && messageId) {
                const message = messages.value.find(
                    (msg) => msg.id == messageId,
                );
                if (message && !message.isRead) {
                    markSpecificMessageAsRead(parseInt(messageId));
                }
            }
        }
    });
}

// Load more messages (pagination)
const nextPageUrl = ref(null);

async function loadMoreMessages() {
    if (isLoadingMessages.value || !hasMoreMessages.value) return;

    isLoadingMessages.value = true;
    const currentScrollHeight = messagesContainer.value?.scrollHeight || 0;

    try {
        let apiUrl;

        if (nextPageUrl.value) {
            // Use the next page URL from previous response
            apiUrl = nextPageUrl.value.replace('http://127.0.0.1:8888/api', '');
        } else {
            // First load or fallback
            const page = Math.ceil(messages.value.length / 25) + 1;
            apiUrl = `/chats/${props.chatId}/messages/?page=${page}`;
        }

        const response = await api.get(apiUrl);

        if (response && response.data && response.data.results.length > 0) {
            const newMessages = response.data.results
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
                .reverse(); // Reverse because API returns newest first

            // Prepend new messages to the beginning (older messages)
            messages.value = [...newMessages, ...messages.value];

            // Update pagination info
            nextPageUrl.value = response.data.next;
            hasMoreMessages.value = !!response.data.next;

            // Maintain scroll position
            await nextTick();
            if (messagesContainer.value) {
                const newScrollHeight = messagesContainer.value.scrollHeight;
                messagesContainer.value.scrollTop =
                    newScrollHeight - currentScrollHeight;
            }

            console.log(
                `Loaded ${newMessages.length} older messages. Total: ${messages.value.length}`,
            );
        } else {
            hasMoreMessages.value = false;
        }
    } catch (error) {
        console.error('Error loading more messages:', error);
        hasMoreMessages.value = false;
    } finally {
        isLoadingMessages.value = false;
    }
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

        // Scroll to bottom smoothly
        scrollToBottom(true);

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

        // Scroll to bottom smoothly
        scrollToBottom(true);

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

            // Scroll to bottom for new messages (only if auto-scroll is enabled or it's from me)
            if (newMessage.fromMe || isAutoScrollEnabled.value) {
                scrollToBottom();
            }
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

    // Load saved messages from localStorage
    loadSavedMessages();

    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
});

function handleKeyboardShortcuts(event) {
    // Ctrl+S or Cmd+S to toggle saved messages panel
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        showSavedMessages.value = !showSavedMessages.value;
    }
}

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

    // Remove keyboard shortcuts
    document.removeEventListener('keydown', handleKeyboardShortcuts);
});

async function fetchChat() {
    try {
        isLoadingMessages.value = true;

        // Get the first page of messages (most recent)
        const response = await api.get(
            `/chats/${props.chatId}/messages/?page=1`,
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
                .reverse(); // Reverse to show oldest first (chronological order)

            // Initialize pagination state
            nextPageUrl.value = response.data.next;
            hasMoreMessages.value = !!response.data.next;
            isAutoScrollEnabled.value = true;

            // Always scroll to bottom when loading a new chat
            scrollToBottom(true);

            console.log(
                `Loaded ${messages.value.length} messages for chat ${props.chatId}`,
            );
            console.log(`Has more messages: ${hasMoreMessages.value}`);
            console.log(`Next page URL: ${nextPageUrl.value}`);

            // Log the last message for debugging
            const lastMessage = getLastMessage();
            if (lastMessage) {
                console.log('Last message:', lastMessage);
            }
        }
    } catch (error) {
        console.error('Error fetching chat messages:', error);
    } finally {
        isLoadingMessages.value = false;
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

            // Reset scroll states for new chat
            isAutoScrollEnabled.value = true;
            hasMoreMessages.value = true;
            isLoadingMessages.value = false;
            nextPageUrl.value = null;

            // Load messages for the new chat
            await fetchChat();

            // Start monitoring for the new chat
            if (props.chatAccountUser?.session_file) {
                await startMonitoring();
            }
        } else {
            // Clear messages when no chat is selected
            messages.value = [];
            isAutoScrollEnabled.value = true;
            hasMoreMessages.value = true;
            isLoadingMessages.value = false;
            nextPageUrl.value = null;

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

watch(
    messages,
    () => {
        // Only auto-scroll if we're near the bottom or it's a new message from the current user
        if (isAutoScrollEnabled.value) {
            scrollToBottom();
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
