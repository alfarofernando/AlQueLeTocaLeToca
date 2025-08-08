'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ProductType } from "../types/ProductType";

type CartContextType = {
    cart: ProductType[];
    loading: boolean;
    addToCart: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, newQuantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, _setCart] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);

    // 👉 Sync state and localStorage
    const setCart = (newCart: ProductType[]) => {
        _setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    useEffect(() => {
        const localCart = localStorage.getItem("cart");

        if (localCart) {
            try {
                const parsedCart = JSON.parse(localCart);
                if (Array.isArray(parsedCart)) {
                    setCart(parsedCart);
                    setLoading(false);
                }
            } catch (e) {
                console.warn("Error al parsear el carrito local:", e);
            }
        }

        // Siempre sincroniza con el backend al montar
        fetch("/api/cart")
            .then((res) => res.json())
            .then((data) => setCart(data))
            .catch((err) => console.error("Error al cargar carrito desde API:", err))
            .finally(() => setLoading(false));
    }, []);

    const addToCart = async (productId: number) => {
        const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: productId }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
            setCart(data.cart);
        } else {
            if (res.status === 400 && data.message?.includes("ya existe")) {
                const currentQty = cart.find((p) => p.id === productId)?.quantity ?? 0;
                await updateQuantity(productId, currentQty + 1);
            } else {
                console.error("No se pudo agregar al carrito:", data.message);
            }
        }
    };

    const updateQuantity = async (productId: number, newQuantity: number) => {
        const current = cart.find((p) => p.id === productId);
        const delta = newQuantity - (current?.quantity ?? 0);
        if (delta === 0) return;

        const action = delta > 0 ? "increment" : "decrement";

        for (let i = 0; i < Math.abs(delta); i++) {
            const res = await fetch("/api/cart", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: productId, action }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setCart(data.cart);
            } else {
                console.error("Error al actualizar cantidad:", data.message);
                break;
            }
        }
    };

    const clearCart = async () => {
        const res = await fetch("/api/cart", {
            method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
            setCart(data.cart);
        } else {
            console.error("Error al vaciar el carrito:", data.message);
        }
    };

    return (
        <CartContext.Provider
            value={{ cart, loading, addToCart, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return context;
}
