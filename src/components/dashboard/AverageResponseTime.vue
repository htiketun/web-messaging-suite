<template>
    <div
        class="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col gap-2"
    >
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-lg font-semibold text-yellow-700">
                    {{ $t('dashboard.avgResponseTime') }}
                </h3>
                <p class="mt-2 text-3xl font-bold text-yellow-900">1m 32s</p>
                <span class="text-xs text-gray-400">{{
                    $t('dashboard.timeToReply')
                }}</span>
            </div>
            <div
                class="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center"
            >
                <svg
                    class="w-7 h-7 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
            </div>
        </div>
        <div
            class="mt-2 h-32 bg-yellow-50 rounded flex items-center justify-center"
        >
            <canvas id="timeToReplyChart" height="40"></canvas>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
// i18n
const { t, locale } = useI18n();
// Chart.js for timeToReplyChart
import Chart from 'chart.js/auto';
const timeToReplyChartRef = ref(null);

onMounted(() => {
    const ctx3 = document.getElementById('timeToReplyChart').getContext('2d');
    timeToReplyChartRef.value = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: t('dashboard.minutes'),
                    data: [2.5, 2.0, 1.8, 1.6, 1.5, 1.7, 1.9],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245,158,11,0.08)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointBackgroundColor: '#f59e0b',
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
                    ticks: { color: '#f59e0b', font: { size: 12 } },
                },
                y: {
                    display: true,
                    grid: { color: '#fef3c7', drawBorder: false },
                    ticks: {
                        color: '#f59e0b',
                        font: { size: 12 },
                        stepSize: 0.5,
                    },
                },
            },
        },
    });
});

// watch(locale, (newLocale) => {
//     if (timeToReplyChartRef.value) {
//         timeToReplyChartRef.value.data.datasets[0].label =
//             t('dashboard.minutes');
//         timeToReplyChartRef.value.update();
//     }
// });
</script>
