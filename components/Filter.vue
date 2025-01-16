<template>
    <div class="relative flex justify-end">
        <button @click="toggleFilter" class="p-2 bg-tggray-50 border-tggray-50 text-white rounded">篩選</button>
        <div v-if="showFilter" class="fixed inset-0 flex items-center justify-center bg-tggray-100 rounded-xl bg-opacity-50 z-50" @click.self="toggleFilter">
            <div class="bg-tggray-100 border bg-tggray-50 shadow p-6 w-120 relative">
                <button @click="toggleFilter" class="absolute top-2 right-2 h-8 w-8 flex items-center justify-center text-lg font-bold bg-tggray-100 rounded-md"> × </button>
                <div class="space-x-4 flex justify-around">
                    <div v-for="(options, category) in filters" :key="category" class="border-b border-gray-300 pb-4">
                        <h3 class="mb-2 text-lg font-bold">{{ category }}</h3>
                        <div class="grid grid-cols-1 gap-2">
                            <div v-for="option in options" :key="option.value" class="flex items-center">
                                <input type="checkbox" :id="option.value" :value="option.value"
                                    v-model="selectedFilters[category]" class="mr-2" />
                                <label :for="option.value" class="text-sm">{{ option.label }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <button @click="emitFilters" class="w-full p-2 bg-tggray-100 text-white rounded">應用篩選</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
const emit = defineEmits(['update:filter']);

const showFilter = ref(false);
const filters = ref({
    MyGO集數: [
        { label: '1', value: 'mygo_1' },
        { label: '2', value: 'mygo_2' },
        { label: '3', value: 'mygo_3' },
        { label: '4', value: 'mygo_4' },
        { label: '5', value: 'mygo_5' },
        { label: '6', value: 'mygo_6' },
        { label: '7', value: 'mygo_7' },
        { label: '8', value: 'mygo_8' },
        { label: '9', value: 'mygo_9' },
        { label: '10', value: 'mygo_10' },
        { label: '11', value: 'mygo_11' },
        { label: '12', value: 'mygo_12' },
        { label: '13', value: 'mygo_13' },
    ],
    AveMujica集數: [
        { label: '1', value: 'mujica_1' },
        { label: '2', value: 'mujica_2' },
        { label: '3', value: 'mujica_3' },
        { label: '4', value: 'mujica_4' },
        { label: '5', value: 'mujica_5' },
        { label: '6', value: 'mujica_6' },
        { label: '7', value: 'mujica_7' },
        { label: '8', value: 'mujica_8' },
        { label: '9', value: 'mujica_9' },
        { label: '10', value: 'mujica_10' },
        { label: '11', value: 'mujica_11' },
        { label: '12', value: 'mujica_12' },
        { label: '13', value: 'mujica_13' },
    ],
    MyGO人物: [
        { label: '燈', value: '燈' },
        { label: '愛音', value: '愛音' },
        { label: '立希', value: '立希' },
        { label: '爽世', value: '爽世' },
        { label: '樂奈', value: '樂奈' },
        { label: '初華', value: '初華' },
        { label: '海鈴', value: '海鈴' },
        { label: '祥子', value: '祥子' },
        { label: '睦', value: '睦' },
        { label: '喵夢', value: '喵夢' },
    ]
});

const selectedFilters = ref({
    MyGO集數: [],
    AveMujica集數: [],
    MyGO人物: [],
});

const toggleFilter = () => {
    showFilter.value = !showFilter.value;
};

const applyFilters = () => {
    console.log('Applied Filters:', selectedFilters.value);
    toggleFilter();
};

const emitFilters = () => {
    emit('update:filter', selectedFilters.value);
    toggleFilter();
};
</script>
