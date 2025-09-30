<template>
    <div
        class="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col gap-2"
    >
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-lg font-semibold text-green-700">
                    {{ $t('dashboard.typingSpeed') }}
                </h3>
                <p class="mt-2 text-3xl font-bold text-green-900">72 WPM</p>
                <span class="text-xs text-gray-400">{{
                    $t('dashboard.wpmPerAgent')
                }}</span>
            </div>
            <div
                class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center"
            >
                <svg
                    class="w-7 h-7 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 8v4l3 3" />
                    <circle cx="12" cy="12" r="10" />
                </svg>
            </div>
        </div>
        <div
            class="mt-2 h-32 bg-green-50 rounded flex items-center justify-center"
        >
            <canvas id="typingSpeedChart" height="40"></canvas>
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
const typingSpeedChartRef = ref(null);

// Typing Speed Chart
function renderChart() {
    const ctx2 = document.getElementById('typingSpeedChart').getContext('2d');
    if (typingSpeedChartRef.value) {
        typingSpeedChartRef.value.destroy();
    }
    typingSpeedChartRef.value = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: t('dashboard.wpm'),
                    data: [65, 70, 75, 72, 78, 74, 73],
                    backgroundColor: '#10b981',
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
                    ticks: { color: '#10b981', font: { size: 12 } },
                },
                y: {
                    display: true,
                    grid: { color: '#d1fae5', drawBorder: false },
                    ticks: {
                        color: '#10b981',
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
