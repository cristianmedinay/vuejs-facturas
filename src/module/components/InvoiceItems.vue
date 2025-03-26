<template>
<div class="card mb-4">
    <div class="card-header bg-success text-white">
    <h2>Conceptos</h2>
    </div>
    <div class="card-body">
    <div v-for="(item, index) in items" :key="index" class="mb-4 p-3 border rounded">
        <div class="row g-3">
        <div class="col-md-6">
            <label :for="`description-${index}`" class="form-label">Descripción</label>
            <input
            v-model="item.description"
            type="text"
            class="form-control"
            :id="`description-${index}`"
            :class="{ 'is-invalid': errors[index]?.description }"
            @input="updateItem(index)"
            >
            <div class="invalid-feedback">{{ errors[index]?.description }}</div>
        </div>
        <div class="col-md-2">
            <label :for="`unitPrice-${index}`" class="form-label">Precio Unitario (€)</label>
            <input
            v-model.number="item.unitPrice"
            type="number"
            min="0"
            step="0.01"
            class="form-control"
            :id="`unitPrice-${index}`"
            @input="updateItem(index)"
            >
        </div>
        <div class="col-md-2">
            <label :for="`units-${index}`" class="form-label">Unidades</label>
            <input
            v-model.number="item.units"
            type="number"
            min="1"
            class="form-control"
            :id="`units-${index}`"
            @input="updateItem(index)"
            >
        </div>
        <div class="col-md-2">
            <label :for="`vatRate-${index}`" class="form-label">IVA (%)</label>
            <select
            v-model.number="item.vatRate"
            class="form-select"
            :id="`vatRate-${index}`"
            @change="updateItem(index)"
            >
            <option value="21">21%</option>
            <option value="10">10%</option>
            <option value="4">4%</option>
            <option value="0">0%</option>
            </select>
        </div>
        </div>
        <div class="mt-2">
        <button 
            v-if="items.length > 1"
            @click="removeItem(index)"
            class="btn btn-danger btn-sm"
        >
            Eliminar
        </button>
        </div>
    </div>
    
    <button @click="addItem" class="btn btn-primary mt-3">
        Añadir Concepto
    </button>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'InvoiceItems',
    data() {
        return {};
    },
    props: {
    items: {
      type: Array,
      required: true
    },
    errors: {
        type: Array as () => Array<{ description?: string }>,
        required: true
    }
    },

    components: {},

    emits: ['add-item', 'remove-item', 'update:items', 'update-item'],
  setup(props, { emit }) {
    const updateItem = (index:number) => {
      emit('update:items', props.items)
    }

    const addItem = () => {
      emit('add-item')
    }

    const removeItem = (index) => {
      emit('remove-item', index)
    }
    const updateUnitPrice = (index, newValue) => {
      emit('update-item', { index, field: 'unitPrice', value: newValue });
    };
    return {
      updateItem,
      addItem,
      removeItem
    }
  },

 
});
</script>

<style lang="scss" scoped>

</style>