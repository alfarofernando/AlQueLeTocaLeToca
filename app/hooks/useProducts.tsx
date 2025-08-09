import { useState, useEffect } from "react";
import { ProductType } from "../types/ProductType";

export function useProducts(theme?: string) {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const startTime = Date.now();

            try {
                const url = theme
                    ? `/api/products?theme=${theme}`
                    : "/api/products";
                const res = await fetch(url);
                if (!res.ok) throw new Error("Error al cargar productos");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                const elapsed = Date.now() - startTime;
                const minDelay = 3000; // 2 segundos
                const remaining = minDelay - elapsed;

                if (remaining > 0) {
                    setTimeout(() => setLoading(false), remaining);
                } else {
                    setLoading(false);
                }
            }
        };
        fetchProducts();
    }, [theme]);

    return { products, loading, error };
}
