<template>
    <div
        class="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col"
    >
        <h3 class="text-lg font-semibold text-indigo-700 mb-4">
            {{ $t('dashboard.chatsByHour') }}
        </h3>

        <div
            class="mt-4 h-auto bg-indigo-50 rounded flex items-center justify-center"
        >
            <canvas id="chatsByHourChart" height="auto"></canvas>
        </div>
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { ref, onMounted, watch } from 'vue';
// i18n
const { t, locale } = useI18n();
// Chart.js for chatsByHourChart
import Chart from 'chart.js/auto';
const chatsByHourChartRef = ref(null);
function renderChart() {
    const ctx6 = document.getElementById('chatsByHourChart').getContext('2d');
    if (chatsByHourChartRef.value) {
        chatsByHourChartRef.value.destroy();
    }
    chatsByHourChartRef.value = new Chart(ctx6, {
        type: 'line',
        data: {
            labels: [
                '12 AM',
                '1 AM',
                '2 AM',
                '3 AM',
                '4 AM',
                '5 AM',
                '6 AM',
                '7 AM',
                '8 AM',
                '9 AM',
                '10 AM',
                '11 AM',
                '12 PM',
                '1 PM',
                '2 PM',
                '3 PM',
                '4 PM',
                '5 PM',
                '6 PM',
                '7 PM',
                '8 PM',
                '9 PM',
                '10 PM',
                '11 PM',
            ],
            datasets: [
                {
                    label: t('dashboard.chats'),
                    data: [
                        5, 3, 2, 1, 0, 0, 4, 10, 20, 30, 40, 50, 60, 55, 50, 45,
                        40, 35, 30, 25, 20, 15, 10, 5,
                    ],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99,102,241,0.08)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 2,
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
                        stepSize: 10,
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
