
<template>

    <div class="container mt-4">
    <h1 class="mb-4">Sistema de Facturación</h1>
    
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h2>Datos de Factura</h2>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label for="invoiceNumber" class="form-label">Número de Factura</label>
            <input 
              v-model="invoiceData.number" 
              type="text" 
              class="form-control" 
              id="invoiceNumber"
              :class="{ 'is-invalid': errors.number }"
            >
            <div class="invalid-feedback">{{ errors.number }}</div>
          </div>
          <div class="col-md-6">
            <label for="invoiceDate" class="form-label">Fecha</label>
            <input 
              v-model="invoiceData.date" 
              type="date" 
              class="form-control" 
              id="invoiceDate"
              :class="{ 'is-invalid': errors.date }"
            >
            <div class="invalid-feedback">{{ errors.date }}</div>
          </div>
          <div class="col-12">
            <label for="companyName" class="form-label">Nombre de Empresa</label>
            <input 
              v-model="invoiceData.companyName" 
              type="text" 
              class="form-control" 
              id="companyName"
              :class="{ 'is-invalid': errors.companyName }"
            >
            <div class="invalid-feedback">{{ errors.companyName }}</div>
          </div>
          <div class="col-12">
            <label for="companyAddress" class="form-label">Dirección</label>
            <input 
              v-model="invoiceData.companyAddress" 
              type="text" 
              class="form-control" 
              id="companyAddress"
              :class="{ 'is-invalid': errors.companyAddress }"
            >
            <div class="invalid-feedback">{{ errors.companyAddress }}</div>
          </div>
        </div>
      </div>
    </div>

    <ClientForm 
      v-model:client="invoiceData.client"
      :errors="errors.client"
      @update:client="handleClientUpdate"
    />

    <InvoiceItems 
      v-model:items="invoiceData.items"
      :errors="errors.items"
      @add-item="addItem"
      @remove-item="removeItem"
    />

    <InvoiceSummary 
      :items="invoiceData.items"
      @submit="submitInvoice"
    />

    <div class="mt-4">
      <h2>Historial de Facturas</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Número</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(invoice, index) in invoiceHistory" :key="index">
            <td>{{ invoice.number }}</td>
            <td>{{ formatDate(invoice.date) }}</td>
            <td>{{ invoice.client.name }}</td>
            <td>{{ calculateTotal(invoice.items).totalWithVAT }} €</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import { ref, reactive, computed } from 'vue'
import ClientForm from '../components/ClientForm.vue'
import InvoiceItems from '../components/InvoiceItems.vue'
import InvoiceSummary from '../components/InvoiceSummary.vue'
import { useStore } from 'vuex';
import router from '../../router';


export default defineComponent({
    name: 'InvoiceForm',
    data() {


        

        return {};
    },
    props: {},

    components: {
    ClientForm,
    InvoiceItems,
    InvoiceSummary
  },

    setup(props, { context }) {
      const store = useStore();
        const invoiceData = reactive({
      number: '',
      date: new Date().toISOString().split('T')[0],
      companyName: '',
      companyAddress: '',
      client: {
        dni: '',
        name: '',
        address: '',
        city: '',
        province: '',
        postalCode: ''
      },
      items: [
        {
          description: '',
          unitPrice: 0,
          units: 1,
          vatRate: 21,
          total: 0
        }
      ]
    })

    const errors = reactive({
      number: '',
      date: '',
      companyName: '',
      companyAddress: '',
      client: {
        dni: '',
        name: '',
        address: '',
        city: '',
        province: '',
        postalCode: ''
      },
      items: []
    })
    const invoiceHistory = ref([])
        const validateForm = () => {
        let isValid = true
        
        // Validar datos de factura
        if (!invoiceData.number.trim()) {
            errors.number = 'El número de factura es obligatorio'
            isValid = false
        } else {
            errors.number = ''
        }

        if (!invoiceData.date) {
            errors.date = 'La fecha es obligatoria'
            isValid = false
        } else {
            errors.date = ''
        }

        // Validar datos de cliente
        if (!invoiceData.client.dni.trim()) {
            errors.client.dni = 'El DNI es obligatorio'
            isValid = false
        } else if (!/^[0-9]{8}[A-Za-z]$/.test(invoiceData.client.dni)) {
            errors.client.dni = 'DNI no válido (8 números + letra)'
            isValid = false
        } else {
            errors.client.dni = ''
        }

        // Validar items
        invoiceData.items.forEach((item, index) => {
            if (!item.description.trim()) {
            errors.items[index] = { description: 'La descripción es obligatoria' }
            isValid = false
            } else {
            errors.items[index] = { description: '' }
            }
        })

        return isValid
        }


        const calculateTotal = (items) => {
      const totals = items.reduce((acc, item) => {
        const base = item.unitPrice * item.units
        const vat = base * (item.vatRate / 100)
        acc.base += base
        acc.vat += vat
        acc.total += base + vat
        return acc
      }, { base: 0, vat: 0, total: 0 })

      return {
        baseImponible: totals.base.toFixed(2),
        totalVAT: totals.vat.toFixed(2),
        totalWithVAT: totals.total.toFixed(2)
      }
    }

        const addItem = () => {
        invoiceData.items.push({
            description: '',
            unitPrice: 0,
            units: 1,
            vatRate: 21,
            total: 0
        })
        }

        const removeItem = (index) => {
        if (invoiceData.items.length > 1) {
            invoiceData.items.splice(index, 1)
        }
        }

       /*  const submitInvoice = () => {
        if (validateForm()) {
        
            invoiceData.items.forEach(item => {
            item.total = (item.unitPrice * item.units * (1 + item.vatRate / 100)).toFixed(2)
            })

      
            invoiceHistory.value.push({ ...invoiceData })
            
        
        }
        } */
        const submitInvoice = () => {
       /*    if (validateForm()) {
                      const invoiceToSave = {
                ...JSON.parse(JSON.stringify(invoiceData)), 
                items: invoiceData.items.map(item => ({
                  ...item,
                  total: (item.unitPrice * item.units * (1 + item.vatRate / 100)).toFixed(2)
                }))
              };

              const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
              invoices.push(invoiceToSave);
              localStorage.setItem('invoices', JSON.stringify(invoices));

           
              invoiceHistory.value = JSON.parse(localStorage.getItem('invoices') || '[]');
              
  
              resetForm();
          } */
          if (validateForm()) {
            const invoiceToSave = {
              ...JSON.parse(JSON.stringify(invoiceData)),
              items: invoiceData.items.map(item => ({
                ...item,
                total: (item.unitPrice * item.units * (1 + item.vatRate / 100)).toFixed(2)
              }))
            };

            // Guardar usando Vuex
            store.dispatch('saveInvoice', invoiceToSave);
            
            // Redirigir
            router.push('/historial');
          }
        };
        onMounted(() => {
          invoiceHistory.value = JSON.parse(localStorage.getItem('invoices') || '[]');
        });
        const resetForm = () => {
          invoiceData.number = '';
          invoiceData.date = new Date().toISOString().split('T')[0];
          invoiceData.companyName = '';
          invoiceData.companyAddress = '';
          invoiceData.client = {
            dni: '',
            name: '',
            address: '',
            city: '',
            province: '',
            postalCode: ''
          };
          invoiceData.items = [
            {
              description: '',
              unitPrice: 0,
              units: 1,
              vatRate: 21,
              total: 0
            }
          ];
          Object.keys(errors).forEach(key => {
            if (typeof errors[key] === 'object') {
              Object.keys(errors[key]).forEach(subKey => {
                errors[key][subKey] = '';
              });
            } else {
              errors[key] = '';
            }
          });
        };



        const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        return new Date(dateString).toLocaleDateString('es-ES', options)
        }

        return {
        invoiceData,
        errors,
        invoiceHistory,
        calculateTotal,
        addItem,
        removeItem,
        submitInvoice,
        formatDate
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