import { findBestCombination } from "./findBestCombination";
import { ProductType } from "../types/ProductType";

describe("bestCombKnapsackWithRules - Test de estrés y validaciones", () => {
    // Generar 100 productos con precio creciente y temas variados
    const products: ProductType[] = [];
    for (let i = 1; i <= 100; i++) {
        products.push({
            id: i,
            name: `Producto ${i}`,
            price: i * 10,
            theme: i % 2 === 0 ? "even" : "odd",
        });
    }

    // Varias configuraciones de presupuesto para estresar
    const budgets = [50, 100, 500, 1000, 5000];

    it("no rompe en múltiples ejecuciones y presupuestos, y cumple reglas", () => {
        console.log("Comenzando test de validaciones múltiples...");
        budgets.forEach((budget) => {
            for (let run = 0; run < 20; run++) {
                const result = findBestCombination(products, budget);

                // Validación 1: No excede presupuesto
                const totalCost = result.reduce((sum, p) => sum + p.price, 0);
                expect(totalCost).toBeLessThanOrEqual(budget);

                // Validación 2: Todos los productos seleccionados están en el catálogo
                result.forEach((p) => {
                    expect(products.some((prod) => prod.id === p.id)).toBe(true);
                });

                // Validación 3: No más de 2 repeticiones consecutivas
                for (let i = 2; i < result.length; i++) {
                    expect(
                        !(result[i].id === result[i - 1].id && result[i - 1].id === result[i - 2].id)
                    ).toBe(true);
                }

                // Validación 5: Resultado no vacío si presupuesto >= mínimo precio
                if (budget >= products[0].price) {
                    expect(result.length).toBeGreaterThan(0);
                } else {
                    expect(result.length).toBe(0);
                }

                // Barra de progreso simple
                const totalRuns = budgets.length * 20;
                const currentRun = budgets.indexOf(budget) * 20 + run + 1;
                const progress = Math.floor((currentRun / totalRuns) * 20);
                const bar = "▇".repeat(progress) + "-".repeat(20 - progress);
                process.stdout.write(`\r[${bar}] ${currentRun}/${totalRuns} checks passed ✅`);
            }
        });
        console.log("\nTest de validaciones múltiples finalizado ✅");
    });

    it("genera diversidad: no todas las ejecuciones son idénticas", () => {
        console.log("Comenzando test de diversidad de ejecuciones...");
        const budget = 1000;
        const executions: ProductType[][] = [];

        for (let i = 0; i < 30; i++) {
            executions.push(findBestCombination(products, budget));
            process.stdout.write(`\rEjecutando iteración ${i + 1}/30...`);
        }

        let identicalCount = 0;
        for (let i = 0; i < executions.length; i++) {
            for (let j = i + 1; j < executions.length; j++) {
                if (areSequencesEqual(executions[i], executions[j])) {
                    identicalCount++;
                }
            }
        }

        console.log(`\nEjecuciones idénticas encontradas: ${identicalCount}`);
        expect(identicalCount).toBeLessThan(executions.length * executions.length / 4);
        console.log("Test de diversidad finalizado ✅");
    });

    it("maneja casos borde: sin productos o presupuesto 0", () => {
        console.log("Comenzando test de casos borde...");
        expect(findBestCombination([], 1000)).toEqual([]);
        console.log("  ✅ Sin productos, presupuesto 1000");
        expect(findBestCombination(products, 0)).toEqual([]);
        console.log("  ✅ Con productos, presupuesto 0");
        expect(findBestCombination([], 0)).toEqual([]);
        console.log("  ✅ Sin productos, presupuesto 0");
        console.log("Test de casos borde finalizado ✅");
    });
});

// Función auxiliar para comparar secuencias exactas
function areSequencesEqual(seqA: ProductType[], seqB: ProductType[]) {
    if (seqA.length !== seqB.length) return false;
    for (let i = 0; i < seqA.length; i++) {
        if (seqA[i].id !== seqB[i].id) return false;
    }
    return true;
}
