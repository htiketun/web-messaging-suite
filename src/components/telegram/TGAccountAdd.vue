<template>
    <div
        class="max-w-md mx-auto p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl mt-4 sm:mt-10 border border-blue-100 w-full"
    >
        <h2
            class="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center text-blue-800 tracking-tight drop-shadow"
        >
            <span class="inline-flex items-center gap-2">
                <svg
                    class="w-7 h-7 sm:w-8 sm:h-8 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 240 240"
                >
                    <g>
                        <circle cx="120" cy="120" r="120" fill="#37aee2" />
                        <circle cx="120" cy="120" r="100" fill="#fff" />
                        <path
                            d="M179.7 77.6l-22.7 107.3c-1.7 7.7-6.2 9.6-12.6 6l-35-25.8-16.9 16.3c-1.9 1.9-3.5 3.5-7.1 3.5l2.5-35.2 64-57.8c2.8-2.5-0.6-3.9-4.3-1.4l-79.1 49.8-34.1-10.7c-7.4-2.3-7.6-7.4 1.6-10.9l133.2-51.4c6.2-2.3 11.6 1.5 9.6 10.5z"
                            fill="#37aee2"
                        />
                        <path
                            d="M97.7 175.1c2.7 0 3.9-1.2 5.4-2.7l13-12.6-16.1-12.2"
                            fill="#c8daea"
                        />
                        <path
                            d="M130.5 184.9c2.3 0 4.7-0.7 6.8-2.1l-21.8-16.1-10.5 10.1"
                            fill="#b0c4d6"
                        />
                    </g>
                </svg>
                <span style="color: #229ed9">Add Telegram Account</span>
            </span>
        </h2>
        <div v-if="step === 'account'" class="flex flex-col items-center">
            <button
                @click="startLogin"
                :disabled="loading.startLogin"
                class="mt-6 w-full sm:w-2/3 text-base sm:text-lg font-semibold shadow-md transition hover:scale-105 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#37aee2] to-[#229ed9] text-white border-2 border-[#229ed9] hover:from-[#229ed9] hover:to-[#37aee2] hover:border-[#37aee2] focus:outline-none focus:ring-2 focus:ring-[#37aee2]"
            >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 240 240">
                    <g>
                        <circle cx="120" cy="120" r="120" fill="#37aee2" />
                        <circle cx="120" cy="120" r="100" fill="#fff" />
                        <path
                            d="M179.7 77.6l-22.7 107.3c-1.7 7.7-6.2 9.6-12.6 6l-35-25.8-16.9 16.3c-1.9 1.9-3.5 3.5-7.1 3.5l2.5-35.2 64-57.8c2.8-2.5-0.6-3.9-4.3-1.4l-79.1 49.8-34.1-10.7c-7.4-2.3-7.6-7.4 1.6-10.9l133.2-51.4c6.2-2.3 11.6 1.5 9.6 10.5z"
                            fill="#37aee2"
                        />
                        <path
                            d="M97.7 175.1c2.7 0 3.9-1.2 5.4-2.7l13-12.6-16.1-12.2"
                            fill="#c8daea"
                        />
                        <path
                            d="M130.5 184.9c2.3 0 4.7-0.7 6.8-2.1l-21.8-16.1-10.5 10.1"
                            fill="#b0c4d6"
                        />
                    </g>
                </svg>
                <span class="font-semibold" v-if="!loading.startLogin"
                    >Start Login</span
                >
                <span class="font-semibold" v-else>Loading...</span>
            </button>
        </div>
        <div v-else-if="step === 'qr'" class="flex flex-col items-center">
            <p
                class="mb-3 text-center text-blue-700 font-medium text-base sm:text-lg"
            >
                Scan this QR code with Telegram:
            </p>
            <div
                class="flex justify-center mb-4 bg-white rounded-xl shadow-lg p-2 sm:p-4 border border-blue-100"
            >
                <img
                    :src="`data:image/svg+xml;utf8,${encodeURIComponent(
                        qrSvg,
                    )}`"
                    alt="Telegram QR Code"
                    class="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-lg border-2 border-blue-200 shadow"
                />
            </div>
            <div class="mb-2 text-center text-gray-500 text-xs sm:text-sm">
                <span>Having trouble?</span>
                <button
                    @click="step = 'phone'"
                    class="inline-flex items-center gap-1 underline text-blue-600 ml-1 font-semibold hover:text-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-200 rounded"
                >
                    Try phone login
                </button>
            </div>
            <p class="text-xs text-gray-500 text-center">
                <span v-if="!qrExpired">Expires at: </span>
                <span
                    class="font-mono font-semibold text-blue-700"
                    :class="{ 'line-through': qrExpired }"
                    >{{ expires_at }}</span
                >
                <span v-if="qrExpired">
                    <button
                        @click="refreshQr"
                        :disabled="loading.refreshQr"
                        class="underline ml-2 text-blue-600 font-semibold hover:text-blue-800 transition"
                    >
                        <span v-if="!loading.refreshQr">Refresh QR</span>
                        <span v-else>Loading...</span>
                    </button>
                </span>
            </p>
        </div>
        <div v-else-if="step === 'phone'" class="flex flex-col gap-2">
            <label
                class="block mb-1 font-semibold text-blue-700 text-xs sm:text-sm"
                >Phone Number</label
            >
            <div class="relative flex items-center">
                <input
                    v-model="phone"
                    class="input focus:ring-2 focus:ring-blue-300 pl-8 pr-4 text-base sm:text-lg tracking-wide placeholder-gray-400 focus:border-white focus:!border-blue-300"
                    inputmode="tel"
                    autocomplete="tel"
                    placeholder="+1234567890"
                    maxlength="15"
                    :style="{ letterSpacing: '0.07em', boxShadow: 'none' }"
                    @keyup.enter="submitPhone"
                />
            </div>
            <button
                @click="submitPhone"
                :disabled="loading.submitPhone"
                class="btn mt-4 w-full text-base sm:text-lg font-semibold shadow-md transition hover:scale-105"
            >
                <span class="inline-flex items-center gap-2">
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="2"
                            fill="none"
                        />
                        <path
                            d="M8 12l2 2l4-4"
                            stroke="currentColor"
                            stroke-width="2"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    <span v-if="!loading.submitPhone">Send Code</span>
                    <span v-else>Loading...</span>
                </span>
            </button>
            <button
                @click="
                    step = 'qr';
                    qrExpired = false;
                    startLogin();
                "
                class="mt-2 w-full text-sm text-blue-600 font-semibold hover:text-blue-800 transition underline flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded"
            >
                Back
            </button>
        </div>
        <div v-else-if="step === 'code'" class="flex flex-col gap-2">
            <label
                class="block mb-1 font-semibold text-blue-700 text-xs sm:text-sm"
                >Enter Code</label
            >
            <div class="flex items-center gap-1 sm:gap-2 justify-center">
                <input
                    v-for="(_, idx) in 5"
                    :key="idx"
                    v-model="codeDigits[idx]"
                    ref="codeInputs"
                    maxlength="1"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    class="input focus:ring-2 focus:ring-blue-300 text-center text-xl sm:text-2xl font-mono w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 border-2 border-blue-200 rounded-xl shadow-inner"
                    :placeholder="idx === 0 ? '-' : '-'"
                    autocomplete="one-time-code"
                    @input="onCodeInput(idx, $event)"
                    @keydown.backspace="onCodeBackspace(idx, $event)"
                    @keyup.enter="submitCode"
                />
            </div>
            <button
                @click="submitCode"
                :disabled="loading.submitCode"
                class="btn mt-4 w-full text-base sm:text-lg font-semibold shadow-md transition hover:scale-105"
            >
                <span class="inline-flex items-center gap-2">
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    <span v-if="!loading.submitCode">Verify Code</span>
                    <span v-else>Loading...</span>
                </span>
            </button>
            <button
                @click="
                    step = 'phone';
                    codeDigits = ['', '', '', '', ''];
                    $refs.codeInputs[0].focus();
                "
                class="mt-2 w-full text-sm text-blue-600 font-semibold hover:text-blue-800 transition underline flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded"
            >
                Back
            </button>
        </div>
        <div v-else-if="step === 'password'" class="flex flex-col gap-2">
            <label
                class="block mb-1 font-semibold text-blue-700 text-xs sm:text-sm"
                >2FA Password</label
            >
            <div class="relative">
                <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="input focus:ring-2 focus:ring-blue-300 pr-10 text-base sm:text-lg"
                    placeholder="Your 2FA Password"
                    @keyup.enter="submitPassword"
                    style="letter-spacing: 0.8em"
                />
                <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 focus:outline-none"
                    tabindex="-1"
                >
                    <svg
                        v-if="showPassword"
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
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938M3 3l18 18"
                        />
                    </svg>
                    <svg
                        v-else
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7-2s-4-7-10-7-10 7-10 7 4 7 10 7 10-7 10-7z"
                        />
                    </svg>
                </button>
                <button
                    @click="
                        step = 'code';
                        password = '';
                        $refs.codeInputs[0].focus();
                    "
                    class="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600 font-semibold hover:text-blue-800 transition underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded"
                >
                    Back
                </button>
                <button
                    @click="
                        step = 'code';
                        password = '';
                        $refs.codeInputs[0].focus();
                    "
                    class="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600 font-semibold hover:text-blue-800 transition underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7-2s-4-7-10-7-10 7-10 7 4 7 10 7 10-7 10-7z"
                        />
                    </svg>
                </button>
            </div>
            <button
                @click="submitPassword"
                class="btn mt-4 w-full text-base sm:text-lg font-semibold shadow-md transition hover:scale-105"
                :disabled="loading.submitPassword"
            >
                <span class="inline-flex items-center gap-2">
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    <span v-if="!loading.submitPassword">Submit</span>
                    <span v-else>Loading...</span>
                </span>
            </button>
            <button
                @click="
                    step = 'phone';
                    password = '';
                    $refs.codeInputs[0].focus();
                "
                class="mt-2 w-full text-sm text-blue-600 font-semibold hover:text-blue-800 transition underline flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded"
            >
                Back
            </button>
        </div>
        <div v-else-if="step === 'signup'" class="flex flex-col gap-2">
            <label class="block mb-1 font-semibold text-blue-700 text-sm"
                >First Name</label
            >
            <input
                v-model="firstName"
                class="input focus:ring-2 focus:ring-blue-300"
            />
            <label class="block mb-1 mt-2 font-semibold text-blue-700 text-sm"
                >Last Name</label
            >
            <input
                v-model="lastName"
                class="input focus:ring-2 focus:ring-blue-300"
            />
            <button
                @click="submitSignup"
                :disabled="loading.submitSignup"
                class="btn mt-4 w-full text-lg font-semibold shadow-md transition hover:scale-105"
            >
                <span class="inline-flex items-center gap-2">
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    <span v-if="!loading.submitSignup">Sign Up</span>
                    <span v-else>Loading...</span>
                </span>
            </button>
            <button
                @click="
                    step = 'phone';
                    firstName = '';
                    lastName = '';
                "
                class="mt-2 w-full text-sm text-blue-600 font-semibold hover:text-blue-800 transition underline flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded"
            >
                Back
            </button>
        </div>
        <div v-else-if="step === 'done'" class="flex flex-col items-center">
            <div class="bg-green-100 rounded-full p-4 mb-3 shadow">
                <svg
                    class="w-16 h-16 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>
            <p class="text-green-700 font-bold text-xl text-center drop-shadow">
                Account added successfully!
            </p>
            <button
                @click="$emit('done')"
                class="mt-6 w-full sm:w-2/3 text-base sm:text-lg font-semibold shadow-md transition hover:scale-105 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white border-2 border-green-600 hover:from-green-600 hover:to-green-500 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
                Done
            </button>
        </div>
        <transition name="fade">
            <div
                v-if="error"
                class="text-red-600 mt-6 text-center bg-red-50 rounded-lg p-3 border border-red-200 font-semibold shadow"
            >
                {{ error }}
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onUnmounted, watch } from 'vue';
import api from '../../api.js';
const step = ref('account'); // 'account', 'qr', 'phone', 'code', 'password', 'signup', 'done'
const qrSvg = ref('');
const expires_at = ref(null);
const phone = ref('');
const code = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');
const error = ref('');
let generatedAccountId = '';
const qrExpired = ref(false);
const codeDigits = ref(['', '', '', '', '']);
const codeInputs = ref([]);
const showPassword = ref(false);
// Add loading states
const loading = ref({
    startLogin: false,
    submitPhone: false,
    submitCode: false,
    submitPassword: false,
    submitSignup: false,
    refreshQr: false,
});

//watch step to clear error
watch(step, () => {
    if (step.value == 'phone') {
        phone.value = '';
        code.value = '';
        codeDigits.value = ['', '', '', '', ''];
        //focus first input
        setTimeout(() => {
            if (codeInputs.value.length > 0) {
                codeInputs.value[0].focus();
            }
        }, 100);
        password.value = '';
        showPassword.value = false;
        firstName.value = '';
        lastName.value = '';
    }
});

onBeforeUnmount(() => {
    if (window.qrTimer) clearInterval(window.qrTimer);
    if (pollTimer) clearTimeout(pollTimer);
});

onUnmounted(() => {
    if (window.qrTimer) clearInterval(window.qrTimer);
    if (pollTimer) clearTimeout(pollTimer);
});

function onCodeInput(idx, event) {
    const value = event.target.value;
    if (/^\d$/.test(value)) {
        codeDigits.value[idx] = value;
        if (idx < codeDigits.value.length - 1) {
            codeInputs.value[idx + 1].focus();
        }
    } else {
        codeDigits.value[idx] = '';
    }

    code.value = codeDigits.value.join('');
}

function onCodeBackspace(idx, event) {
    if (event.key === 'Backspace' && !codeDigits.value[idx] && idx > 0) {
        codeInputs.value[idx - 1].focus();
    }
}

let pollTimer = null;

async function startLogin() {
    if (loading.value.startLogin) return;
    loading.value.startLogin = true;
    error.value = '';
    try {
        const { data } = await api.post('/auth/telegram/start-login/', {
            account_id: generatedAccountId,
        });
        generatedAccountId = data.account_id;
        if (data.status === 'show_qr') {
            qrSvg.value = data.qrSvg;
            step.value = 'qr';
            expires_at.value = data.expires_at;
            if (window.qrTimer) clearInterval(window.qrTimer);
            let diff = data.expires_at;
            qrExpired.value = false;
            window.qrTimer = setInterval(() => {
                diff--;
                if (diff <= 0) {
                    qrExpired.value = true;
                    clearInterval(window.qrTimer);
                    expires_at.value = 'Expired';
                    clearTimeout(pollTimer);
                } else {
                    const m = Math.floor(diff / 60)
                        .toString()
                        .padStart(2, '0');
                    const s = (diff % 60).toString().padStart(2, '0');
                    expires_at.value = `${m}:${s}`;
                }
            }, 1000);
            pollTimer = setTimeout(pollLoginStatus, 2000);
        } else if (data.status === 'need_password') {
            step.value = 'password';
        } else if (data.status === 'already_logged_in') {
            step.value = 'done';
        } else if (data.status === 'need_phone') {
            step.value = 'phone';
        }
    } catch (e) {
        clearTimeout(pollTimer);
        clearInterval(window.qrTimer);
        qrExpired.value = false;
        step.value = 'phone';
        error.value = e.response?.data?.message || 'Failed to start login';
    } finally {
        loading.value.startLogin = false;
    }
}

async function pollLoginStatus() {
    if (pollTimer) clearTimeout(pollTimer);
    try {
        const { data } = await api.post('/auth/telegram/check-login/', {
            account_id: generatedAccountId,
        });
        if (data.status === 'logged_in') {
            step.value = 'done';
        } else if (data.status === 'need_password') {
            step.value = 'password';
        } else if (data.status === 'expired') {
            qrExpired.value = true;
            expires_at.value = 'Expired';
            clearInterval(window.qrTimer);
            clearTimeout(pollTimer);
            error.value = 'QR code expired. Please refresh.';
        } else if (data.status === 'waiting_for_qr') {
            if (step.value === 'qr') {
                pollTimer = setTimeout(pollLoginStatus, 2000);
            }
        } else {
            clearTimeout(pollTimer);
            clearInterval(window.qrTimer);
            qrExpired.value = false;
            step.value = 'phone';
            clearTimeout(pollTimer);
        }
    } catch (e) {
        clearTimeout(pollTimer);
        clearInterval(window.qrTimer);
        qrExpired.value = false;
        step.value = 'phone';
        clearTimeout(pollTimer);
    }
}

async function refreshQr() {
    if (loading.value.refreshQr) return;
    loading.value.refreshQr = true;
    qrExpired.value = false;
    await startLogin();
    loading.value.refreshQr = false;
}

async function submitPhone() {
    if (loading.value.submitPhone) return;
    loading.value.submitPhone = true;
    error.value = '';
    try {
        const { data } = await api.post('/auth/telegram/submit-phone/', {
            account_id: generatedAccountId,
            phone: phone.value,
        });
        generatedAccountId = data.account_id;
        step.value = 'code';
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to send code';
    } finally {
        loading.value.submitPhone = false;
    }
}

async function submitCode() {
    if (loading.value.submitCode) return;
    loading.value.submitCode = true;
    error.value = '';
    try {
        const { data } = await api.post('/auth/telegram/submit-code/', {
            account_id: generatedAccountId,
            code: code.value,
        });
        if (data.status === 'need_password') {
            step.value = 'password';
        } else if (data.status === 'need_signup') {
            step.value = 'signup';
        } else if (data.status === 'logged_in') {
            step.value = 'done';
        }
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to verify code';
    } finally {
        loading.value.submitCode = false;
    }
}

async function submitPassword() {
    if (loading.value.submitPassword) return;
    loading.value.submitPassword = true;
    error.value = '';
    try {
        await api.post('/auth/telegram/submit-password/', {
            account_id: generatedAccountId,
            password: password.value,
        });
        step.value = 'done';
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to verify password';
    } finally {
        loading.value.submitPassword = false;
    }
}

async function submitSignup() {
    if (loading.value.submitSignup) return;
    loading.value.submitSignup = true;
    error.value = '';
    try {
        await api.post('/auth/telegram/submit-signup/', {
            account_id: generatedAccountId,
            first_name: firstName.value,
            last_name: lastName.value,
        });
        step.value = 'done';
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to sign up';
    } finally {
        loading.value.submitSignup = false;
    }
}
</script>
<style scoped>
.input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
}
.btn {
    width: 100%;
    padding: 0.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
}
.btn:hover {
    background-color: #2563eb;
}
</style>
