<template>
    <div
        class="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col"
    >
        <header class="w-full py-6 bg-blue-600 shadow-lg">
            <h1
                class="text-center text-3xl font-bold text-white tracking-wide drop-shadow-lg"
            >
                Telegram Multi-Account Messenger
            </h1>
        </header>
        <main class="flex-1 flex flex-col justify-center">
            <AccountList />
        </main>
        <footer
            class="w-full py-4 text-center bg-blue-50 text-gray-500 text-sm"
        >
            &copy; 2025 Telegram UI
        </footer>
    </div>
</template>

<script setup>
import AccountList from './AccountList.vue';
</script>
<!-- Commit 19: 2024-08-12T03:49:08 -->
<!-- Commit 151: 2025-06-17T00:13:52 -->
