"use client";

import ProductList from "../components/ProductList";
import BestCombination from "../components/BestCombinations";
import { useCart } from "../context/CartContext";

type HomeContentProps = {
    selectedTheme: string | null;
};

export default function HomeContent({ selectedTheme }: HomeContentProps) {
    const { addToCart, updateQuantity } = useCart();

    const handleAdd = (product: any) => addToCart(product.id);
    const handleUpdate = (product: any, newQuantity: number) => updateQuantity(product.id, newQuantity);

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
