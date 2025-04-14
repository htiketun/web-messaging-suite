<template>
    <div
        class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
        <div
            class="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6 relative"
        >
            <h3 class="text-xl font-bold mb-4 text-blue-700">
                Add Telegram Account (QR)
            </h3>
            <div v-if="!loggedIn" class="flex flex-col items-center">
                <div v-if="qrSrc" class="mb-4">
                    <img
                        :src="qrSrc"
                        alt="Scan QR in Telegram app"
                        class="w-56 h-56 mx-auto rounded-xl border shadow"
                    />
                </div>
                <button
                    v-if="!qrSrc"
                    class="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg py-2 px-4 font-semibold hover:scale-105 transition mb-4"
                    @click="startQR"
                >
                    Show QR Code
                </button>
                <div v-if="polling" class="mt-2 text-blue-600 animate-pulse">
                    Waiting for scan...
                </div>
                <button
                    v-if="polling"
                    class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:scale-105 hover:shadow transition"
                    @click="
                        polling = false;
                        clearInterval(pollInterval);
                        qrSrc = '';
                        uniqueKey = Date.now();
                        startQR();
                    "
                >
                    refresh QR
                </button>
            </div>
            <div v-else class="text-green-600 font-bold text-lg text-center">
                Account added via QR!
            </div>
            <button
                class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
                @click="$emit('close')"
                title="Close"
            >
                ×
            </button>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { api } from '../api.js';
const emit = defineEmits(['added', 'close']);
const qrSrc = ref('');
const polling = ref(false);
const loggedIn = ref(false);
const uniqueKey = ref(Date.now()); // To reset component state if needed
let pollInterval;
async function startQR() {
    polling.value = true;
    qrSrc.value = '';

    await api
        .get('/telegram-accounts/qr-login?unique_key=' + uniqueKey.value, {
            responseType: 'arraybuffer',
        })
        .then((res) => {
            const mimeType = res.headers['content-type'] || 'image/png';
            const base64 = btoa(
                new Uint8Array(res.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    '',
                ),
            );
            qrSrc.value = `data:${mimeType};base64,${base64}`;
            pollInterval = setInterval(pollQR, 2000);
        });
}
async function pollQR() {
    await api
        .get('/telegram-accounts/qr-poll?unique_key=' + uniqueKey.value)
        .then((res) => {
            if (res.data.status === 'logged_in') {
                clearInterval(pollInterval);
                polling.value = false;
                loggedIn.value = true;
                emit('added', res.data.account);
            }
        })
        .catch(() => {
            // clearInterval(pollInterval);
            // polling.value = false;
            // qrSrc.value = '';
            // alert('QR session expired. Please try again.');
        });
}
</script>
<!-- Commit 200: 2025-10-09T16:44:10 -->
<!-- Commit 124: 2025-04-14T20:36:00 -->
