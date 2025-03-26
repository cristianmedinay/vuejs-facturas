<template>
  <div class="invoice-history mt-4">
    <h2 class="mb-4">Historial de Facturas</h2>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Número</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(invoice, index) in invoices" :key="index">
            <td>{{ invoice.number }}</td>
            <td>{{ formatDate(invoice.date) }}</td>
            <td>{{ invoice.client.name }}</td>
            <td>{{ calculateInvoiceTotal(invoice.items) }} €</td>
            <td>
              <button 
                @click="viewInvoice(invoice)"
                class="btn btn-sm btn-info"
              >
                Ver Detalle
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

interface InvoiceItem {
  description: string;
  unitPrice: number;
  units: number;
  vatRate: number;
}

export default defineComponent({
  name: 'InvoiceHistory',
  emits: ['view-invoice'],
  setup(props, { emit }) {
    const store = useStore();

    // Cargar facturas al montar el componente
    onMounted(() => {
      store.dispatch('loadInvoices');
    });

    // Obtener facturas del store
    const invoices = computed(() => store.getters.allInvoices);

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const calculateInvoiceTotal = (items: InvoiceItem[]) => {
      return items.reduce((total, item) => {
        return total + (item.unitPrice * item.units * (1 + item.vatRate / 100));
      }, 0).toFixed(2);
    };

    const viewInvoice = (invoice: any) => {
      emit('view-invoice', invoice);
    };

    return {
      invoices,
      formatDate,
      calculateInvoiceTotal,
      viewInvoice
    };
  }
});
</script>

<style scoped>
.invoice-history {
  margin-top: 2rem;
}

.table-responsive {
  overflow-x: auto;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>