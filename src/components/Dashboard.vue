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
                        {{ $t('dashboard.title') }}
                    </h2>
                    <p class="mt-2 text-sm text-indigo-600">
                        {{ $t('dashboard.description') }}
                    </p>
                </div>
            </section>

            <!-- Stats Cards -->
            <section
                class="grid grid-cols-1 min-h-[300px] gap-6 px-2 mt-8 md:grid-cols-2 xl:grid-cols-4"
            >
                <!-- Total Chats -->
                <TotalChats />
                <!-- Typing Speed -->
                <TypingSpeed />
                <!-- Average Response Time -->
                <AverageResponseTime />
                <!-- Sentiment Analysis -->
                <SentimentAnalysis />
            </section>

            <!-- Charts Section -->
            <section class="grid grid-cols-1 gap-6 mt-8 xl:grid-cols-3">
                <!-- Top Keywords -->
                <TopKeywords />
                <!-- Chats by Hour/Day -->
                <ChatsByHourDay />
                <!-- Concurrent Chats -->
                <ConcurrentChats />
            </section>

            <section class="grid grid-cols-1 gap-8 mt-10 xl:grid-cols-2">
                <!-- Agent Leaderboard -->
                <AgentLeaderboard />
                <!-- User Engagement -->
                <UserEngagement />
            </section>
        </main>
    </div>
</template>

<script setup>
import Header from './layout/Header.vue';
import SidebarMenu from './layout/SidebarMenu.vue';
import { useI18n } from 'vue-i18n';
// i18n
const { t } = useI18n();

import TotalChats from './dashboard/TotalChats.vue';
import ChatsByHourDay from './dashboard/ChatsByHourDay.vue';
import ConcurrentChats from './dashboard/ConcurrentChats.vue';
import TypingSpeed from './dashboard/TypingSpeed.vue';
import AverageResponseTime from './dashboard/AverageResponseTime.vue';
import SentimentAnalysis from './dashboard/SentimentAnalysis.vue';
import TopKeywords from './dashboard/TopKeywords.vue';
import AgentLeaderboard from './dashboard/AgentLeaderboard.vue';
import UserEngagement from './dashboard/UserEngagement.vue';
</script>
<!-- Commit 9: 2024-07-19T17:59:49 -->
