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
                    <h2 class="text-3xl font-bold text-gray-900">
                        {{ $t('home.account_list') }}
                    </h2>
                    <p class="mt-2 text-sm text-indigo-600">
                        {{ $t('home.account_list_description') }}
                    </p>
                </div>

                <div class="flex flex-col mt-6 md:flex-row md:-mx-1 md:mt-0">
                    <button
                        class="px-6 py-3 focus:outline-none mt-4 text-white bg-blue-600 rounded-lg md:mt-0 md:mx-1 hover:bg-blue-700 transition-colors duration-200 shadow-md flex items-center gap-2"
                        @click="showModal = true"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        <span class="text-sm font-medium">
                            {{ $t('home.add_new_account') }}
                        </span>
                    </button>

                    <teleport to="body">
                        <transition name="fade">
                            <div
                                v-if="showModal"
                                class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
                            >
                                <div
                                    class="bg-white w-full max-w-md sm:max-w-lg md:w-1/3 h-auto max-h-[90vh] mx-2 sm:mx-4 rounded-xl shadow-2xl p-4 sm:p-8 relative flex flex-col justify-center animate-fadeIn overflow-y-auto"
                                >
                                    <button
                                        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                                        @click="showModal = false"
                                        aria-label="Close"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-6 w-6"
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

                                    <div
                                        class="flex flex-col sm:flex-row items-center justify-center gap-6"
                                    >
                                        <TGAccountAdd />
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </teleport>
                </div>
            </section>

            <AccountSection />
        </main>
    </div>
</template>

<script setup>
import AccountSection from './AccountSection.vue';
import Header from './layout/Header.vue';
import SidebarMenu from './layout/SidebarMenu.vue';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import TGAccountAdd from './telegram/TGAccountAdd.vue';

const { t } = useI18n();
const showModal = ref(false);
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.animate-fadeIn {
    animation: fadeIn 0.3s;
}
</style>
<!-- Commit 70: 2024-12-09T11:43:03 -->
<!-- Commit 94: 2025-02-03T15:20:24 -->
<!-- Commit 122: 2025-04-10T04:15:34 -->
