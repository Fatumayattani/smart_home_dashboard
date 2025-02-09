<script setup lang="ts">
import { ref } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import DashboardCard from './DashboardCard.vue';

ChartJS.register(ArcElement, Tooltip, Legend);

const chartData = ref({
  labels: ['Lighting', 'HVAC', 'Appliances', 'Entertainment'],
  datasets: [{
    data: [25, 40, 20, 15],
    backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b']
  }]
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
};

const totalConsumption = ref(12.5);
</script>

<template>
  <DashboardCard title="Energy Consumption">
    <div class="text-center mb-4">
      <p class="text-3xl font-bold text-blue-500">{{ totalConsumption }} kWh</p>
      <p class="text-gray-600">Today's Consumption</p>
    </div>
    <div class="h-48">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </DashboardCard>
</template>