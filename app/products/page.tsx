import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
    return (
        <Suspense fallback={<p>Cargando productos...</p>}>
            <ProductsClient />
        </Suspense>
    );
}
