<script setup lang="ts">
import TemperatureWidget from './components/TemperatureWidget.vue'
import DeviceControl from './components/DeviceControl.vue'
import EnergyConsumption from './components/EnergyConsumption.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Smart Home Dashboard</h1>
      <p class="text-gray-600">Monitor and control your smart home devices</p>
    </header>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TemperatureWidget />
      <DeviceControl />
      <EnergyConsumption />
    </div>
  </div>
</template>