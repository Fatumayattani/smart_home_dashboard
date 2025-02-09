<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import DashboardCard from './DashboardCard.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const temperature = ref(22.5);
const humidity = ref(45);

const chartData = ref({
  labels: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  datasets: [{
    label: 'Temperature (°C)',
    data: [21, 22, 22.5, 23, 22.8, 22.5],
    borderColor: '#3b82f6',
    tension: 0.4
  }]
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
};

// Simulate real-time updates
onMounted(() => {
  setInterval(() => {
    temperature.value = +(temperature.value + (Math.random() - 0.5)).toFixed(1);
    humidity.value = Math.min(100, Math.max(0, +(humidity.value + (Math.random() - 0.5)).toFixed(1)));
  }, 3000);
});
</script>

<template>
  <DashboardCard title="Temperature & Humidity">
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="text-center">
        <p class="text-3xl font-bold text-blue-500">{{ temperature }}°C</p>
        <p class="text-gray-600">Temperature</p>
      </div>
      <div class="text-center">
        <p class="text-3xl font-bold text-blue-500">{{ humidity }}%</p>
        <p class="text-gray-600">Humidity</p>
      </div>
    </div>
    <div class="h-48">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </DashboardCard>
</template>