import { ProductType } from "../types/ProductType";

const MAX_CONSECUTIVE = 2;    // No más de 2 veces seguidas
const BLOCK_INTERVAL = 5;     // Cada 5 vueltas bloqueamos producto más repetido
const BLOCK_DURATION = 10;    // Bloqueamos por 10 vueltas

export function findBestCombination(
    products: ProductType[],
    maxBudget: number
): ProductType[] { // devuelve lista de productos en orden de selección
    if (!products.length) return [];

    let budgetLeft = maxBudget;
    const selectedProducts: ProductType[] = [];

    const recentProducts: number[] = [];
    const consecutiveCount: { [id: number]: number } = {};
    const blockCounter: { [id: number]: number } = {};
    let iteration = 0;

    function updateBlocks() {
        for (const id in blockCounter) {
            if (blockCounter[id] > 0) blockCounter[id]--;
        }
    }

    function pickNextProduct(): ProductType | null {
        const candidates = products.filter((p) => {
            if (p.price > budgetLeft) return false;
            if (blockCounter[p.id] && blockCounter[p.id] > 0) return false;

            const lastProductId = recentProducts[recentProducts.length - 1];
            const lastCount = consecutiveCount[p.id] || 0;
            if (lastProductId === p.id && lastCount >= MAX_CONSECUTIVE) return false;

            return true;
        });

        if (candidates.length === 0) return null;

        const shuffled = candidates.sort(() => Math.random() - 0.5);
        return shuffled[0];
    }

    while (true) {
        iteration++;

        const nextProduct = pickNextProduct();
        if (!nextProduct) break;

        selectedProducts.push(nextProduct);
        budgetLeft -= nextProduct.price;

        const lastProductId = recentProducts[recentProducts.length - 1];
        if (lastProductId === nextProduct.id) {
            consecutiveCount[nextProduct.id] = (consecutiveCount[nextProduct.id] || 0) + 1;
        } else {
            consecutiveCount[nextProduct.id] = 1;
        }
        recentProducts.push(nextProduct.id);
        if (recentProducts.length > MAX_CONSECUTIVE) recentProducts.shift();

        if (iteration % BLOCK_INTERVAL === 0) {
            // Bloquear producto más repetido en selectedProducts
            const counts: { [key: number]: number } = {};
            for (const p of selectedProducts) {
                counts[p.id] = (counts[p.id] || 0) + 1;
            }
            const mostRepeatedId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
            if (mostRepeatedId) {
                blockCounter[parseInt(mostRepeatedId)] = BLOCK_DURATION;
            }
        }

        updateBlocks();
    }

    return selectedProducts;
}
