export interface Invoice {
    id?: number;
    number: string;
    date: string;
    client: {
        name: string;
        dni: string;
        address?: string;
    };
    items: Array<{
        description: string;
        unitPrice: number;
        units: number;
        vatRate: number;
    }>;
    createdAt: number;
}

