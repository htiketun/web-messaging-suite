<template>
    <div
        class="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col"
    >
        <h3
            class="text-xl font-bold text-indigo-800 mb-6 flex items-center gap-2"
        >
            <svg
                class="w-6 h-6 text-indigo-400"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
            >
                <path
                    d="M12 17l-5 3 1.9-5.6L4 10.5l5.7-.4L12 5l2.3 5.1 5.7.4-4.9 3.9L17 20z"
                />
            </svg>
            {{ $t('dashboard.agentLeaderboard') }}
        </h3>
        <table class="min-w-full text-sm rounded-lg overflow-hidden">
            <thead>
                <tr class="bg-indigo-100">
                    <th
                        class="px-4 py-3 text-left text-indigo-600 font-semibold"
                    >
                        #
                    </th>
                    <th
                        class="px-4 py-3 text-left text-indigo-600 font-semibold"
                    >
                        {{ $t('dashboard.agent') }}
                    </th>
                    <th
                        class="px-4 py-3 text-left text-indigo-600 font-semibold"
                    >
                        {{ $t('dashboard.chats') }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="hover:bg-indigo-50 transition">
                    <td class="px-4 py-3 font-bold text-indigo-700">1</td>
                    <td class="px-4 py-3 flex items-center gap-2">
                        <span
                            class="inline-block w-7 h-7 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-semibold"
                            >A</span
                        >
                        Alice
                        <span
                            class="ml-2 px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs font-medium"
                            >Top</span
                        >
                    </td>
                    <td class="px-4 py-3 font-semibold text-indigo-900">320</td>
                </tr>
                <tr class="hover:bg-indigo-50 transition">
                    <td class="px-4 py-3 font-bold text-indigo-700">2</td>
                    <td class="px-4 py-3 flex items-center gap-2">
                        <span
                            class="inline-block w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold"
                            >B</span
                        >
                        Bob
                    </td>
                    <td class="px-4 py-3 font-semibold text-indigo-900">295</td>
                </tr>
                <tr class="hover:bg-indigo-50 transition">
                    <td class="px-4 py-3 font-bold text-indigo-700">3</td>
                    <td class="px-4 py-3 flex items-center gap-2">
                        <span
                            class="inline-block w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold"
                            >C</span
                        >
                        Charlie
                    </td>
                    <td class="px-4 py-3 font-semibold text-indigo-900">270</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
