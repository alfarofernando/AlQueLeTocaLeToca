export type ProductType = {
    id: number;
    theme: string; // nombre de tematica
    name: string; // nombre del paquete
    description?: string; // posibles sorpresas que pueden venir
    price: number; // Precio minorista en número (sin $ ni puntos)
    quantity?: number; // cantidad de un paquete necesario para que funcione el sistema de carrito
    value?: number; //valor intrinseco del producto en base a su precio. 
};

