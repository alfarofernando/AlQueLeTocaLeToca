export type ProductType = {
    id: number;
    theme: string; // nombre de tematica
    name: string;
    description: string; // posibles sorpresas que pueden venir
    price: number; // Precio minorista en número (sin $ ni puntos)
    quantity?: number;
};

