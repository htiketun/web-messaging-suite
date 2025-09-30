<template>
    <aside class="h-full p-6 bg-white flex flex-col">
        <div class="flex flex-col items-center mb-6">
            <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                class="w-20 h-20 rounded-full mb-2"
            />
            <div class="font-semibold text-lg">Mohammad Ali</div>
            <div class="text-gray-500 text-sm flex items-center space-x-2 mt-1">
                <span>California, USA</span>
            </div>
            <div class="mt-2 text-blue-500 flex items-center space-x-3">
                <a href="tel:888456789">
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 5a2 2 0 012-2h3.28a2 2 0 011.94 1.42l1.38 4.14a2 2 0 01-.45 2.09l-2.23 2.23a16.013 16.013 0 006.6 6.6l2.23-2.23a2 2 0 012.09-.45l4.14 1.38A2 2 0 0121 18.72V22a2 2 0 01-2 2h-1C6.477 24 0 17.523 0 9V8a2 2 0 012-2h1z"
                        />
                    </svg>
                </a>
                <a href="#">
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 12H8m8 0a8 8 0 11-16 0 8 8 0 0116 0z"
                        />
                    </svg>
                </a>
                <a href="#">
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2m3-4h4a2 2 0 012 2v4H7V6a2 2 0 012-2z"
                        />
                    </svg>
                </a>
            </div>
        </div>
        <input
            type="text"
            placeholder="Search in conversation"
            class="mb-4 px-3 py-2 rounded bg-gray-100 border-none"
        />
        <!-- Attachments -->
        <div class="mb-4">
            <div class="font-semibold mb-2">
                Attachments
                <span class="text-xs text-gray-400"
                    >({{ attachments.length }})</span
                >
            </div>
            <ul>
                <li
                    v-for="file in attachments"
                    :key="file.id"
                    class="flex items-center space-x-2 mb-1 text-sm"
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                        class="w-4 h-4"
                    />
                    <span>{{ file.name }}</span>
                    <span class="ml-auto text-gray-400"
                        >{{ file.pages }}p • {{ file.type }}</span
                    >
                </li>
            </ul>
        </div>
        <!-- Notes, Tasks, Meetings, Deals -->
        <div class="space-y-2">
            <div>Notes <span class="text-xs text-gray-400 ml-1">4</span></div>
            <div>Task <span class="text-xs text-gray-400 ml-1">14</span></div>
            <div>
                Meetings <span class="text-xs text-gray-400 ml-1">6</span>
            </div>
            <div>Deals <span class="text-xs text-gray-400 ml-1">2</span></div>
        </div>
    </aside>
</template>

<script setup>
const attachments = [
    { id: 1, name: 'problem-statement.pdf', pages: 12, type: 'pdf' },
    { id: 2, name: 'passport.pdf', pages: 2, type: 'pdf' },
    { id: 3, name: 'passport-scans.pdf', pages: 1, type: 'pdf' },
    { id: 4, name: 'how-to-edit.pdf', pages: 4, type: 'pdf' },
];
</script>
