<template>
    <div
        class="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col gap-2"
    >
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-lg font-semibold text-indigo-700">
                    {{ $t('dashboard.totalChats') }}
                </h3>
                <p class="mt-2 text-3xl font-bold text-indigo-900">1,245</p>
                <span class="text-xs text-gray-400">{{
                    $t('dashboard.chatsPerDay')
                }}</span>
            </div>
            <div
                class="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center"
            >
                <svg
                    class="w-7 h-7 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
                    />
                </svg>
            </div>
        </div>
        <div
            class="mt-2 h-32 bg-indigo-50 rounded flex items-center justify-center"
        >
            <canvas id="totalChatsChart" height="40"></canvas>
        </div>
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { ref, onMounted, watch } from 'vue';

// i18n
const { t, locale } = useI18n();
// Chart.js for totalChatsChart
import Chart from 'chart.js/auto';

const totalChatsChartRef = ref(null);

function renderChart() {
    // Total Chats Chart
    const ctx = document.getElementById('totalChatsChart').getContext('2d');
    if (totalChatsChartRef.value) {
        totalChatsChartRef.value.destroy();
    }
    totalChatsChartRef.value = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: t('dashboard.chats'),
                    data: [180, 210, 190, 220, 250, 200, 195],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99,102,241,0.08)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointBackgroundColor: '#6366f1',
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
            },
            scales: {
                x: {
                    display: true,
                    grid: { display: false },
                    ticks: { color: '#6366f1', font: { size: 12 } },
                },
                y: {
                    display: true,
                    grid: { color: '#e0e7ff', drawBorder: false },
                    ticks: {
                        color: '#6366f1',
                        font: { size: 12 },
                        stepSize: 50,
                    },
                },
            },
        },
    });
}
onMounted(() => {
    renderChart();
});

watch(locale, () => {
    renderChart();
});
</script>
