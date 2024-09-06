<template>
    <div
        class="relative min-h-screen lg:flex bg-gradient-to-br from-blue-50 to-indigo-100"
    >
        <SidebarMenu />

        <main
            id="content"
            class="flex-1 pb-12 space-y-6 overflow-y-auto bg-transparent lg:h-screen md:space-y-8"
        >
            <Header />

            <section
                class="flex flex-col w-full px-6 md:justify-between md:items-center md:flex-row"
            >
                <div>
                    <h2
                        class="text-3xl font-bold text-indigo-800 drop-shadow-sm"
                    >
                        {{ t('saved.title') }}
                    </h2>
                    <p class="mt-2 text-sm text-indigo-600">
                        {{ t('saved.description') }}
                    </p>
                </div>
            </section>
            <section
                class="w-full mx-auto bg-white/90 rounded-2xl shadow-xl p-10 sm:p-6 md:p-8 space-y-6 backdrop-blur-md px-6"
                style="max-width: 90%"
            >
                <div
                    class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2"
                >
                    <h3
                        class="text-xl font-bold text-indigo-700 flex items-center gap-2 mb-2 sm:mb-0"
                    >
                        <svg
                            class="w-6 h-6 text-indigo-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12l2 2l4 -4"
                            />
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                            />
                        </svg>
                        {{ t('saved.title') || 'Saved Messages' }}
                    </h3>
                    <div
                        class="flex flex-col items-end space-y-1 w-full sm:w-auto"
                    >
                        <button
                            @click="syncOrBackupSaveMessages"
                            class="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 font-semibold transition w-full sm:w-auto"
                            :disabled="isSyncing"
                        >
                            <span
                                v-if="!isSyncing"
                                class="flex items-center gap-1"
                            >
                                <!-- Sync & Backup Icon -->
                                <svg
                                    class="w-4 h-4 mr-1 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-6.219-8.56M16 16l2 2m0 0l2-2m-2 2V12"
                                    />
                                </svg>
                                {{
                                    t('saved.sync') || 'Sync & Backup Messages'
                                }}
                            </span>
                            <span v-else class="flex items-center gap-1">
                                <svg
                                    class="w-4 h-4 mr-1 animate-spin text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    ></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    ></path>
                                </svg>
                                {{ t('saved.syncing') || 'Syncing...' }}
                            </span>
                        </button>

                        <div
                            class="text-xs text-gray-500 text-right w-full sm:w-auto"
                        >
                            {{
                                t('saved.syncDescription') ||
                                'Sync your saved messages across devices using localStorage. Note: Clearing browser data will remove saved messages.'
                            }}
                        </div>
                    </div>
                </div>

                <div class="w-full mx-auto p-4 space-y-3">
                    <!-- Add Message Form -->
                    <form
                        @submit.prevent="addMessage"
                        class="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                    >
                        <input
                            v-model="newMessage"
                            type="text"
                            class="flex-1 border border-indigo-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full sm:w-auto"
                            :placeholder="t('saved.inputPlaceholder')"
                            maxlength="500"
                            required
                        />
                        <!-- Priority Checkbox -->
                        <label
                            class="flex items-center space-x-1 text-xs text-indigo-700 font-semibold"
                        >
                            <input
                                type="checkbox"
                                v-model="newPriority"
                                class="accent-indigo-500"
                            />
                            <span
                                :style="{
                                    color: newPriority
                                        ? priorityColor
                                        : '#6b7280',
                                }"
                                >PRIORITY</span
                            >
                        </label>
                        <!-- Priority Color Dropdown -->
                        <select
                            v-if="newPriority"
                            v-model="priorityColor"
                            class="border border-indigo-200 rounded px-2 py-1 text-xs"
                            :disabled="!newPriority"
                            title="Priority Label Color"
                        >
                            <option value="#a21caf" style="color: #a21caf">
                                Purple
                            </option>
                            <option value="#f59e42" style="color: #f59e42">
                                Orange
                            </option>
                            <option value="#16a34a" style="color: #16a34a">
                                Green
                            </option>
                            <option value="#2563eb" style="color: #2563eb">
                                Blue
                            </option>
                            <option value="#dc2626" style="color: #dc2626">
                                Red
                            </option>
                        </select>
                        <button
                            type="submit"
                            class="bg-indigo-500 hover:bg-indigo-600 text-white rounded px-4 py-2 font-semibold transition w-full sm:w-auto"
                            :disabled="!newMessage.trim()"
                        >
                            {{ t('saved.add') }}
                        </button>
                        <!-- File Upload -->
                        <label
                            class="flex items-center space-x-1 text-xs text-indigo-700 font-semibold cursor-pointer"
                        >
                            <input
                                type="file"
                                @change="handleFileUpload"
                                class="hidden"
                                multiple
                            />
                            <svg
                                class="w-5 h-5 text-indigo-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                                />
                            </svg>
                            <span>{{
                                t('saved.attachFile') || 'Attach File'
                            }}</span>
                        </label>
                        <!-- Uploaded Files Preview -->
                        <div
                            v-if="uploadedFiles && uploadedFiles.length"
                            class="flex flex-wrap gap-2 mt-2"
                        >
                            <div
                                v-for="(file, idx) in uploadedFiles"
                                :key="file.name + idx"
                                class="flex items-center bg-indigo-50 border border-indigo-200 rounded px-2 py-1 text-xs text-indigo-800"
                            >
                                <svg
                                    class="w-4 h-4 mr-1 text-indigo-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z"
                                    />
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M16 7v6a2 2 0 01-2 2H7"
                                    />
                                </svg>
                                <span class="truncate max-w-[100px]">{{
                                    file.name
                                }}</span>
                                <button
                                    type="button"
                                    @click="removeUploadedFile(idx)"
                                    class="ml-2 text-red-400 hover:text-red-600"
                                    title="Remove"
                                >
                                    <svg
                                        class="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
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
                    </form>

                    <!-- Priority Filter Dropdown -->
                    <div class="flex justify-end mb-2">
                        <select
                            v-model="priorityFilter"
                            class="border border-indigo-200 rounded px-2 py-1 text-xs"
                            title="Filter by Priority Color"
                        >
                            <option value="">All</option>
                            <option value="#a21caf" style="color: #a21caf">
                                Purple
                            </option>
                            <option value="#f59e42" style="color: #f59e42">
                                Orange
                            </option>
                            <option value="#16a34a" style="color: #16a34a">
                                Green
                            </option>
                            <option value="#2563eb" style="color: #2563eb">
                                Blue
                            </option>
                            <option value="#dc2626" style="color: #dc2626">
                                Red
                            </option>
                            <option value="priority">Priority Only</option>
                            <option value="normal">Normal Only</option>
                        </select>
                    </div>

                    <div
                        v-for="msg in filteredMessages"
                        :key="msg.id"
                        class="bg-white rounded-xl shadow p-4 flex items-start space-x-3 group relative"
                        :class="msg.priority ? 'border-2' : ''"
                        :style="
                            msg.priority
                                ? {
                                      borderColor:
                                          msg.priorityColor || '#a21caf',
                                  }
                                : {}
                        "
                    >
                        <div class="flex-shrink-0">
                            <svg
                                class="h-6 w-6 text-indigo-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 5v14l7-7 7 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
                                />
                            </svg>
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center gap-2">
                                <div
                                    class="text-gray-800 text-base break-words"
                                >
                                    {{ msg.text }}
                                </div>
                                <span
                                    v-if="msg.priority"
                                    class="inline-block bg-indigo-100 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide"
                                    :style="{
                                        color: msg.priorityColor || '#a21caf',
                                        border:
                                            '1px solid ' +
                                            (msg.priorityColor || '#a21caf'),
                                    }"
                                >
                                    PRIORITY
                                </span>
                            </div>
                            <!-- Attachments UI -->
                            <div
                                v-if="msg.attachments && msg.attachments.length"
                                class="flex flex-wrap gap-2 mt-2"
                            >
                                <div
                                    v-for="(file, fidx) in msg.attachments"
                                    :key="file.name + fidx"
                                    class="flex items-center bg-indigo-50 border border-indigo-200 rounded px-2 py-1 text-xs text-indigo-800"
                                >
                                    <template
                                        v-if="
                                            file.type &&
                                            file.type.startsWith('image/') &&
                                            file.preview
                                        "
                                    >
                                        <img
                                            :src="file.preview"
                                            :alt="file.name"
                                            class="w-10 h-10 object-cover rounded mr-2 border"
                                        />
                                    </template>
                                    <template v-else>
                                        <svg
                                            class="w-5 h-5 text-indigo-400 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M16 7v6a2 2 0 01-2 2H7"
                                            />
                                        </svg>
                                    </template>
                                    <span class="truncate max-w-[100px]">{{
                                        file.name
                                    }}</span>
                                    <span class="ml-2 text-gray-400">
                                        ({{ (file.size / 1024).toFixed(1) }} KB)
                                    </span>
                                    <a
                                        v-if="file.preview"
                                        :href="file.preview"
                                        :download="file.name"
                                        class="ml-2 text-indigo-500 hover:underline"
                                        title="Download"
                                    >
                                        <svg
                                            class="w-4 h-4 inline"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div class="text-xs text-gray-400 mt-1">
                                {{ msg.date }}
                            </div>
                        </div>
                        <button
                            @click="copyMessage(msg)"
                            class="ml-2 text-indigo-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition"
                            title="Copy"
                        >
                            <svg
                                class="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <rect
                                    x="9"
                                    y="9"
                                    width="13"
                                    height="13"
                                    rx="2"
                                    ry="2"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    fill="none"
                                />
                                <rect
                                    x="3"
                                    y="3"
                                    width="13"
                                    height="13"
                                    rx="2"
                                    ry="2"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    fill="none"
                                />
                            </svg>
                        </button>
                        <!-- Remove Button -->
                        <button
                            @click="removeMessage(msg.id)"
                            class="ml-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                            title="Remove"
                        >
                            <svg
                                class="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <!-- Confirm Remove Box -->
                        <transition name="fade">
                            <div
                                v-if="msg.showConfirm"
                                class="absolute top-2 right-2 bg-white border border-red-300 text-red-700 px-3 py-1 rounded shadow flex items-center gap-2 text-xs"
                            >
                                {{
                                    t('saved.confirmRemove') || 'Are you sure?'
                                }}
                                <button
                                    @click="removeMessage(msg.id, true)"
                                    class="bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded text-xs"
                                >
                                    {{ t('saved.yes') || 'Yes' }}
                                </button>
                                <button
                                    @click="msg.showConfirm = false"
                                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0.5 rounded text-xs"
                                >
                                    {{ t('saved.no') || 'No' }}
                                </button>
                            </div>
                        </transition>
                        <!-- Done Box -->
                        <transition name="fade">
                            <div
                                v-if="copiedId === msg.id"
                                class="absolute top-2 right-2 bg-green-100 border border-green-300 text-green-700 px-3 py-1 rounded shadow flex items-center gap-1 text-xs"
                            >
                                <svg
                                    class="w-4 h-4 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                {{ t('saved.copied') || 'Copied!' }}
                            </div>
                        </transition>
                    </div>
                    <div
                        v-if="!filteredMessages.length"
                        class="text-center text-gray-400 py-8"
                    >
                        {{ t('saved.empty') }}
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Header from './layout/Header.vue';
import SidebarMenu from './layout/SidebarMenu.vue';
import { useI18n } from 'vue-i18n';
import { api } from '../api';

const { t } = useI18n();

const savedMessages = ref([]);
const newMessage = ref('');
const copiedId = ref(null);
const priorityFilter = ref('');
const newPriority = ref(false);
const priorityColor = ref('#a21caf'); // Default to Purple
const uploadedFiles = ref([]); // For file upload preview

onMounted(() => {
    const data = localStorage.getItem('savedMessages');
    if (data) {
        if (JSON.parse(data) !== null && JSON.parse(data).length === 0) {
            return;
        }
        savedMessages.value = JSON.parse(data);
    }
});

const filteredMessages = computed(() => {
    let msgs = savedMessages.value;
    if (priorityFilter.value === 'priority') {
        msgs = msgs.filter((m) => m.priority);
    } else if (priorityFilter.value === 'normal') {
        msgs = msgs.filter((m) => !m.priority);
    } else if (
        priorityFilter.value === '#a21caf' ||
        priorityFilter.value === '#f59e42' ||
        priorityFilter.value === '#16a34a' ||
        priorityFilter.value === '#2563eb' ||
        priorityFilter.value === '#dc2626'
    ) {
        msgs = msgs.filter(
            (m) => m.priority && m.priorityColor === priorityFilter.value,
        );
    }
    return msgs;
});

function addMessage() {
    if (!newMessage.value.trim()) return;
    const msg = {
        id: Date.now(),
        text: newMessage.value.trim(),
        date: new Date().toLocaleString(),
        priority: newPriority.value,
        priorityColor: newPriority.value ? priorityColor.value : null,
        attachments: uploadedFiles.value.length
            ? uploadedFiles.value.map((file) => ({
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  preview: file.content ? file.content : null,
                  content: file.content ? file.content : null,
              }))
            : [],
    };
    savedMessages.value.unshift(msg);
    localStorage.setItem('savedMessages', JSON.stringify(savedMessages.value));
    newMessage.value = '';
    newPriority.value = false;
    priorityColor.value = '#a21caf';
    uploadedFiles.value = [];
}
function removeUploadedFile(idx) {
    // Revoke object URL if exists
    const file = uploadedFiles.value[idx];
    if (file && file.preview) {
        URL.revokeObjectURL(file.preview);
    }
    uploadedFiles.value.splice(idx, 1);
}

function removeMessage(id, confirm = false) {
    const msg = savedMessages.value.find((m) => m.id === id);
    if (msg && !confirm) {
        msg.showConfirm = true;
        return;
    }
    savedMessages.value = savedMessages.value.filter((m) => m.id !== id);
    localStorage.setItem('savedMessages', JSON.stringify(savedMessages.value));
}
function copyMessage(msg) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(msg.text);
    } else {
        // fallback for older browsers and non-secure context
        const textarea = document.createElement('textarea');
        textarea.value = msg.text;
        textarea.style.position = 'fixed'; // avoid scrolling to bottom
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy'); // Still fallback, but will be rarely used
        } catch (e) {
            // ignore
        }
        document.body.removeChild(textarea);
    }
    copiedId.value = msg.id;
    setTimeout(() => {
        if (copiedId.value === msg.id) copiedId.value = null;
    }, 1200);
}

function handleFileUpload(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Create a preview URL for image files
        if (file.type.startsWith('image/')) {
            file.preview = URL.createObjectURL(file);
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            file.content = event.target.result;
        };
        reader.readAsDataURL(file);
        uploadedFiles.value.push(file);
    }
    // Clear the file input
    event.target.value = '';
}
const isSyncing = ref(false);
async function syncOrBackupSaveMessages() {
    if (isSyncing.value) return;
    isSyncing.value = true;
    try {
        const BATCH_SIZE = 100;
        const messages = savedMessages.value;
        if (!messages || messages.length === 0) {
        } else {
            if (messages.length <= BATCH_SIZE) {
                await api.post('/sync-saved-messages/', {
                    messages: JSON.stringify(messages),
                });
            } else {
                // Batch upload for very large arrays
                const batches = chunkArray(messages, BATCH_SIZE);
                for (const batch of batches) {
                    await api.post('/sync-saved-messages/', {
                        messages: JSON.stringify(batch),
                    });
                }
            }
        }

        const response = await api.get('/get-synced-saved-messages/');
        if (response && response.data && response.data.messages) {
            // Merge server messages with local, avoiding duplicates by id
            const serverMessages =
                typeof response.data.messages === 'string'
                    ? JSON.parse(response.data.messages)
                    : response.data.messages;
            const merged = [];
            const seen = new Set();
            for (const msg of [...serverMessages, ...messages]) {
                if (!seen.has(msg.id)) {
                    merged.push(msg);
                    seen.add(msg.id);
                }
            }
            savedMessages.value = merged;
            localStorage.setItem('savedMessages', JSON.stringify(merged));
        }
    } catch (error) {
        console.error('Error syncing messages:', error);
    } finally {
        isSyncing.value = false;
    }
}

function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}
</script>

<style scoped>
@media (max-width: 640px) {
    .max-w-md {
        max-width: 100% !important;
    }
}
input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #6366f1;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
<!-- Commit 22: 2024-08-19T04:02:13 -->
<!-- Commit 30: 2024-09-06T20:52:41 -->
