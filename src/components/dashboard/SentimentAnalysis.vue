<template>
    <div
        class="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col gap-2"
    >
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-lg font-semibold text-pink-700">
                    {{ $t('dashboard.sentiment') }}
                </h3>
                <p class="mt-2 text-3xl font-bold text-pink-900">68% 😊</p>
                <span class="text-xs text-gray-400">{{
                    $t('dashboard.positiveSplit')
                }}</span>
            </div>
            <div
                class="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center"
            >
                <svg
                    class="w-7 h-7 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 15s1.5 2 4 2 4-2 4-2" />
                    <path d="M9 9h.01M15 9h.01" />
                </svg>
            </div>
        </div>
        <div
            class="mt-2 h-32 bg-pink-50 rounded flex items-center justify-center"
        >
            <canvas id="sentimentAnalysisChart" height="40"></canvas>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
// i18n
const { t, locale } = useI18n();
// Chart.js for sentimentAnalysisChart
import Chart from 'chart.js/auto';
const sentimentAnalysisChartRef = ref(null);
function renderChart() {
    const ctx4 = document
        .getElementById('sentimentAnalysisChart')
        .getContext('2d');
    if (sentimentAnalysisChartRef.value) {
        sentimentAnalysisChartRef.value.destroy();
    }
    sentimentAnalysisChartRef.value = new Chart(ctx4, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: t('dashboard.sentiment'),
                    data: [0.8, 0.7, 0.9, 0.6, 0.5, 0.7, 0.8],
                    backgroundColor: '#f472b6',
                    borderRadius: 6,
                    barPercentage: 0.6,
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
                    ticks: { color: '#f472b6', font: { size: 12 } },
                },
                y: {
                    display: true,
                    grid: { color: '#fce7f3', drawBorder: false },
                    ticks: {
                        color: '#f472b6',
                        font: { size: 12 },
                        stepSize: 0.2,
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
