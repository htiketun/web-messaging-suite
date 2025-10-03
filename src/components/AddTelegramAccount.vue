<template>
    <div
        class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
        <div
            class="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6 relative"
        >
            <h3 class="text-xl font-bold mb-4 text-blue-700">
                Add Telegram Account (Phone)
            </h3>
            <form
                v-if="step === 1"
                @submit.prevent="startLogin"
                class="mb-3 flex flex-col gap-3"
            >
                <input
                    v-model="phone"
                    placeholder="Phone Number (+1234567890)"
                    required
                    class="border border-blue-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-300 transition"
                />
                <button
                    type="submit"
                    class="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg py-2 font-semibold hover:scale-105 transition"
                >
                    Send Code
                </button>
            </form>
            <form
                v-if="step === 2"
                @submit.prevent="confirmLogin"
                class="mb-3 flex flex-col gap-3"
            >
                <input
                    v-model="code"
                    placeholder="Code from Telegram"
                    required
                    class="border border-blue-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-300 transition"
                />
                <button
                    type="submit"
                    class="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg py-2 font-semibold hover:scale-105 transition"
                >
                    Confirm
                </button>
            </form>
            <button
                class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
                @click="$emit('close')"
                title="Close"
            >
                ×
            </button>
            <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { api } from '../api.js';
const emit = defineEmits(['added', 'close']);
const phone = ref('');
const code = ref('');
const step = ref(1);
const error = ref('');
const uniqueKey = ref(Date.now()); // To reset component state if needed
function startLogin() {
    api.post('/telegram-accounts/start-login', {
        phone: phone.value,
        unique_key: uniqueKey.value,
    })
        .then((response) => {
            step.value = 2;
            error.value = '';
        })
        .catch(() => {
            error.value = 'Failed to send code';
        });
}
function confirmLogin() {
    api.post('/telegram-accounts/confirm-login', {
        code: code.value,
        unique_key: uniqueKey.value,
    })
        .then(() => {
            step.value = 1;
            phone.value = '';
            code.value = '';
            error.value = '';
            emit('added');
            emit('close');
        })
        .catch(() => {
            error.value = 'Failed to confirm code';
        });
}
</script>
