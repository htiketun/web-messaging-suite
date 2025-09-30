<template>
    <div
        class="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col"
    >
        <h3 class="text-lg font-semibold text-indigo-700 mb-4">
            {{ $t('dashboard.topKeywords') }}
        </h3>
        <div class="flex flex-wrap gap-2 font-small">
            <span
                v-for="kw in [
                    'support',
                    'login',
                    'payment',
                    'account',
                    'error',
                ]"
                :key="kw"
                class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                >{{ kw }}</span
            >
        </div>
        <div
            class="mt-4 h-auto bg-indigo-50 rounded flex items-center justify-center"
        >
            <canvas id="topKeywordsChart" height="85" width="200"></canvas>
        </div>
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { ref, onMounted, watch } from 'vue';
// i18n
const { t, locale } = useI18n();
// Chart.js for topKeywordsChart
import Chart from 'chart.js/auto';
const topKeywordsChartRef = ref(null);

function renderChart() {
    const ctx5 = document.getElementById('topKeywordsChart').getContext('2d');
    if (topKeywordsChartRef.value) {
        topKeywordsChartRef.value.destroy();
    }
    topKeywordsChartRef.value = new Chart(ctx5, {
        type: 'bar',
        data: {
            labels: ['support', 'login', 'payment', 'account', 'error'],
            datasets: [
                {
                    label: t('dashboard.topKeywords'),
                    data: [12, 19, 3, 5, 2],
                    backgroundColor: [
                        '#6366f1',
                        '#10b981',
                        '#f59e0b',
                        '#4f46e5',
                        '#ef4444',
                    ],
                    borderRadius: 8,
                    barPercentage: 0.7,
                },
            ],
        },
        options: {
            indexAxis: 'y', // horizontal bar
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.parsed.x}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    display: true,
                    grid: { color: '#e0e7ff', drawBorder: false },
                    ticks: {
                        color: '#6366f1',
                        font: { size: 12 },
                        stepSize: 5,
                    },
                },
                y: {
                    display: true,
                    grid: { display: false },
                    ticks: { color: '#6366f1', font: { size: 13 } },
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
