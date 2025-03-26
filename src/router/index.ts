// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'InvoiceForm',
    component: () => import('../module/components/InvoiceForm.vue'),
    meta: { title: 'Nueva Factura' }
  },
  {
    path: '/historial',
    name: 'InvoiceHistory',
    component: () => import('../module/components/InvoiceHistory.vue'),
    meta: { title: 'Historial de Facturas' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  
})


/* router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | Facturación` : 'Sistema de Facturación'
  next()
}) */

export default router