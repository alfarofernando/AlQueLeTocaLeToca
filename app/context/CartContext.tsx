'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useRef,
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

    // Ref para cantidad acumulada para el toast
    const addedCountRef = useRef(0);
    // Ref para timeout
    const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showAccumulatedToast = () => {
        if (addedCountRef.current > 0) {
            toast.success(`${addedCountRef.current} producto${addedCountRef.current > 1 ? "s" : ""} agregado${addedCountRef.current > 1 ? "s" : ""} al carrito ✅`);
            addedCountRef.current = 0;
        }
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
        setLoading(true);
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: productId, quantity }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setCart(data.cart);

                // Acumular cantidad para toast
                addedCountRef.current += quantity;

                // Si hay un timeout activo, lo reseteamos
                if (toastTimeoutRef.current) {
                    clearTimeout(toastTimeoutRef.current);
                }
                // Seteamos nuevo timeout para mostrar toast acumulado luego de 1 segundo (o 5s)
                toastTimeoutRef.current = setTimeout(() => {
                    showAccumulatedToast();
                    toastTimeoutRef.current = null;
                }, 1000);

            } else if (res.status === 400 && data.message?.includes("ya existe")) {
                const currentQty = cart.find(p => p.id === productId)?.quantity ?? 0;
                await updateQuantity(productId, currentQty + quantity);

                // También acumular en este caso
                addedCountRef.current += quantity;

                if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
                toastTimeoutRef.current = setTimeout(() => {
                    showAccumulatedToast();
                    toastTimeoutRef.current = null;
                }, 1000);
            } else {
                console.error("No se pudo agregar al carrito:", data.message);
                toast.error("No se pudo agregar al carrito");
            }
        } catch (error) {
            console.error("Error en addToCart:", error);
            toast.error("Error de conexión con el servidor");
        } finally {
            setLoading(false);
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
