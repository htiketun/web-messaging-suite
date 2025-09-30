<template>
    <div
        class="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col"
    >
        <h3 class="text-lg font-semibold text-indigo-700 mb-4">
            {{ $t('dashboard.concurrentChats') }}
        </h3>

        <div
            class="mt-4 h-32 w-full bg-indigo-50 rounded flex items-center justify-center overflow-hidden chart-container"
        >
            <canvas
                ref="concurrentChatsCanvas"
                id="concurrentChatsChart"
                class="concurrent-chats-chart"
            ></canvas>
        </div>
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { ref, onMounted, watch } from 'vue';
// i18n
const { t, locale } = useI18n();
import Chart from 'chart.js/auto';
const concurrentChatsChartRef = ref(null);
const concurrentChatsCanvas = ref(null);

function renderChart() {
    const canvas = concurrentChatsCanvas.value;
    if (!canvas) return;
    const ctx7 = canvas.getContext('2d');
    if (concurrentChatsChartRef.value) {
        concurrentChatsChartRef.value.destroy();
    }
    concurrentChatsChartRef.value = new Chart(ctx7, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: t('dashboard.maxChats'),
                    data: [50, 60, 55, 70, 80, 75, 65],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99,102,241,0.08)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointBackgroundColor: '#6366f1',
                },
                {
                    label: t('dashboard.avgChats'),
                    data: [30, 35, 32, 40, 45, 42, 38],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16,185,129,0.08)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointBackgroundColor: '#10b981',
                },
            ],
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
<style scoped>
.chart-container {
    width: 100%;
    height: 100%;
    position: relative;
}
.concurrent-chats-chart {
    width: 100% !important;
    height: 100% !important;
    max-height: 200px;
}
</style>
