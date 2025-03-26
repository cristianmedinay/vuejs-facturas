
<template>
    <div class="app-container">
     
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div class="container">
          <a class="navbar-brand" href="#">Sistema de Facturación</a>
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
import { computed, defineComponent, onMounted } from 'vue';

import { Database } from "./db/database";
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
    
    onMounted(() => {
      
      eventBus().emitter.on("sendData", () => {
        offline.sendData();
      });

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
</style>
