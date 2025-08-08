"use client";

import { useProducts } from "../hooks/useProducts";
import { Product } from "../types/ProductType";
import ProductCard from "./ProductCard"; // ⬅️ Importamos el nuevo componente estilizado

interface Props {
    onAdd: (product: Product) => void;
    theme?: string;
}

export default function ProductList({ onAdd, theme }: Props) {
    const { products, loading, error } = useProducts();

    if (loading) return <p className="text-gray-600">Cargando productos...</p>;
    if (error) return <p className="text-red-500">Error: {error.message}</p>;
    if (!products || products.length === 0) return <p>No hay productos disponibles</p>;

    const filteredProducts = theme
        ? products.filter((product) => product.theme === theme)
        : products;

    return (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 ">
            {filteredProducts.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={onAdd}
                />
            ))}
        </div>
    );
}
