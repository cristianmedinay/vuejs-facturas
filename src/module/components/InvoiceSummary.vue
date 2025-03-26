<template>
    <div class="card mb-4">
      <div class="card-header bg-warning">
        <h2>Resumen</h2>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <table class="table">
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th>Importe</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <td>{{ item.description }}</td>
                  <td>{{ (item.unitPrice * item.units * (1 + item.vatRate / 100)).toFixed(2) }} €</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Totales</h5>
                <table class="table">
                  <tr>
                    <th>Base Imponible:</th>
                    <td>{{ totals.baseImponible }} €</td>
                  </tr>
                  <tr>
                    <th>IVA:</th>
                    <td>{{ totals.totalVAT }} €</td>
                  </tr>
                  <tr class="table-active">
                    <th>Total:</th>
                    <td>{{ totals.totalWithVAT }} €</td>
                  </tr>
                </table>
                <button @click="submit" class="btn btn-primary w-100">
                  Generar Factura
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
  

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
interface InvoiceItem {
  description: string;
  unitPrice: number;
  units: number;
  vatRate: number;
}
export default defineComponent({
    name: 'InvoiceSummary',
    data() {
        return {};
    },
    props: {
      items: {
      type: Array as () => InvoiceItem[],
      required: true
    }
  },
    components: {},
    emits: ['submit'],
    setup(props, { emit }) {
  // Historial de facturas
  const invoices = ref<any[]>([]);

    // Cargar historial al montar el componente
    onMounted(() => {
      invoices.value = JSON.parse(localStorage.getItem('invoices') || '[]');
    });

    //total por item
    const calculateItemTotal = (item: InvoiceItem) => {
      return item.unitPrice * item.units * (1 + item.vatRate / 100);
    };
    const totals = computed(() => {
      const result = props.items.reduce((acc, item) => {
        const base = item.unitPrice * item.units
        const vat = base * (item.vatRate / 100)
        acc.base += base
        acc.vat += vat
        acc.total += base + vat
        return acc
      }, { base: 0, vat: 0, total: 0 })

      return {
        baseImponible: result.base.toFixed(2),
        totalVAT: result.vat.toFixed(2),
        totalWithVAT: result.total.toFixed(2)
      }
    })

        const submit = () => {

          Swal.fire({
          title: 'Factura generada',
          text: '', 
          icon: 'success'
        });
         emit('submit')
        }

        return {
          invoices,
        totals,
        submit,
        calculateItemTotal 
        }

    },


});
</script>

<style lang="scss" scoped>

</style>