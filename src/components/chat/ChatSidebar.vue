<template>
    <aside
        v-if="accountId"
        class="h-full p-4 bg-white flex flex-col shadow-lg w-full md:max-w-sm transition-all duration-300 sm:max-w-full sm:p-2 sm:rounded-none"
    >
        <div class="mb-4 flex flex-col gap-2">
            <!-- Real-time connection status -->
            <div class="flex items-center justify-between px-2 py-1">
                <div class="flex items-center gap-2 text-xs">
                    <div
                        class="w-2 h-2 rounded-full"
                        :class="{
                            'bg-green-500': isRealtimeConnected,
                            'bg-red-500': !isRealtimeConnected,
                        }"
                        :title="
                            isRealtimeConnected
                                ? 'Real-time updates active'
                                : 'Real-time updates disconnected'
                        "
                    ></div>
                    <span class="text-gray-600">
                        {{ isRealtimeConnected ? 'Live' : 'Offline' }}
                    </span>
                </div>
                <div class="flex gap-2">
                    <button
                        v-if="
                            !isRealtimeConnected &&
                            props.chatAccountUser?.session_file
                        "
                        @click="setupRealtimeChatListWebSocket()"
                        class="text-xs text-blue-500 hover:underline"
                    >
                        Reconnect
                    </button>
                    <button
                        @click="refreshChatList"
                        :disabled="isLoading"
                        class="text-xs text-gray-500 hover:text-blue-500 disabled:opacity-50"
                        title="Refresh chat list"
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                    <button
                        @click="bulkPredictAgeGender"
                        :disabled="
                            isLoading || isPredicting || !isRealtimeConnected
                        "
                        class="relative text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
                        :title="
                            t('chat.predict_age_gender_for_all_chats_with_ai')
                        "
                    >
                        <svg
                            v-if="!isPredicting"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3 mr-1 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                        </svg>
                        <div
                            v-else
                            class="animate-spin h-3 w-3 mr-1 inline border border-white border-t-transparent rounded-full"
                        ></div>
                        <span class="text-xs font-medium">{{
                            isPredicting ? 'AI...' : 'AI'
                        }}</span>
                    </button>
                </div>
            </div>

            <input
                type="text"
                :placeholder="t('chat.search_placeholder')"
                class="px-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-400 outline-none transition"
                v-model="search"
            />
            <div class="flex gap-2 items-center">
                <select
                    v-model="genderFilter"
                    class="rounded px-2 py-1 bg-gray-100 text-sm"
                >
                    <option value="">{{ t('chat.all_genders') }}</option>
                    <option value="male">{{ t('chat.male') }}</option>
                    <option value="female">{{ t('chat.female') }}</option>
                </select>
                <input
                    type="number"
                    v-model.number="ageMin"
                    :placeholder="t('chat.age_min')"
                    min="0"
                    class="w-20 rounded px-2 py-1 bg-gray-100 text-sm"
                />
                <span>-</span>
                <input
                    type="number"
                    v-model.number="ageMax"
                    :placeholder="t('chat.age_max')"
                    min="0"
                    class="w-20 rounded px-2 py-1 bg-gray-100 text-sm"
                />
                <button
                    v-if="genderFilter || ageMin || ageMax"
                    @click="
                        genderFilter = '';
                        ageMin = '';
                        ageMax = '';
                    "
                    class="ml-auto text-sm text-red-500 hover:underline"
                    :title="t('chat.clear_filters')"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
        <ul class="flex-1 overflow-y-auto space-y-2">
            <!-- Loading State -->
            <li v-if="isLoading" class="text-center text-gray-400 py-8">
                <div
                    class="animate-spin mx-auto mb-2 w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
                ></div>
                <p>Loading chats...</p>
            </li>

            <!-- Error State -->
            <li v-else-if="error" class="text-center text-red-400 py-8">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <p class="mb-2">{{ error }}</p>
                <button
                    @click="refreshChatList"
                    class="text-sm text-blue-500 hover:underline"
                >
                    Try Again
                </button>
            </li>

            <!-- Chat List -->
            <li
                v-for="user in filteredUsers"
                :key="user.id"
                class="flex items-center p-3 rounded-xl hover:bg-blue-100 cursor-pointer transition group border border-transparent"
                :class="
                    user.id === (selectedChatId && selectedChatId.id)
                        ? 'bg-blue-100 border-blue-300'
                        : user.is_active
                        ? 'bg-blue-50 border-blue-200'
                        : ''
                "
                @click="selectChat(user)"
                tabindex="0"
                @keydown.enter="selectChat(user)"
                aria-label="Open chat with {{ user.name || t('chat.unknown_user') }}"
            >
                <div class="relative mr-3">
                    <img
                        :src="
                            user.avatarType === 'base64'
                                ? `data:image/jpeg;base64,${user.avatar}`
                                : user.avatar ||
                                  'https://ui-avatars.com/api/?name=User&background=random&size=128'
                        "
                        class="w-12 h-12 rounded-full border-2 border-blue-100 object-cover bg-gray-100"
                        :alt="user.name || t('chat.unknown_user')"
                    />
                    <span
                        v-if="user.is_online"
                        class="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow"
                        title="Online"
                    ></span>
                </div>
                <div class="flex-1 min-w-0">
                    <div
                        class="text-xs text-gray-500 flex flex-wrap items-center gap-2"
                    >
                        <!-- Gender Icon -->
                        <span
                            v-if="user.gender"
                            class="flex items-center"
                            :title="t(`chat.${user.gender}`)"
                        >
                            <svg
                                v-if="user.gender === 'male'"
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 mr-1 text-blue-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <circle
                                    cx="10"
                                    cy="14"
                                    r="5"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    fill="none"
                                />
                                <path
                                    d="M19 5v4m0-4h-4m4 0l-6 6"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            <svg
                                v-else-if="user.gender === 'female'"
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 mr-1 text-pink-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 14v7m0 0H9m3 0h3m-3-7a5 5 0 100-10 5 5 0 000 10z"
                                />
                            </svg>
                            <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 mr-1 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="5"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    fill="none"
                                />
                            </svg>
                        </span>
                        <!-- Age Badge -->
                        <span
                            v-if="user.age"
                            class="flex items-center px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-800 text-xs font-semibold shadow-sm border border-yellow-200"
                            :title="`${t('chat.age')}: ${user.age}`"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 mr-1 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 14v7m0 0H9m3 0h3m-3-7a5 5 0 100-10 5 5 0 000 10z"
                                />
                            </svg>
                            {{ user.age }}
                        </span>

                        <!-- Last Seen -->
                        <!-- AI Prediction Button -->
                        <button
                            v-if="!user.age || !user.gender"
                            @click.stop="predictSingleUserAgeGender(user)"
                            :disabled="
                                isPredictingUser[user.id] ||
                                !isRealtimeConnected
                            "
                            class="flex items-center px-2 py-0.5 text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200 ml-1 hover:scale-105"
                            :title="t('chat.predict_age_gender_with_ai')"
                        >
                            <svg
                                v-if="!isPredictingUser[user.id]"
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-2.5 w-2.5 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                            </svg>
                            <div
                                v-else
                                class="animate-spin h-2.5 w-2.5 mr-1 border border-white border-t-transparent rounded-full"
                            ></div>
                            <span class="text-xs font-medium">{{
                                isPredictingUser[user.id] ? 'AI...' : 'AI'
                            }}</span>
                        </button>

                        <!-- Re-predict Button (shown on hover for users with existing data) -->
                        <button
                            v-else-if="user.age && user.gender"
                            @click.stop="predictSingleUserAgeGender(user)"
                            :disabled="
                                isPredictingUser[user.id] ||
                                !isRealtimeConnected
                            "
                            class="flex items-center px-1.5 py-0.5 text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full hover:from-amber-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200 ml-1 opacity-0 group-hover:opacity-100 hover:scale-105"
                            :title="t('chat.re_predict_with_ai')"
                        >
                            <svg
                                v-if="!isPredictingUser[user.id]"
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-2 w-2 mr-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            <div
                                v-else
                                class="animate-spin h-2 w-2 mr-0.5 border border-white border-t-transparent rounded-full"
                            ></div>
                            <span class="text-xs font-medium">{{
                                isPredictingUser[user.id] ? '...' : 'AI'
                            }}</span>
                        </button>
                        <span
                            v-if="user.last_seen"
                            class="flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium shadow-sm ml-auto"
                            :title="t('chat.last_seen')"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3 w-3 mr-1 text-green-400"
                                fill="none"
                                viewBox="0 0 20 20"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 8V5a1 1 0 10-2 0v5a1 1 0 00.293.707l3 3a1 1 0 101.414-1.414l-2.707-2.707z"
                                />
                            </svg>
                            {{ user.last_seen }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                        <div class="font-semibold truncate text-gray-900">
                            {{ user.name || t('chat.unknown_user') }}
                        </div>
                        <div
                            v-if="user.last_message_time"
                            class="text-xs text-gray-400 ml-2 whitespace-nowrap"
                        >
                            {{ formatTime(user.last_message_time) }}
                        </div>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                        <span
                            class="text-xs text-gray-500 truncate flex items-center"
                            v-if="user.last_message && user.last_message.text"
                        >
                            {{ user.last_message.text }}
                        </span>
                        <span
                            v-if="user.unread_count && user.unread_count > 0"
                            class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2 min-w-[2rem] text-center font-bold shadow"
                        >
                            {{ user.unread_count }}
                        </span>
                    </div>
                </div>
            </li>
            <li
                v-if="!isLoading && !error && filteredUsers.length === 0"
                class="text-center text-gray-400 py-8"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                </svg>
                {{ t('chat.no_users_found') }}
            </li>
        </ul>
    </aside>
    <aside
        v-else
        class="h-full p-4 bg-white flex flex-col shadow-lg max-w-xs w-full md:max-w-sm transition-all duration-300 sm:max-w-full sm:p-2 sm:rounded-none"
    >
        <div
            class="flex flex-col items-center justify-center h-full text-center text-gray-500"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16 mb-4 text-gray-300"
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
            <p class="text-lg font-medium">
                {{ t('chat.no_account_selected') }}
            </p>
            <p class="mt-2 text-sm">{{ t('chat.select_account') }}</p>
        </div>
    </aside>

    <!-- AI Prediction Results Modal -->
    <div
        v-if="showPredictionModal && predictionResults"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="showPredictionModal = false"
    >
        <div
            class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto shadow-2xl"
            @click.stop
        >
            <div class="flex items-center justify-between mb-4">
                <h3
                    class="text-lg font-semibold text-gray-900 flex items-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 mr-2 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                    </svg>
                    {{ t('chat.prediction_results') }}
                </h3>
                <button
                    @click="showPredictionModal = false"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg
                        class="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        ></path>
                    </svg>
                </button>
            </div>

            <!-- Summary Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-blue-50 rounded-lg p-3 text-center">
                    <div class="text-2xl font-bold text-blue-600">
                        {{ predictionResults.total_chats }}
                    </div>
                    <div class="text-sm text-blue-500">
                        {{ t('chat.total_chats') }}
                    </div>
                </div>
                <div class="bg-green-50 rounded-lg p-3 text-center">
                    <div class="text-2xl font-bold text-green-600">
                        {{ predictionResults.updated }}
                    </div>
                    <div class="text-sm text-green-500">
                        {{ t('chat.updated') }}
                    </div>
                </div>
                <div class="bg-yellow-50 rounded-lg p-3 text-center">
                    <div class="text-2xl font-bold text-yellow-600">
                        {{ predictionResults.processed }}
                    </div>
                    <div class="text-sm text-yellow-500">
                        {{ t('chat.processed') }}
                    </div>
                </div>
                <div class="bg-red-50 rounded-lg p-3 text-center">
                    <div class="text-2xl font-bold text-red-600">
                        {{ predictionResults.errors }}
                    </div>
                    <div class="text-sm text-red-500">
                        {{ t('chat.errors') }}
                    </div>
                </div>
            </div>

            <!-- Details List -->
            <div class="space-y-2 max-h-48 overflow-y-auto">
                <h4 class="font-medium text-gray-700 mb-2">
                    {{ t('chat.prediction_details') }}:
                </h4>
                <div
                    v-for="(detail, index) in predictionResults.details?.slice(
                        0,
                        10,
                    ) || []"
                    :key="index"
                    class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                    <div class="flex items-center space-x-2">
                        <div
                            class="w-2 h-2 rounded-full"
                            :class="
                                detail.status === 'success'
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                            "
                        ></div>
                        <span class="text-sm text-gray-600">{{
                            detail.chat_name || `Chat ${detail.chat_id}`
                        }}</span>
                    </div>
                    <div class="text-sm">
                        <span
                            v-if="detail.status === 'success'"
                            class="text-green-600"
                        >
                            {{ detail.gender }}, {{ detail.age }}
                            <span class="text-xs text-gray-500"
                                >({{ detail.source }})</span
                            >
                        </span>
                        <span v-else class="text-red-600">{{
                            detail.error
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

function formatLastSeen(time) {
    if (!time) return '';
    const date = new Date(time);
    if (isNaN(date.getTime())) return time;
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 2) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function isOnline(user) {
    if (!user.last_seen) return false;
    const lastSeenDate = new Date(user.last_seen);
    const now = new Date();
    const diffMs = now - lastSeenDate;
    return diffMs < 2 * 60 * 1000;
}

function formatTime(time) {
    if (!time) return '';
    const date = new Date(time);
    if (isNaN(date.getTime())) return time;
    const today = new Date();
    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
    if (isToday) {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    } else {
        return date.toLocaleDateString();
    }
}

const { t } = useI18n();
const props = defineProps({
    accountId: {
        type: [String, Number],
        default: null,
    },
    chatAccountUser: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(['chat-selected']);

const selectedChatId = ref(null);

function selectChat(user) {
    selectedChatId.value = user;
    emit('chat-selected', user);
}

const search = ref('');
const users = ref([]);
const isLoading = ref(false);
const error = ref(null);

// New filter states
const genderFilter = ref('');
const ageMin = ref('');
const ageMax = ref('');

// Age/Gender prediction states
const isPredicting = ref(false);
const isPredictingUser = ref({});
const predictionResults = ref(null);
const showPredictionModal = ref(false);

// Filtered users with gender and age range
const filteredUsers = computed(() =>
    users.value.filter((user) => {
        // Search filter
        if (
            search.value &&
            !user.name.toLowerCase().includes(search.value.toLowerCase())
        ) {
            return false;
        }
        // Gender filter
        if (genderFilter.value && user.gender !== genderFilter.value) {
            return false;
        }
        // Age filter
        // Handle age as a single number or a range string like "20 - 30"
        let ageMinUser = null;
        let ageMaxUser = null;
        if (typeof user.age === 'string' && user.age.includes('-')) {
            const [minStr, maxStr] = user.age.split('-').map((s) => s.trim());
            ageMinUser = Number(minStr);
            ageMaxUser = Number(maxStr);
        } else {
            const ageNum = Number(user.age);
            if (!isNaN(ageNum)) {
                ageMinUser = ageMaxUser = ageNum;
            }
        }
        if (
            ageMin.value !== '' &&
            (ageMaxUser === null || ageMaxUser < ageMin.value)
        ) {
            return false;
        }
        if (
            ageMax.value !== '' &&
            (ageMinUser === null || ageMinUser > ageMax.value)
        ) {
            return false;
        }
        return true;
    }),
);

import { api, socketApi } from '../../api';
// WebSocket connection for real-time chat sync status
import { onUnmounted, inject, onMounted } from 'vue';

const mediaUrl = inject('mediaUrl', 'http://127.0.0.1:8888/');

const socketUrl = inject('socketUrl', 'ws://localhost:8000/ws/');

let socket = null;
let chatListSocket = null;
const isRealtimeConnected = ref(false);

function setupRealtimeChatListWebSocket() {
    if (chatListSocket) {
        chatListSocket.close();
    }

    if (!props.chatAccountUser?.session_file) {
        return;
    }

    isRealtimeConnected.value = false;
    chatListSocket = new WebSocket(`${socketUrl}chat-list`);

    chatListSocket.onopen = () => {
        isRealtimeConnected.value = true;
        console.log('Real-time chat list WebSocket connected');

        // Request initial chat list
        chatListSocket.send(
            JSON.stringify({
                type: 'get_chat_list',
                session_file: props.chatAccountUser.session_file,
            }),
        );

        // Start monitoring for this session
        startChatListMonitoring();
    };

    chatListSocket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Real-time chat list update:', data);

            if (
                data.type === 'chat_list_initial' ||
                data.type === 'chat_list_current'
            ) {
                handleChatListUpdate(data.chats);
            } else if (data.type === 'chat_list_update') {
                handleSingleChatUpdate(data);
            } else if (data.type === 'user_status_update') {
                handleUserStatusUpdate(data);
            } else if (data.type === 'unread_count_update') {
                handleUnreadCountUpdate(data);
            } else if (data.type === 'connection_established') {
                console.log('Chat list WebSocket connection established');
            }
        } catch (error) {
            console.error('Error parsing chat list WebSocket message:', error);
        }
    };

    chatListSocket.onclose = () => {
        isRealtimeConnected.value = false;
        console.log('Real-time chat list WebSocket disconnected');

        // Auto-reconnect after 3 seconds
        setTimeout(() => {
            if (props.chatAccountUser?.session_file) {
                setupRealtimeChatListWebSocket();
            }
        }, 3000);
    };

    chatListSocket.onerror = (error) => {
        console.error('Chat list WebSocket error:', error);
        isRealtimeConnected.value = false;
    };
}

async function startChatListMonitoring() {
    if (!props.chatAccountUser?.session_file) {
        return;
    }

    try {
        const response = await socketApi.post(
            '/realtime/start-chat-list-monitoring/',
            null,
            {
                params: { session_file: props.chatAccountUser.session_file },
            },
        );

        if (response.data.status === 'success') {
            console.log('Started chat list monitoring:', response.data);
        }
    } catch (error) {
        console.error('Error starting chat list monitoring:', error);
    }
}

async function stopChatListMonitoring() {
    if (!props.chatAccountUser?.session_file) {
        return;
    }

    try {
        await socketApi.post('/realtime/stop-chat-list-monitoring/', null, {
            params: { session_file: props.chatAccountUser.session_file },
        });
        console.log('Stopped chat list monitoring');
    } catch (error) {
        console.error('Error stopping chat list monitoring:', error);
    }
}

function handleChatListUpdate(chats) {
    if (!Array.isArray(chats)) {
        console.warn('Invalid chat list data received:', chats);
        return;
    }

    console.log(
        'Updating chat list with real-time data:',
        chats.length,
        'chats',
    );

    users.value = chats.map((chat) => ({
        gender: chat.gender ?? 'unknown',
        id: chat.id,
        is_active: chat.is_active ?? false,
        is_favorite: chat.is_favorite ?? false,
        last_message: chat.last_message ?? null,
        last_message_id: chat.last_message_id ?? null,
        last_message_time: chat.last_message_time ?? null,
        last_seen: formatLastSeen(chat.last_seen) ?? null,
        is_online: isOnline(chat) ?? false,
        name: chat.name,
        oldest_message_id: chat.oldest_message_id ?? null,
        oldest_message_time: chat.oldest_message_time ?? null,
        avatar:
            mediaUrl + chat.photo ||
            'https://ui-avatars.com/api/?name=' +
                (chat.name || 'User') +
                '&background=random&size=128',
        avatarType: 'image',
        telegram_account_id: chat.telegram_account_id,
        type: chat.type,
        unread_count: chat.unread_count ?? 0,
        username: chat.username ?? '',
        age: chat.age ?? '',
        gender: chat.gender ?? '',
    }));

    console.log(
        'Chat list updated via WebSocket:',
        users.value.length,
        'users',
    );
}

function handleSingleChatUpdate(data) {
    const chatIndex = users.value.findIndex((user) => user.id === data.chat_id);
    if (chatIndex !== -1) {
        // Update existing chat
        if (data.last_message) {
            users.value[chatIndex].last_message = data.last_message;
            users.value[chatIndex].last_message_id = data.last_message.id;
            users.value[chatIndex].last_message_time = data.last_message.date;
        }

        // Move chat to top of list for new messages
        const updatedChat = users.value[chatIndex];
        users.value.splice(chatIndex, 1);
        users.value.unshift(updatedChat);
    }
}

function handleUserStatusUpdate(data) {
    const userIndex = users.value.findIndex((user) => user.id === data.user_id);
    if (userIndex !== -1) {
        if (data.status) {
            users.value[userIndex].online_status = data.status;
            users.value[userIndex].is_online = data.status.type === 'online';
            users.value[userIndex].last_seen = data.status.last_seen
                ? formatLastSeen(data.status.last_seen)
                : null;
        }
    }
}

function handleUnreadCountUpdate(data) {
    const userIndex = users.value.findIndex((user) => user.id === data.chat_id);
    if (userIndex !== -1) {
        // This would need more specific logic based on the read update
        // For now, we can trigger a refresh of the specific chat
        console.log('Unread count update for chat:', data.chat_id);
    }
}

onMounted(() => {
    // Initialize real-time chat list WebSocket when component mounts
    if (props.chatAccountUser?.session_file) {
        setupRealtimeChatListWebSocket();
    }
});

onUnmounted(() => {
    if (socket) {
        socket.close();
        socket = null;
    }

    if (chatListSocket) {
        chatListSocket.close();
        chatListSocket = null;
    }

    // Stop monitoring when component unmounts
    if (props.chatAccountUser?.session_file) {
        stopChatListMonitoring();
    }
});

async function fetchChatLists() {
    if (!props.accountId) return;

    isLoading.value = true;
    error.value = null;

    try {
        console.log('Fetching chat list for account:', props.accountId);

        const response = await api.post('/chats/', {
            telegram_account_id: props.accountId,
        });

        if (response && response.data) {
            console.log('Chat list data received:', response.data);

            users.value = response.data.map((account) => ({
                gender: account.gender ?? 'unknown',
                id: account.id,
                is_active: account.is_active ?? false,
                is_favorite: account.is_favorite ?? false,
                last_message: account.last_message ?? null,
                last_message_id: account.last_message_id ?? null,
                last_message_time: account.last_message_time ?? null,
                last_seen: formatLastSeen(account.last_seen) ?? null,
                is_online: isOnline(account) ?? false,
                name: account.name,
                oldest_message_id: account.oldest_message_id ?? null,
                oldest_message_time: account.oldest_message_time ?? null,
                avatar:
                    mediaUrl + account.photo ||
                    'https://ui-avatars.com/api/?name=' +
                        (account.name || 'User') +
                        '&background=random&size=128',
                avatarType: 'image',
                telegram_account_id: account.telegram_account_id,
                type: account.type,
                unread_count: account.unread_count ?? 0,
                username: account.username ?? '',
                age: account.age ?? '',
                gender: account.gender ?? '',
            }));

            console.log('Processed users:', users.value.length);
        } else {
            console.warn('No data received from chat list API');
            users.value = [];
        }
    } catch (err) {
        console.error('Error fetching chat list:', err);
        error.value = err.message || 'Failed to load chat list';
        users.value = [];
    } finally {
        isLoading.value = false;
    }
}

// Refresh chat list manually
async function refreshChatList() {
    console.log('Manually refreshing chat list...');
    await fetchChatLists();
}

// Age and Gender Prediction Functions
async function bulkPredictAgeGender() {
    if (!props.chatAccountUser?.session_file || isPredicting.value) {
        return;
    }

    isPredicting.value = true;
    predictionResults.value = null;

    try {
        console.log('Starting bulk age/gender prediction...');

        const response = await socketApi.post(
            '/realtime/bulk-predict-age-gender/',
            null,
            {
                params: {
                    session_file: props.chatAccountUser.session_file,
                    force_update: false, // Only predict for chats without age/gender
                },
            },
        );

        if (response.data.status === 'success') {
            predictionResults.value = response.data;
            console.log('Bulk prediction completed:', response.data);

            // Show results modal
            showPredictionModal.value = true;

            // Show success notification with more details
            const successfulPredictions =
                response.data.details?.filter(
                    (d) => d.status === 'success' && d.source === 'predicted',
                ) || [];
            const firstFewNames = successfulPredictions
                .slice(0, 3)
                .map((d) => d.chat_name || `Chat ${d.chat_id}`)
                .join(', ');
            const moreCount = Math.max(0, successfulPredictions.length - 3);

            showNotification(
                `AI Prediction Complete! 🎉\nProcessed: ${
                    response.data.processed
                } chats\nUpdated: ${response.data.updated} chats\nErrors: ${
                    response.data.errors
                } chats\n${firstFewNames}${
                    moreCount > 0 ? ` and ${moreCount} more` : ''
                }`,
                'success',
            );

            // Refresh chat list to show updated data
            await refreshChatList();
        } else {
            throw new Error(response.data.message || 'Bulk prediction failed');
        }
    } catch (error) {
        console.error('Error in bulk prediction:', error);
        showNotification(
            `Prediction failed: ${error.message || 'Unknown error'}`,
            'error',
        );
    } finally {
        isPredicting.value = false;
    }
}

async function predictSingleUserAgeGender(user) {
    if (
        !props.chatAccountUser?.session_file ||
        isPredictingUser.value[user.id]
    ) {
        return;
    }

    // Set loading state for this specific user
    isPredictingUser.value = { ...isPredictingUser.value, [user.id]: true };

    try {
        console.log(`Predicting age/gender for user ${user.id}...`);

        const response = await socketApi.get(
            `/realtime/age-gender/${user.id}`,
            {
                params: { session_file: props.chatAccountUser.session_file },
            },
        );

        if (response.data.status === 'success') {
            console.log('Single prediction completed:', response.data);

            // Update the user in the local list
            const userIndex = users.value.findIndex((u) => u.id === user.id);
            if (userIndex !== -1) {
                users.value[userIndex].age = response.data.age;
                users.value[userIndex].gender = response.data.gender;
            }

            // Show success notification
            showNotification(
                `AI predicted: ${response.data.gender || 'Unknown'}, ${
                    response.data.age || 'Unknown age'
                } for ${user.name}`,
                'success',
            );
        } else {
            throw new Error(
                response.data.message || 'Single prediction failed',
            );
        }
    } catch (error) {
        console.error('Error in single prediction:', error);
        showNotification(
            `Prediction failed for ${user.name}: ${
                error.message || 'Unknown error'
            }`,
            'error',
        );
    } finally {
        // Remove loading state for this specific user
        const newState = { ...isPredictingUser.value };
        delete newState[user.id];
        isPredictingUser.value = newState;
    }
}

// Simple notification function (you can replace with a proper toast library)
function showNotification(message, type = 'info') {
    // Create a simple notification div
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm transition-all duration-300 ${
        type === 'success'
            ? 'bg-green-500 text-white'
            : type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                ${
                    type === 'success'
                        ? '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>'
                        : type === 'error'
                        ? '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>'
                        : '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>'
                }
            </div>
            <div class="ml-3">
                <div class="text-sm font-medium whitespace-pre-line">${message}</div>
            </div>
            <div class="ml-auto pl-3">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

watch(
    () => props.accountId,
    (newId) => {
        if (newId) {
            if (socket) {
                socket.close();
                socket = null;
            }
            fetchChatLists();
        } else {
            users.value = [];
            selectedChatId.value = null;
            if (socket) {
                socket.close();
                socket = null;
            }
        }
    },
    { immediate: true },
);

// Watch for changes in chat account user for real-time functionality
watch(
    () => props.chatAccountUser,
    async (newUser, oldUser) => {
        if (newUser && newUser !== oldUser) {
            // Stop previous monitoring
            if (oldUser?.session_file && chatListSocket) {
                await stopChatListMonitoring();
                chatListSocket.close();
                chatListSocket = null;
            }

            // Start new monitoring
            if (newUser.session_file) {
                setupRealtimeChatListWebSocket();
            }
        } else if (!newUser && oldUser) {
            // User logged out, stop monitoring
            if (chatListSocket) {
                await stopChatListMonitoring();
                chatListSocket.close();
                chatListSocket = null;
            }
        }
    },
);
</script>
