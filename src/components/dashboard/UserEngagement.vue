<template>
    <div
        class="p-6 bg-gradient-to-br from-pink-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col"
    >
        <h3
            class="text-xl font-bold text-pink-700 mb-6 flex items-center gap-2"
        >
            <svg
                class="w-6 h-6 text-pink-400"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
            >
                <path
                    d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87M16 3.13a4 4 0 0 1 0 7.75M8 3.13a4 4 0 0 0 0 7.75"
                />
            </svg>
            {{ $t('dashboard.userEngagement') }}
        </h3>
        <table class="min-w-full text-sm rounded-lg overflow-hidden">
            <thead>
                <tr class="bg-pink-100">
                    <th class="px-4 py-3 text-left text-pink-600 font-semibold">
                        {{ $t('dashboard.user') }}
                    </th>
                    <th class="px-4 py-3 text-left text-pink-600 font-semibold">
                        {{ $t('dashboard.messages') }}
                    </th>
                    <th class="px-4 py-3 text-left text-pink-600 font-semibold">
                        {{ $t('dashboard.chats') }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="hover:bg-pink-50 transition">
                    <td class="px-4 py-3 flex items-center gap-2">
                        <span
                            class="inline-block w-7 h-7 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center font-semibold"
                            >U</span
                        >
                        user_123
                    </td>
                    <td class="px-4 py-3 font-semibold text-pink-900">58</td>
                    <td class="px-4 py-3 font-semibold text-pink-900">12</td>
                </tr>
                <tr class="hover:bg-pink-50 transition">
                    <td class="px-4 py-3 flex items-center gap-2">
                        <span
                            class="inline-block w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-semibold"
                            >U</span
                        >
                        user_456
                    </td>
                    <td class="px-4 py-3 font-semibold text-pink-900">44</td>
                    <td class="px-4 py-3 font-semibold text-pink-900">9</td>
                </tr>
                <tr class="hover:bg-pink-50 transition">
                    <td class="px-4 py-3 flex items-center gap-2">
                        <span
                            class="inline-block w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-semibold"
                            >U</span
                        >
                        user_789
                    </td>
                    <td class="px-4 py-3 font-semibold text-pink-900">39</td>
                    <td class="px-4 py-3 font-semibold text-pink-900">7</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
