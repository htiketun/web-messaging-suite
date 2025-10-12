<template>
    <div
        v-if="accountId"
        class="h-full bg-white flex shadow-lg lg:w-4/12 sm:w-full max-w-full transition-all duration-300 border-r border-gray-200 overflow-hidden"
    >
        <!-- Left Sidebar: Demographic Filters -->
        <div
            class="w-16 bg-gray-900 flex flex-col items-center py-4 space-y-4 p-5"
        >
            <!-- All Users -->
            <div
                @click="setActiveFolder('all')"
                :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200',
                    activeFolder === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                ]"
                :title="t('chat.all_users') || 'All Users'"
            >
                <!-- All messages svg -->
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
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                </svg>
            </div>

            <!-- Male Users -->
            <div
                @click="setActiveFolder('male')"
                :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 group relative',
                    activeFolder === 'male'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                ]"
                :title="t('chat.male_users') || 'Male Users'"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
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
            </div>

            <!-- Female Users -->
            <div
                @click="setActiveFolder('female')"
                :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 group relative',
                    activeFolder === 'female'
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                ]"
                :title="t('chat.female_users') || 'Female Users'"
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
                        d="M12 14v7m0 0H9m3 0h3m-3-7a5 5 0 100-10 5 5 0 000 10z"
                    />
                </svg>
            </div>

            <!-- Young Adults (18-25) -->
            <div
                @click="setActiveFolder('young')"
                :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 group relative',
                    activeFolder === 'young'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                ]"
                :title="t('chat.young_adults') || 'Young Adults (18-25)'"
            >
                <div class="text-xs font-bold">18-25</div>
            </div>

            <!-- Adults (26-35) -->
            <div
                @click="setActiveFolder('adult')"
                :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 group relative',
                    activeFolder === 'adult'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                ]"
                :title="t('chat.adults') || 'Adults (26-35)'"
            >
                <div class="text-xs font-bold">26-35</div>
            </div>

            <!-- Middle Age (36-50) -->
            <div
                @click="setActiveFolder('middle')"
                :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 group relative',
                    activeFolder === 'middle'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                ]"
                :title="t('chat.middle_age') || 'Middle Age (36-50)'"
            >
                <div class="text-xs font-bold">36-50</div>
            </div>

            <!-- Seniors (51+) -->
            <div
                @click="setActiveFolder('senior')"
                :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 group relative',
                    activeFolder === 'senior'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                ]"
                :title="t('chat.seniors') || 'Seniors (51+)'"
            >
                <div class="text-xs font-bold">51+</div>
            </div>

            <!-- Separator -->
            <div class="w-8 h-px bg-gray-600 my-2"></div>

            <!-- Favorites -->
            <div
                @click="setActiveFolder('favorites')"
                :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 group relative',
                    activeFolder === 'favorites'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                ]"
                :title="t('chat.favorites') || 'Favorites'"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    :fill="
                        activeFolder === 'favorites' ? 'currentColor' : 'none'
                    "
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            </div>

            <!-- Archive -->
            <div
                @click="setActiveFolder('archive')"
                :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 group relative',
                    activeFolder === 'archive'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                ]"
                :title="t('chat.archive') || 'Archive'"
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
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                </svg>
            </div>

            <!-- Edit Button -->
            <div class="mt-auto">
                <div
                    @click="toggleEditMode"
                    :class="[
                        'w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative',
                        isEditMode
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                    ]"
                    :title="isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        :class="[
                            'h-5 w-5 transition-transform duration-200',
                            isEditMode ? 'rotate-12 scale-110' : '',
                        ]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                    </svg>
                    <!-- Active indicator dot -->
                    <div
                        v-if="isEditMode"
                        class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-gray-900 animate-pulse"
                    ></div>
                </div>
            </div>
        </div>

        <!-- Right Content: Chat List -->
        <div
            class="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white overflow-hidden"
        >
            <div class="p-4 pb-2 flex-shrink-0">
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
                                    isLoading ||
                                    isPredicting ||
                                    !isRealtimeConnected
                                "
                                class="relative text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
                                :title="
                                    t(
                                        'chat.predict_age_gender_for_all_chats_with_ai',
                                    )
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
                    <div
                        class="flex gap-2 items-center"
                        v-if="activeFolder === 'all'"
                    >
                        <select
                            v-model="genderFilter"
                            class="rounded px-2 py-1 bg-gray-100 text-sm"
                        >
                            <option value="">
                                {{ t('chat.all_genders') }}
                            </option>
                            <option value="male">{{ t('chat.male') }}</option>
                            <option value="female">
                                {{ t('chat.female') }}
                            </option>
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
                            v-if="
                                genderFilter ||
                                ageMin ||
                                ageMax ||
                                onlineFilter ||
                                activeFilter ||
                                lastSeenFilter
                            "
                            @click="clearAllFilters"
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
            </div>

            <!-- Chat List Content Based on Active Folder -->
            <div
                class="flex-1 flex flex-col overflow-hidden px-4 pb-4 chat-list-container"
            >
                <div class="mb-2 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <h2 class="text-lg font-semibold text-gray-800">
                            {{ getFolderTitle(activeFolder) }}
                        </h2>
                        <span
                            v-if="isEditMode"
                            class="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-medium border border-orange-200"
                        >
                            {{ t('chat.edit_mode') }}
                        </span>
                    </div>
                    <span class="text-sm text-gray-500">
                        {{ getDisplayedChats().length }}
                        {{
                            getDisplayedChats().length === 1 ? 'chat' : 'chats'
                        }}
                    </span>
                </div>

                <ul
                    class="flex-1 overflow-y-auto space-y-1 min-h-0 pr-2 pb-4"
                    style="
                        scrollbar-width: thin;
                        scrollbar-color: #d1d5db #f3f4f6;
                    "
                >
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
                        v-for="chat in getDisplayedChats()"
                        :key="chat.id"
                        class="flex items-start p-3 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-300 group border border-transparent hover:border-blue-200 hover:shadow-lg hover:scale-[1.01] transform"
                        :class="
                            chat.id === (selectedChatId && selectedChatId.id)
                                ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300 shadow-lg scale-[1.01] ring-2 ring-blue-200 ring-opacity-50'
                                : chat.is_active
                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm'
                                : 'hover:shadow-md bg-white border-gray-100'
                        "
                        @click="selectChat(chat)"
                        tabindex="0"
                        @keydown.enter="selectChat(chat)"
                        aria-label="Open chat with {{ chat.name || t('chat.unknown_user') }}"
                    >
                        <!-- Avatar Section -->
                        <div class="relative mr-4 flex-shrink-0">
                            <!-- Avatar for individual users -->
                            <div
                                v-if="
                                    chat.type === 'private' ||
                                    chat.type === 'user' ||
                                    !chat.type
                                "
                                class="relative"
                            >
                                <img
                                    :src="
                                        chat.avatarType === 'base64'
                                            ? `data:image/jpeg;base64,${chat.avatar}`
                                            : chat.avatar ||
                                              'https://ui-avatars.com/api/?name=User&background=random&size=128'
                                    "
                                    class="w-14 h-14 rounded-2xl border-3 border-white object-cover bg-gray-100 shadow-xl ring-2 ring-blue-100 ring-opacity-50 transition-all duration-300 group-hover:ring-blue-200 group-hover:ring-opacity-75 group-hover:shadow-2xl"
                                    :alt="chat.name || t('chat.unknown_user')"
                                />
                                <!-- Online Status for individual users -->
                                <span
                                    v-if="chat.is_online"
                                    class="absolute -top-0 -left-0 w-4 h-4 bg-green-500 border-3 border-white rounded-full shadow-md animate-pulse"
                                    title="Online"
                                ></span>
                            </div>

                            <!-- Icon for groups -->
                            <div
                                v-else
                                class="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-7 w-7 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <!-- Online Status for groups -->
                                <span
                                    v-if="chat.is_online"
                                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-3 border-white rounded-full shadow-md animate-pulse"
                                    title="Online"
                                ></span>
                            </div>

                            <!-- Unread Count Badge -->
                            <div
                                v-if="
                                    chat.unread_count && chat.unread_count > 0
                                "
                                class="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full min-w-[1.2rem] text-center font-bold shadow-lg border-2 border-white animate-bounce"
                                :title="`${chat.unread_count} ${t(
                                    'chat.unread_messages',
                                )}`"
                            >
                                {{
                                    chat.unread_count > 99
                                        ? '99+'
                                        : chat.unread_count
                                }}
                            </div>

                            <!-- User Info Badges Row - Compact & Attractive (Bottom) -->
                            <div
                                class="flex items-center gap-1 mt-1 justify-center"
                            >
                                <!-- Gender Badge - Minimal -->
                                <span
                                    v-if="chat.gender"
                                    class="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium shadow-sm transition-all duration-200"
                                    :class="{
                                        'bg-blue-100 text-blue-700 border border-blue-200':
                                            chat.gender === 'male',
                                        'bg-pink-100 text-pink-700 border border-pink-200':
                                            chat.gender === 'female',
                                        'bg-gray-100 text-gray-600 border border-gray-200':
                                            chat.gender !== 'male' &&
                                            chat.gender !== 'female',
                                    }"
                                    :title="t(`chat.${chat.gender}`)"
                                >
                                    <template v-if="chat.gender === 'male'">
                                        ♂
                                    </template>
                                    <template
                                        v-else-if="chat.gender === 'female'"
                                    >
                                        ♀
                                    </template>
                                    <template v-else> ? </template>
                                </span>

                                <!-- Age Badge - Minimal -->
                                <span
                                    v-if="chat.age"
                                    class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200 shadow-sm"
                                    :title="`${t('chat.age')}: ${chat.age}`"
                                >
                                    {{ chat.age }}
                                </span>

                                <!-- Member Count Badge - For Groups -->
                                <span
                                    v-if="
                                        chat.member_count &&
                                        (chat.type === 'group' ||
                                            chat.type === 'supergroup' ||
                                            chat.type === 'channel')
                                    "
                                    class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-medium border border-indigo-200 shadow-sm"
                                    :title="t('chat.members')"
                                >
                                    {{ chat.member_count }}
                                </span>
                            </div>
                        </div>

                        <!-- Chat Content Section -->
                        <div class="flex-1 min-w-0 space-y-2">
                            <!-- Header Row: Name and Time -->
                            <!-- Action Buttons Row -->
                            <div class="flex flex-wrap items-center gap-2 mb-2">
                                <h3
                                    class="font-semibold text-gray-900 text-base truncate pr-2 leading-tight"
                                >
                                    {{
                                        chat.name ||
                                        (chat.type === 'group' ||
                                        chat.type === 'supergroup' ||
                                        chat.type === 'channel'
                                            ? t('chat.unknown_group')
                                            : t('chat.unknown_user'))
                                    }}
                                </h3>

                                <!-- AI Prediction Button -->
                                <button
                                    v-if="
                                        (!chat.age || !chat.gender) &&
                                        (chat.type === 'private' ||
                                            chat.type === 'user' ||
                                            !chat.type)
                                    "
                                    @click.stop="
                                        predictSingleUserAgeGender(chat)
                                    "
                                    :disabled="
                                        isPredictingUser[chat.id] ||
                                        !isRealtimeConnected
                                    "
                                    class="flex items-center px-2 py-0.5 text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200 hover:scale-105"
                                    :title="
                                        t('chat.predict_age_gender_with_ai')
                                    "
                                >
                                    <svg
                                        v-if="!isPredictingUser[chat.id]"
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
                                        isPredictingUser[chat.id]
                                            ? 'AI...'
                                            : 'AI'
                                    }}</span>
                                </button>

                                <!-- Re-predict Button (shown on hover for users with existing data) -->
                                <button
                                    v-else-if="
                                        chat.age &&
                                        chat.gender &&
                                        (chat.type === 'private' ||
                                            chat.type === 'user' ||
                                            !chat.type)
                                    "
                                    @click.stop="
                                        predictSingleUserAgeGender(chat)
                                    "
                                    :disabled="
                                        isPredictingUser[chat.id] ||
                                        !isRealtimeConnected
                                    "
                                    class="flex items-center px-1.5 py-0.5 text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full hover:from-amber-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105"
                                    :title="t('chat.re_predict_with_ai')"
                                >
                                    <svg
                                        v-if="!isPredictingUser[chat.id]"
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
                                        isPredictingUser[chat.id] ? '...' : 'AI'
                                    }}</span>
                                </button>
                                <!-- Last Seen Badge -->
                                <span
                                    v-if="
                                        chat.last_seen &&
                                        (chat.type === 'private' ||
                                            chat.type === 'user' ||
                                            !chat.type)
                                    "
                                    class="ml-auto inline-flex items-center px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-900 text-xs font-semibold border border-emerald-300 shadow-sm transition-all duration-200 hover:scale-105 hover:from-emerald-200 hover:to-emerald-300"
                                    :title="t('chat.last_seen')"
                                >
                                    <svg
                                        class="h-3 w-3 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {{ chat.last_seen }}
                                </span>
                            </div>

                            <!-- Last Message Preview Row -->
                            <div
                                class="flex items-center gap-2 mt-1.5 p-1.5 bg-gray-50 rounded-lg border border-gray-100"
                            >
                                <!-- Last Message Text with Limited Width -->
                                <div class="flex items-center flex-1 min-w-0">
                                    <span
                                        class="text-sm text-gray-700 truncate flex items-center font-medium"
                                        v-if="
                                            chat.last_message &&
                                            chat.last_message.text
                                        "
                                    >
                                        💬
                                        {{ chat.last_message.text }}
                                    </span>
                                    <span
                                        v-else-if="
                                            !chat.last_message ||
                                            !chat.last_message.text
                                        "
                                        class="text-sm text-gray-500 italic flex items-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-4 w-4 mr-2 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        📷 Stickers, Photos, or Files
                                    </span>
                                </div>

                                <!-- Last Message Time (after message) -->
                                <div
                                    v-if="chat.last_message_time"
                                    class="text-xs text-gray-500 whitespace-nowrap flex items-center flex-shrink-0 ml-auto bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm"
                                    :title="t('chat.last_message_time')"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-3 w-3 mr-1 text-gray-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {{ formatTime(chat.last_message_time) }}
                                </div>
                            </div>

                            <!-- Edit Mode Controls -->
                            <template v-if="isEditMode">
                                <div
                                    class="flex flex-wrap items-center gap-2 mb-2"
                                >
                                    <button
                                        @click.stop="toggleFavorite(chat)"
                                        :disabled="loadingFavorite[chat.id]"
                                        :class="[
                                            'group relative flex items-center gap-1.5 px-2 py-1 text-xs rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none',
                                            chat.is_favorite
                                                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md hover:from-yellow-500 hover:to-amber-600 hover:shadow-lg'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-600 shadow-sm',
                                        ]"
                                        :title="
                                            loadingFavorite[chat.id]
                                                ? 'Updating...'
                                                : chat.is_favorite
                                                ? 'Remove from favorites'
                                                : 'Add to favorites'
                                        "
                                    >
                                        <div
                                            v-if="loadingFavorite[chat.id]"
                                            class="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full"
                                        ></div>
                                        <svg
                                            v-else
                                            xmlns="http://www.w3.org/2000/svg"
                                            :class="[
                                                'h-3 w-3 transition-all duration-300',
                                                chat.is_favorite
                                                    ? 'text-white scale-110'
                                                    : 'text-gray-500 group-hover:text-yellow-500',
                                            ]"
                                            :fill="
                                                chat.is_favorite
                                                    ? 'currentColor'
                                                    : 'none'
                                            "
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            :stroke-width="
                                                chat.is_favorite ? '0' : '2'
                                            "
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                            />
                                        </svg>
                                        <span
                                            class="hidden sm:inline text-xs"
                                            >{{
                                                loadingFavorite[chat.id]
                                                    ? 'Updating...'
                                                    : chat.is_favorite
                                                    ? 'Favorited'
                                                    : 'Favorite'
                                            }}</span
                                        >
                                    </button>

                                    <!-- <button
                                        @click.stop="markAsRead(chat)"
                                        v-if="
                                            chat.unread_count &&
                                            chat.unread_count > 0
                                        "
                                        :disabled="loadingMarkRead[chat.id]"
                                        class="group relative flex items-center gap-1.5 px-2 py-1 text-xs rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md hover:from-blue-600 hover:to-cyan-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                        :title="
                                            loadingMarkRead[chat.id]
                                                ? 'Marking as read...'
                                                : 'Mark as read'
                                        "
                                    >
                                        <div
                                            v-if="loadingMarkRead[chat.id]"
                                            class="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full"
                                        ></div>
                                        <svg
                                            v-else
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-3 w-3 text-white transition-all duration-300"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span
                                            class="hidden sm:inline text-xs"
                                            >{{
                                                loadingMarkRead[chat.id]
                                                    ? 'Reading...'
                                                    : 'Mark Read'
                                            }}</span
                                        >
                                    </button> -->

                                    <button
                                        @click.stop="archiveChat(chat)"
                                        :disabled="loadingArchive[chat.id]"
                                        :class="[
                                            'group relative flex items-center gap-1.5 px-2 py-1 text-xs rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none',
                                            chat.is_archived
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm',
                                        ]"
                                        :title="
                                            loadingArchive[chat.id]
                                                ? 'Updating...'
                                                : chat.is_archived
                                                ? 'Unarchive chat'
                                                : 'Archive chat'
                                        "
                                    >
                                        <div
                                            v-if="loadingArchive[chat.id]"
                                            class="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full"
                                        ></div>
                                        <svg
                                            v-else
                                            xmlns="http://www.w3.org/2000/svg"
                                            :class="[
                                                'h-3 w-3 transition-all duration-300',
                                                chat.is_archived
                                                    ? 'text-white'
                                                    : 'text-gray-500 group-hover:text-indigo-500',
                                            ]"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                                            />
                                        </svg>
                                        <span
                                            class="hidden sm:inline text-xs"
                                            >{{
                                                loadingArchive[chat.id]
                                                    ? 'Updating...'
                                                    : chat.is_archived
                                                    ? 'Archived'
                                                    : 'Archive'
                                            }}</span
                                        >
                                    </button>
                                </div>
                            </template>
                        </div>
                    </li>
                    <li
                        v-if="
                            !isLoading &&
                            !error &&
                            getDisplayedChats().length === 0
                        "
                        class="text-center text-gray-400 py-6"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 mx-auto mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <p class="text-xs">{{ getEmptyStateMessage() }}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div
        v-else
        class="h-full p-4 bg-white shadow-lg lg:w-4/12 sm:w-full max-w-full transition-all duration-300 sm:p-2 sm:rounded-none border-r border-gray-200"
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
    </div>

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
const groups = ref([]);
const isLoading = ref(false);
const error = ref(null);

// New filter states
const genderFilter = ref('');
const ageMin = ref('');
const ageMax = ref('');
const onlineFilter = ref('');
const activeFilter = ref('');
const lastSeenFilter = ref('');

// Age/Gender prediction states
const isPredicting = ref(false);
const isPredictingUser = ref({});
const predictionResults = ref(null);
const showPredictionModal = ref(false);

// Folder system states
const activeFolder = ref('all');
const isEditMode = ref(false);
const loadingFavorite = ref({});
const loadingArchive = ref({});
const loadingMarkRead = ref({});

// Computed properties for unread count
const unreadCount = computed(() => {
    return [...users.value, ...groups.value].reduce((total, chat) => {
        return total + (chat.unread_count || 0);
    }, 0);
});

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

// Filtered groups with gender and age filters
const filteredGroups = computed(() =>
    groups.value.filter((group) => {
        // Search filter for groups
        if (
            search.value &&
            !group.name.toLowerCase().includes(search.value.toLowerCase())
        ) {
            return false;
        }

        // Gender filter for groups
        if (genderFilter.value && group.gender !== genderFilter.value) {
            return false;
        }

        // Age filter for groups
        // Handle age as a single number or a range string like "20 - 30"
        let ageMinGroup = null;
        let ageMaxGroup = null;
        if (typeof group.age === 'string' && group.age.includes('-')) {
            const [minStr, maxStr] = group.age.split('-').map((s) => s.trim());
            ageMinGroup = Number(minStr);
            ageMaxGroup = Number(maxStr);
        } else {
            const ageNum = Number(group.age);
            if (!isNaN(ageNum)) {
                ageMinGroup = ageMaxGroup = ageNum;
            }
        }
        if (
            ageMin.value !== '' &&
            (ageMaxGroup === null || ageMaxGroup < ageMin.value)
        ) {
            return false;
        }
        if (
            ageMax.value !== '' &&
            (ageMinGroup === null || ageMinGroup > ageMax.value)
        ) {
            return false;
        }

        return true;
    }),
);

import { api, socketApi } from '../../api';
// WebSocket connection for real-time chat sync status
import { onUnmounted, inject, onMounted } from 'vue';

// Folder management functions
function setActiveFolder(folder) {
    activeFolder.value = folder;
}

function toggleEditMode() {
    isEditMode.value = !isEditMode.value;
    console.log('Edit mode toggled:', isEditMode.value);

    // You can add additional functionality here, such as:
    // - Show/hide additional UI elements
    // - Enable/disable certain features
    // - Change the behavior of other components
}

function getFolderTitle(folder) {
    const titles = {
        all: t('chat.all_users') || 'All Users',
        male: t('chat.male_users') || 'Male Users',
        female: t('chat.female_users') || 'Female Users',
        young: t('chat.young_adults') || 'Young Adults (18-25)',
        adult: t('chat.adults') || 'Adults (26-35)',
        middle: t('chat.middle_age') || 'Middle Age (36-50)',
        senior: t('chat.seniors') || 'Seniors (51+)',
        favorites: t('chat.favorites') || 'Favorites',
        archive: t('chat.archive') || 'Archive',
        folders: t('chat.folders') || 'Folders',
    };
    return titles[folder] || 'All Users';
}

function getDisplayedChats() {
    // where not id 1919063625 and 8297286605
    const excludedIds = [1919063625, 8297286605];
    const allChats = [...users.value, ...groups.value].filter(
        (chat) => !excludedIds.includes(chat.id),
    );
    // Apply search filter first
    let filteredChats = allChats.filter((chat) => {
        if (
            search.value &&
            !chat.name.toLowerCase().includes(search.value.toLowerCase())
        ) {
            return false;
        }
        return true;
    });

    // Apply folder filter based on demographics
    switch (activeFolder.value) {
        case 'male':
            filteredChats = filteredChats.filter(
                (chat) => chat.gender === 'male',
            );
            break;
        case 'female':
            filteredChats = filteredChats.filter(
                (chat) => chat.gender === 'female',
            );
            break;
        case 'young':
            filteredChats = filteredChats.filter((chat) => {
                const age = parseInt(chat.age);
                return age >= 18 && age <= 25;
            });
            break;
        case 'adult':
            filteredChats = filteredChats.filter((chat) => {
                const age = parseInt(chat.age);
                return age >= 26 && age <= 35;
            });
            break;
        case 'middle':
            filteredChats = filteredChats.filter((chat) => {
                const age = parseInt(chat.age);
                return age >= 36 && age <= 50;
            });
            break;
        case 'senior':
            filteredChats = filteredChats.filter((chat) => {
                const age = parseInt(chat.age);
                return age >= 51;
            });
            break;
        case 'favorites':
            filteredChats = filteredChats.filter((chat) => chat.is_favorite);
            break;
        case 'archive':
            filteredChats = filteredChats.filter((chat) => chat.is_archived);
            break;
        case 'folders':
            filteredChats = filteredChats.filter((chat) => chat.folder_id);
            break;
        case 'all':
        default:
            // Show all chats
            break;
    }

    // Apply gender and age filters
    return filteredChats.filter((chat) => {
        // Gender filter
        if (genderFilter.value && chat.gender !== genderFilter.value) {
            return false;
        }

        // Age filter
        let ageMinChat = null;
        let ageMaxChat = null;
        if (typeof chat.age === 'string' && chat.age.includes('-')) {
            const [minStr, maxStr] = chat.age.split('-').map((s) => s.trim());
            ageMinChat = Number(minStr);
            ageMaxChat = Number(maxStr);
        } else {
            const ageNum = Number(chat.age);
            if (!isNaN(ageNum)) {
                ageMinChat = ageMaxChat = ageNum;
            }
        }
        if (
            ageMin.value !== '' &&
            (ageMaxChat === null || ageMaxChat < ageMin.value)
        ) {
            return false;
        }
        if (
            ageMax.value !== '' &&
            (ageMinChat === null || ageMinChat > ageMax.value)
        ) {
            return false;
        }

        return true;
    });
}

function getEmptyStateMessage() {
    const messages = {
        all: t('chat.no_users_found') || 'No users found',
        male: t('chat.no_male_users') || 'No male users found',
        female: t('chat.no_female_users') || 'No female users found',
        young: t('chat.no_young_adults') || 'No young adults (18-25) found',
        adult: t('chat.no_adults') || 'No adults (26-35) found',
        middle: t('chat.no_middle_age') || 'No middle age users (36-50) found',
        senior: t('chat.no_seniors') || 'No seniors (51+) found',
        favorites: t('chat.no_favorites') || 'No favorite chats found',
        archive: t('chat.no_archived') || 'No archived chats found',
        folders: t('chat.no_folders') || 'No organized folders found',
    };
    return messages[activeFolder.value] || 'No users found';
}

function clearAllFilters() {
    genderFilter.value = '';
    ageMin.value = '';
    ageMax.value = '';
    onlineFilter.value = '';
    activeFilter.value = '';
    lastSeenFilter.value = '';
    search.value = '';
}

// Local Storage utility functions
function getFavoritesFromStorage() {
    try {
        const favorites = localStorage.getItem('chat_favorites');
        return favorites ? JSON.parse(favorites) : {};
    } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
        return {};
    }
}

function saveFavoritesToStorage(favorites) {
    try {
        localStorage.setItem('chat_favorites', JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
    }
}

function getArchivedFromStorage() {
    try {
        const archived = localStorage.getItem('chat_archived');
        return archived ? JSON.parse(archived) : {};
    } catch (error) {
        console.error('Error loading archived chats from localStorage:', error);
        return {};
    }
}

function saveArchivedToStorage(archived) {
    try {
        localStorage.setItem('chat_archived', JSON.stringify(archived));
    } catch (error) {
        console.error('Error saving archived chats to localStorage:', error);
    }
}

function updateChatFavoriteStatus(chatId, isFavorite) {
    const favorites = getFavoritesFromStorage();
    if (isFavorite) {
        favorites[chatId] = true;
    } else {
        delete favorites[chatId];
    }
    saveFavoritesToStorage(favorites);
}

function updateChatArchiveStatus(chatId, isArchived) {
    const archived = getArchivedFromStorage();
    if (isArchived) {
        archived[chatId] = true;
    } else {
        delete archived[chatId];
    }
    saveArchivedToStorage(archived);
}

function applyStoredStates(chats) {
    const favorites = getFavoritesFromStorage();
    const archived = getArchivedFromStorage();

    return chats.map((chat) => ({
        ...chat,
        is_favorite: favorites[chat.id] || false,
        is_archived: archived[chat.id] || false,
    }));
}

// Edit mode functions
async function toggleFavorite(chat) {
    console.log('Toggling favorite for chat:', chat.name);

    // Set loading state
    loadingFavorite.value[chat.id] = true;

    try {
        // Add a small delay for better visual feedback
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Toggle favorite status
        chat.is_favorite = !chat.is_favorite;

        // Save to local storage
        updateChatFavoriteStatus(chat.id, chat.is_favorite);

        console.log(
            `Chat ${chat.id} favorite status saved to localStorage:`,
            chat.is_favorite,
        );

        showNotification(
            `${chat.name} ${
                chat.is_favorite ? 'added to' : 'removed from'
            } favorites`,
            'success',
        );
    } catch (error) {
        console.error('Error toggling favorite:', error);
        // Revert the change if storage failed
        chat.is_favorite = !chat.is_favorite;
        showNotification(
            `Failed to update favorite status for ${chat.name}`,
            'error',
        );
    } finally {
        // Remove loading state
        delete loadingFavorite.value[chat.id];
    }
}

async function markAsRead(chat) {
    console.log('Marking chat as read:', chat.name);

    // Set loading state
    loadingMarkRead.value[chat.id] = true;

    try {
        // Add a small delay for better visual feedback
        await new Promise((resolve) => setTimeout(resolve, 200));

        chat.unread_count = 0;

        // Here you could make an API call to mark as read
        // Example: await api.post(`/chats/${chat.id}/mark-read`);

        showNotification(`Marked ${chat.name} as read`, 'success');
    } catch (error) {
        console.error('Error marking as read:', error);
        showNotification(`Failed to mark ${chat.name} as read`, 'error');
    } finally {
        // Remove loading state
        delete loadingMarkRead.value[chat.id];
    }
}

async function archiveChat(chat) {
    console.log('Archiving chat:', chat.name);

    // Set loading state
    loadingArchive.value[chat.id] = true;

    try {
        // Add a small delay for better visual feedback
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Toggle archive status
        chat.is_archived = !chat.is_archived;

        // Save to local storage
        updateChatArchiveStatus(chat.id, chat.is_archived);

        console.log(
            `Chat ${chat.id} archive status saved to localStorage:`,
            chat.is_archived,
        );

        showNotification(
            `${chat.name} ${chat.is_archived ? 'archived' : 'unarchived'}`,
            'success',
        );
    } catch (error) {
        console.error('Error archiving chat:', error);
        // Revert the change if storage failed
        chat.is_archived = !chat.is_archived;
        showNotification(`Failed to archive ${chat.name}`, 'error');
    } finally {
        // Remove loading state
        delete loadingArchive.value[chat.id];
    }
}
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

    // Map all chats first
    const mappedChats = chats.map((chat) => ({
        gender: chat.gender ?? 'unknown',
        id: chat.id,
        is_active: chat.is_active ?? false,
        is_favorite: chat.is_favorite ?? false,
        is_archived: chat.is_archived ?? false,
        folder_id: chat.folder_id ?? null,
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
        member_count: chat.member_count ?? null,
    }));

    // Apply stored favorites and archived states from localStorage
    const allChats = applyStoredStates(mappedChats);

    // Filter individual users (private chats)
    users.value = allChats.filter(
        (chat) => chat.type === 'private' || chat.type === 'user' || !chat.type,
    );

    // Filter groups (groups, supergroups, channels)
    groups.value = allChats.filter(
        (chat) =>
            chat.type === 'group' ||
            chat.type === 'supergroup' ||
            chat.type === 'channel',
    );

    console.log(
        'Chat list updated via WebSocket:',
        users.value.length,
        'users,',
        groups.value.length,
        'groups',
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

            // Separate users and groups based on type
            const mappedChats = response.data.map((account) => ({
                gender: account.gender ?? 'unknown',
                id: account.id,
                is_active: account.is_active ?? false,
                is_favorite: account.is_favorite ?? false,
                is_archived: account.is_archived ?? false,
                folder_id: account.folder_id ?? null,
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
                member_count: account.member_count ?? null,
            }));

            // Apply stored favorites and archived states from localStorage
            const allChats = applyStoredStates(mappedChats);

            // Filter individual users (private chats)
            users.value = allChats.filter(
                (chat) =>
                    chat.type === 'private' ||
                    chat.type === 'user' ||
                    !chat.type,
            );

            // Filter groups (groups, supergroups, channels)
            groups.value = allChats.filter(
                (chat) =>
                    chat.type === 'group' ||
                    chat.type === 'supergroup' ||
                    chat.type === 'channel',
            );

            console.log('Processed users:', users.value.length);
            console.log('Processed groups:', groups.value.length);
        } else {
            console.warn('No data received from chat list API');
            users.value = [];
            groups.value = [];
        }
    } catch (err) {
        console.error('Error fetching chat list:', err);
        error.value = err.message || 'Failed to load chat list';
        users.value = [];
        groups.value = [];
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

<style scoped>
/* Custom scrollbar styles for chat list */
ul::-webkit-scrollbar {
    width: 6px;
}

ul::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
}

ul::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
}

ul::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

/* Smooth scrolling */
ul {
    scroll-behavior: smooth;
}

/* Ensure proper height calculation */
.chat-list-container {
    height: calc(100vh - 200px);
    min-height: 0;
}
</style>
