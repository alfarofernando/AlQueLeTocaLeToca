import { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "../types/Product";

export function useProducts() {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("/api/products");
                setProducts(response.data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    return { products, loading, error };
}
