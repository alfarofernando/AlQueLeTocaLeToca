import { findBestCombination } from "./findBestCombination";
import { ProductType } from "../types/ProductType";
import chalk from "chalk";

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
    const budgets = [50, 100, 500, 1000, 5000, 10000, 20000, 50000, 100000, 500000];

    // Número total de ejecuciones
    const RUNS_PER_BUDGET = 60; // triplicado desde 20
    const totalRuns = budgets.length * RUNS_PER_BUDGET;

    it(chalk.bold.cyan("Test de validaciones múltiples y estrés"), () => {
        console.log(chalk.green("🚀 Iniciando test de validaciones múltiples y estrés..."));
        let currentRun = 0;

        budgets.forEach((budget) => {
            for (let run = 0; run < RUNS_PER_BUDGET; run++) {
                currentRun++;
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

                // Validación 4: Resultado no vacío si presupuesto >= mínimo precio
                if (budget >= products[0].price) {
                    expect(result.length).toBeGreaterThan(0);
                } else {
                    expect(result.length).toBe(0);
                }

                // Barra de progreso con color y emojis
                const progressBarLength = 30;
                const progress = Math.floor((currentRun / totalRuns) * progressBarLength);
                const bar = chalk.bgGreen(" ".repeat(progress)) + chalk.bgBlack(" ".repeat(progressBarLength - progress));
                const percent = ((currentRun / totalRuns) * 100).toFixed(1);

                process.stdout.write(
                    `\r${chalk.yellow("Progreso:")} [${bar}] ${percent}% ${chalk.blue(`${currentRun}/${totalRuns}`)} pruebas completadas ✅`
                );
            }
        });
        console.log(chalk.green("\n🎉 Test de validaciones múltiples y estrés completado con éxito ✅"));
    });

    it(chalk.bold.magenta("Test de diversidad: asegurar variedad en salidas"), () => {
        console.log(chalk.magenta("🔄 Iniciando test de diversidad..."));
        const budget = 1000;
        const executions: ProductType[][] = [];

        const diversityRuns = 90; // triplicado desde 30
        for (let i = 0; i < diversityRuns; i++) {
            executions.push(findBestCombination(products, budget));
            process.stdout.write(`\rEjecutando iteración ${i + 1}/${diversityRuns}...`);
        }

        let identicalCount = 0;
        for (let i = 0; i < executions.length; i++) {
            for (let j = i + 1; j < executions.length; j++) {
                if (areSequencesEqual(executions[i], executions[j])) {
                    identicalCount++;
                }
            }
        }

        console.log(`\nEjecuciones idénticas encontradas: ${chalk.redBright(identicalCount)}`);
        expect(identicalCount).toBeLessThan((executions.length * executions.length) / 4);
        console.log(chalk.magenta("🎉 Test de diversidad finalizado ✅"));
    });

    it(chalk.bold.blue("Test de casos borde: sin productos y presupuesto 0"), () => {
        console.log(chalk.blue("🔹 Iniciando test de casos borde..."));

        expect(findBestCombination([], 1000)).toEqual([]);
        console.log(chalk.green("  ✅ Sin productos, presupuesto 1000"));

        expect(findBestCombination(products, 0)).toEqual([]);
        console.log(chalk.green("  ✅ Con productos, presupuesto 0"));

        expect(findBestCombination([], 0)).toEqual([]);
        console.log(chalk.green("  ✅ Sin productos, presupuesto 0"));

        console.log(chalk.blue("🎉 Test de casos borde finalizado ✅"));
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
