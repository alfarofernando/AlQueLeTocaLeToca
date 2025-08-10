import { ProductType } from "../types/ProductType";

const MAX_CONSECUTIVE = 2;    // No más de 2 veces seguidas
const BLOCK_INTERVAL = 3;     // Cada 3 iteraciones bloqueamos producto más repetido
const BLOCK_DURATION = 5;     // Bloqueamos por 5 iteraciones

export function findBestCombination(
    products: ProductType[],
    maxBudget: number
): ProductType[] {
    if (products.length === 0) return [];

    let budgetLeft = maxBudget;
    const selectedProducts: ProductType[] = [];

    const recentProducts: number[] = [];
    const consecutiveCount = new Map<number, number>();
    const blockCounter = new Map<number, number>();
    let iteration = 0;

    function decrementBlockCounters() {
        for (const [id, count] of blockCounter.entries()) {
            if (count > 0) {
                blockCounter.set(id, count - 1);
            }
        }
    }

    function getMostRepeatedProductId(): number | null {
        const counts = new Map<number, number>();
        for (const p of selectedProducts) {
            counts.set(p.id, (counts.get(p.id) ?? 0) + 1);
        }
        if (counts.size === 0) return null;

        // Ordenar para obtener el producto más repetido
        let maxCount = 0;
        let mostRepeatedId: number | null = null;
        for (const [id, count] of counts.entries()) {
            if (count > maxCount) {
                maxCount = count;
                mostRepeatedId = id;
            }
        }
        return mostRepeatedId;
    }

    function canSelectProduct(p: ProductType): boolean {
        if (p.price > budgetLeft) return false;

        if ((blockCounter.get(p.id) ?? 0) > 0) return false;

        const lastProductId = recentProducts[recentProducts.length - 1];
        const lastCount = consecutiveCount.get(p.id) ?? 0;
        if (lastProductId === p.id && lastCount >= MAX_CONSECUTIVE) return false;

        return true;
    }

    function pickNextProduct(): ProductType | null {
        const candidates = products.filter(canSelectProduct);
        if (candidates.length === 0) return null;

        // Elegir uno aleatorio entre candidatos
        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
    }

    while (true) {
        iteration++;

        const nextProduct = pickNextProduct();
        if (!nextProduct) break;

        selectedProducts.push(nextProduct);
        budgetLeft -= nextProduct.price;

        // Actualizar conteo consecutivo
        const lastProductId = recentProducts[recentProducts.length - 1];
        if (lastProductId === nextProduct.id) {
            consecutiveCount.set(nextProduct.id, (consecutiveCount.get(nextProduct.id) ?? 0) + 1);
        } else {
            consecutiveCount.set(nextProduct.id, 1);
        }

        recentProducts.push(nextProduct.id);
        if (recentProducts.length > MAX_CONSECUTIVE) recentProducts.shift();

        // Cada BLOCK_INTERVAL iteraciones bloqueamos el producto más repetido
        if (iteration % BLOCK_INTERVAL === 0) {
            const mostRepeatedId = getMostRepeatedProductId();
            if (mostRepeatedId !== null) {
                blockCounter.set(mostRepeatedId, BLOCK_DURATION);
            }
        }

        decrementBlockCounters();
    }

    return selectedProducts;
}
