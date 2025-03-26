// database.ts
import store from '../module/store/store'; // Asegúrate de importar tu store

export class Database {
    public db!: IDBDatabase;
    
    initProvider(): Promise<void> {
        return this.initDb();
    }

    private initDb(): Promise<void> {
        return new Promise(resolve => {
            const openRequest = indexedDB.open('facturacionDB', 3);

            openRequest.onupgradeneeded = event => {
                const db = (event.target as IDBOpenDBRequest).result;
                
                if (!db.objectStoreNames.contains('facturas')) {
                    const facturaStore = db.createObjectStore('facturas', { keyPath: 'id', autoIncrement: true });
                    facturaStore.createIndex('by_number', 'number', { unique: true });
                    facturaStore.createIndex('by_date', 'date');
                }
            };

            openRequest.onsuccess = event => {
                this.db = (event.target as IDBOpenDBRequest).result;
                
                // Cargar facturas al store cuando la DB esté lista
                this.loadInvoicesToStore();
                
                resolve();
            };

            openRequest.onerror = event => {
                console.error('Error opening IndexedDB:', (event.target as IDBOpenDBRequest).error);
                resolve();
            };
        });
    }

    // Método para cargar facturas desde IndexedDB al store
    private async loadInvoicesToStore() {
        const transaction = this.db.transaction('facturas', 'readonly');
        const storeDB = transaction.objectStore('facturas');
        const request = storeDB.getAll();

        request.onsuccess = () => {
            store.commit('SET_INVOICES', request.result);
        };

        request.onerror = () => {
            console.error('Error loading invoices from IndexedDB');
        };
    }

    // Método para guardar una factura
    public async saveInvoice(invoice: Invoice): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('facturas', 'readwrite');
            const storeDB = transaction.objectStore('facturas');
            
            const request = storeDB.add(invoice);

            request.onsuccess = () => {
                store.commit('ADD_INVOICE', invoice);
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Método para obtener facturas recientes
    public async getRecentInvoices(limit = 5): Promise<Invoice[]> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('facturas', 'readonly');
            const storeDB = transaction.objectStore('facturas');
            const index = storeDB.index('by_date');
            const request = index.openCursor(null, 'prev');

            const invoices: Invoice[] = [];
            let count = 0;

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
                if (cursor && count < limit) {
                    invoices.push(cursor.value);
                    count++;
                    cursor.continue();
                } else {
                    resolve(invoices);
                }
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }
}