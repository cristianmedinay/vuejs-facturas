// store.js
import { createStore } from 'vuex';
import {type Invoice } from '../../db/interface';
  
interface State {
    invoices: Invoice[];
  }
  
export default createStore<State>({
    state: {
      invoices: JSON.parse(localStorage.getItem('invoices') || '[]'),
    },
    mutations: {
      ADD_INVOICE(state: State, invoice: Invoice) {
        state.invoices.push(invoice);
        localStorage.setItem('invoices', JSON.stringify(state.invoices));
      },
      SET_INVOICES(state: State, invoices: Invoice[]) {
        state.invoices = invoices;
      }
    },
    actions: {
      saveInvoice({ commit }, invoice: Invoice) {
        commit('ADD_INVOICE', invoice);
      },
      loadInvoices({ commit }) {
        const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        commit('SET_INVOICES', invoices);
      }
    },
    getters: {
      allInvoices: (state: State) => state.invoices,
      recentInvoices: (state: State) => state.invoices.slice().reverse().slice(0, 5)
    }
  });