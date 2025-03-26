<template>
    <div class="card mb-4">
      <div class="card-header bg-info text-white">
        <h2>Datos del Cliente</h2>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label for="clientDni" class="form-label">DNI</label>
            <input 
              v-model="client.dni" 
              type="text" 
              class="form-control" 
              id="clientDni"
              :class="{ 'is-invalid': errors.dni }"
              @input="$emit('update:client', client)"
            >
            <div class="invalid-feedback">{{ errors.dni }}</div>
          </div>
          <div class="col-md-6">
            <label for="clientName" class="form-label">Nombre</label>
            <input 
              v-model="client.name" 
              type="text" 
              class="form-control" 
              id="clientName"
              :class="{ 'is-invalid': errors.name }"
              @input="$emit('update:client', client)"
            >
            <div class="invalid-feedback">{{ errors.name }}</div>
          </div>
          <div class="col-12">
            <label for="clientAddress" class="form-label">Dirección</label>
            <input 
              v-model="client.address" 
              type="text" 
              class="form-control" 
              id="clientAddress"
              :class="{ 'is-invalid': errors.address }"
              @input="$emit('update:client', client)"
            >
            <div class="invalid-feedback">{{ errors.address }}</div>
          </div>
          <div class="col-md-4">
            <label for="clientCity" class="form-label">Ciudad</label>
            <input 
              v-model="client.city" 
              type="text" 
              class="form-control" 
              id="clientCity"
              :class="{ 'is-invalid': errors.city }"
              @input="$emit('update:client', client)"
            >
            <div class="invalid-feedback">{{ errors.city }}</div>
          </div>
          <div class="col-md-4">
            <label for="clientProvince" class="form-label">Provincia</label>
            <input 
              v-model="client.province" 
              type="text" 
              class="form-control" 
              id="clientProvince"
              :class="{ 'is-invalid': errors.province }"
              @input="$emit('update:client', client)"
            >
            <div class="invalid-feedback">{{ errors.province }}</div>
          </div>
          <div class="col-md-4">
            <label for="clientPostalCode" class="form-label">Código Postal</label>
            <input 
              v-model="client.postalCode" 
              type="text" 
              class="form-control" 
              id="clientPostalCode"
              :class="{ 'is-invalid': errors.postalCode }"
              @input="$emit('update:client', client)"
            >
            <div class="invalid-feedback">{{ errors.postalCode }}</div>
          </div>
        </div>
      </div>
    </div>
</template>
  

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
    name: 'ClientForm',
    data() {
        return {};
    },
    props: {
        client: {
        type: Object,
        required: true
        },
        errors: {
        type: Object,
        required: true
        }
    },

    emits: ['update:client'],
    components: {},

    setup(props, { context }) {

    const client = ref({ ...props.client })

      
    watch(() => props.client, (newVal) => {
      client.value = { ...newVal }
    }, { deep: true })

        return {
        client
        }

    },

    mounted() {},

    methods: {},

    computed: {},

    watch: {},

    directives: {},

    filters: {}
});
</script>

<style lang="scss" scoped>

</style>