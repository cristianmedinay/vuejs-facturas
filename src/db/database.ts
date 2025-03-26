
// import type { Invoice } from '../db/interface'; // Removed as it is not used
import eventBus from './eventbus';
export class Database {
    public db!: IDBDatabase;
    
    initProvider(): Promise<void> {
        return this.initDb();
    }


  

    private initDb(): Promise<void> {
        return new Promise(resolve => {
            const openRequest = indexedDB.open('facturacionDB', 3);

            openRequest.onupgradeneeded = event => {

                
            if (this.db) {
                console.log("already init");
                resolve();
            }
              /*   const db = (event.target as IDBOpenDBRequest).result; */
              const target: EventTarget | null = event.target;
              const db = (target as any).result;
                //if (!db.objectStoreNames.contains('facturas')) {
                    const facturaStore = db.createObjectStore('facturas', { keyPath: 'id', autoIncrement: true });
                    facturaStore.createIndex('by_invoices', 'number', { unique: true });
             
                //}
            };

            openRequest.onsuccess = event => {
                this.db = (event.target as IDBOpenDBRequest).result;
                
                // Cargar facturas al store cuando la DB esté lista
               /*  this.loadInvoicesToStore(); */
                
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

        
    }

    // Método para guardar una factura
    public async saveInvoice(invoiceData: any): Promise<void> {

        if (this.db == undefined) {
            await this.initProvider();
          }
        return new Promise(() => {
            
            const db = this.db;
            const transaction = db.transaction('facturas', 'readwrite');
            const storeDB = transaction.objectStore('facturas');
         
            
          // Crear objeto factura completo
          const invoice = {
            number: invoiceData.number || "FAC-" + Math.floor(Math.random() * 10000),
            date: invoiceData.date || new Date().toISOString().split('T')[0],
            client: invoiceData.client || {
                name: "Cliente no especificado",
                dni: "00000000X"
            },
            items: invoiceData.items || [],
            createdAt: Date.now()
        };

              let req;
         
              try {
                const req = storeDB.put(invoice);
                eventBus().emitter.emit("sendData");
              } catch (error) {
                console.log("error capturado");
                eventBus().emitter.emit("checkinError");
        
              }
              
          
        });
    }

    // Método para obtener facturas recientes
  /*   public async getRecentInvoices(limit = 5): Promise<Invoice[]> {
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
    } */
}