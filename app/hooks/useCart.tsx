// hooks/useCart.ts
import { useState, useEffect } from "react";
import { Product } from "../types/Product";

export function useCart() {
    const [cart, setCart] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // GET al iniciar
    useEffect(() => {
        fetch("/api/cart")
            .then((res) => res.json())
            .then((data) => setCart(data))
            .finally(() => setLoading(false));
    }, []);

    const addToCart = async (product: Omit<Product, "quantity">) => {
        const res = await fetch("/api/cart", {
            method: "POST",
            body: JSON.stringify(product),
        });
        const data = await res.json();
        setCart(data.cart);
    };

    const updateQuantity = async (product: Product, newQuantity: number) => {
        const current = cart.find(p => p.id === product.id);
        const delta = newQuantity - (current?.quantity ?? 0);
        if (delta === 0) return;

        const action = delta > 0 ? "increment" : "decrement";
        for (let i = 0; i < Math.abs(delta); i++) {
            const res = await fetch("/api/cart", {
                method: "PUT",
                body: JSON.stringify({ id: product.id, action }),
            });
            const data = await res.json();
            setCart(data.cart);
        }
    };

    const clearCart = () => {
        setCart([]); // UI optimista, si querés persistencia hacé un endpoint DELETE también
    };

    return {
        cart,
        loading,
        addToCart,
        updateQuantity,
        clearCart,
    };
}
