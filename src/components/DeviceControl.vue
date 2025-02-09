<script setup lang="ts">
import { ref } from 'vue';
import DashboardCard from './DashboardCard.vue';

interface Device {
  id: number;
  name: string;
  type: string;
  status: boolean;
}

const devices = ref<Device[]>([
  { id: 1, name: 'Living Room Light', type: 'light', status: false },
  { id: 2, name: 'Kitchen Light', type: 'light', status: false },
  { id: 3, name: 'AC', type: 'ac', status: false },
  { id: 4, name: 'TV', type: 'tv', status: false },
]);

const toggleDevice = (device: Device) => {
  device.status = !device.status;
};
</script>

<template>
  <DashboardCard title="Device Control">
    <div class="grid grid-cols-2 gap-4">
      <div v-for="device in devices" :key="device.id" class="p-3 border rounded-lg">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">{{ device.name }}</p>
            <p class="text-sm text-gray-500">{{ device.status ? 'On' : 'Off' }}</p>
          </div>
          <button
            @click="toggleDevice(device)"
            :class="[
              'px-4 py-2 rounded-full transition-colors',
              device.status ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            ]"
          >
            {{ device.status ? 'On' : 'Off' }}
          </button>
        </div>
      </div>
    </div>
  </DashboardCard>
</template>