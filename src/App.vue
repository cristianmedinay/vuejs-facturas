
<template>
    <div class="app-container">
     
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div class="container">
          <a class="navbar-brand primary" href="#" >Sistema de Facturación</a>
          <button 
            class="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link to="/InvoiceForm" class="nav-link">Nueva Factura</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/historial" class="nav-link">Historial</router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  
      
      <main class="container">
        <router-view/>
      </main>
  
   
      <footer class="bg-light text-center p-3 mt-5">
        <div class="container">
          <p class="mb-0">Sistema de Facturación &copy; {{ currentYear }}</p>
        </div>
      </footer>
    </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue';

import { Database } from "./db/database";
import eventBus from './db/eventbus';
      const offline = new Database();

export default defineComponent({
    name: 'App',
    data() {
        return {};
    },
    props: {},
    setup() {

    offline.initProvider();
    const currentYear = computed(() => new Date().getFullYear())
    const dbReady = ref(false);
    
   /*  onMounted(() => {
      
      eventBus().emitter.on("sendData", () => {
        offline.sendData();
      });
      eventBus().emitter.on("saveInvoice", () => {
        offline.saveInvoice();
      });
    
    }); */

    onMounted(async () => {
      try {
              /*   await offline.initProvider();
                dbReady.value = true;
                
                // Configurar listeners de eventos
                eventBus().emitter.on("sendData", offline.sendData);
                eventBus().emitter.on("saveInvoice", offline.saveInvoice);
                
                // Guardar factura de prueba (opcional)
                const result = await offline.saveInvoice({
                    number: "FAC-2023-001",
                    client: {
                        name: "Juan Pérez",
                        dni: "12345678A",
                        address: "Calle Falsa 123"
                    },
                    items: [{
                        description: "Producto 1",
                        unitPrice: 100,
                        units: 2,
                        vatRate: 21
                    }]
                }); */
                
                console.log("Resultado de guardar:", result);
                
            } catch (error) {
                console.error("Error inicializando DB:", error);
            }
        });
    return {
      currentYear
    }
    },    
   
});
</script>

<style scoped lang="scss">




.app-container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

main {
  flex: 1;
}

.navbar {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

footer {
  border-top: 1px solid #dee2e6;
}


///SAS
.primary {
  color: $primary-color;
  font-weight: bold;
  /* Puedes sobrescribir estilos de Bootstrap */
  padding: 0.8rem 1rem;
  
  &:hover {
    color: darken($primary-color, 10%);
  }
}
</style>
