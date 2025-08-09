'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { ProductType } from "../types/ProductType";
import toast from "react-hot-toast";

type CartContextType = {
    cart: ProductType[];
    loading: boolean;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    updateQuantity: (productId: number, newQuantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, _setCart] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);

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
                }
            } catch (e) {
                console.warn("Error al parsear carrito local:", e);
            }
        }

        // Cargar carrito desde API
        fetch("/api/cart")
            .then((res) => res.json())
            .then((data) => setCart(data))
            .catch((err) => console.error("Error al cargar carrito desde API:", err))
            .finally(() => setLoading(false));
    }, []);

    const addToCart = async (productId: number, quantity: number = 1) => {
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: productId, quantity }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setCart(data.cart);
                toast.success("Producto agregado al carrito ✅");
            } else if (res.status === 400 && data.message?.includes("ya existe")) {
                const currentQty = cart.find(p => p.id === productId)?.quantity ?? 0;
                await updateQuantity(productId, currentQty + quantity);
                toast.success("Cantidad actualizada en el carrito 🛒");
            } else {
                console.error("No se pudo agregar al carrito:", data.message);
                toast.error("No se pudo agregar al carrito");
            }
        } catch (error) {
            console.error("Error en addToCart:", error);
            toast.error("Error de conexión con el servidor");
        }
    };

    const updateQuantity = async (productId: number, newQuantity: number) => {
        try {
            const res = await fetch("/api/cart", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: productId, quantity: newQuantity }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setCart(data.cart);
            } else {
                console.error("Error al actualizar cantidad:", data.message);
            }
        } catch (error) {
            console.error("Error en updateQuantity:", error);
        }
    };

    const clearCart = async () => {
        try {
            const res = await fetch("/api/cart", {
                method: "DELETE",
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setCart([]);
            } else {
                console.error("Error al vaciar el carrito:", data.message);
            }
        } catch (error) {
            console.error("Error en clearCart:", error);
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
