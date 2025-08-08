"use client";

import ProductList from "../components/ProductList";
import BestCombination from "../components/BestCombinations";
import { useCart } from "../context/CartContext";
import { ProductType } from "../types/ProductType";

type HomeContentProps = {
    selectedTheme: string | null;
};

export default function HomeContent({ selectedTheme }: HomeContentProps) {
    const { addToCart } = useCart();

    const handleAdd = (product: ProductType) => addToCart(product.id);
    return (
        <>
            <section className="mt-26">
                <BestCombination budget={10000} />
            </section>

            <section className="mb-8">
                <ProductList onAdd={handleAdd} theme={selectedTheme ?? undefined} />
            </section>
        </>
    );
}
