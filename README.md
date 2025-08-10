# 🎁 La Suerte Loca

Bienvenido/a a **La Suerte Loca**, una tienda MVP de kits temáticos y sorpresas desarrollada como solución para una prueba técnica. Este proyecto integra un catálogo de productos, selección automática de combinaciones óptimas según presupuesto, carrito de compras, y una experiencia de usuario moderna, responsiva y profesional.

---

# Índice

- [🎁 La Suerte Loca](#-la-suerte-loca)
- [🚀 Demo](#-demo)
- [📋 Objetivo de la prueba técnica](#-objetivo-de-la-prueba-técnica)
- [📦 Características principales](#-características-principales)
- [🗂️ Estructura del proyecto](#️-estructura-del-proyecto)
- [🛠️ Instalación y ejecución](#️-instalación-y-ejecución)
- [🧩 Descripción de la solución](#-descripción-de-la-solución)
  - [Backend (API)](#backend-api)
  - [Frontend](#frontend)
  - [Lógica de combinaciones](#lógica-de-combinaciones)
    - [Diagrama de flujo (textual) del método `findBestCombination`](#diagrama-de-flujo-textual-del-método-findbestcombination)
  - [Tipado y buenas prácticas](#tipado-y-buenas-prácticas)
- [🧪 Testing](#-testing)
- [💻 Tecnologías utilizadas](#-tecnologías-utilizadas)
- [📄 Licencia](#-licencia)
- [📑 Entrega y consignas cumplidas](#-entrega-y-consignas-cumplidas)
- [👤 Autor](#-autor)
- [🤝 Contribuciones](#-contribuciones)
- [📬 Contacto](#-contacto)

---


## 🚀 Demo

[https://lasuerteloca.netlify.app/](https://lasuerteloca.netlify.app/)

---

## 📋 Objetivo de la prueba técnica

El objetivo principal es construir una aplicación fullstack que permita:

- Consultar un catálogo de productos temáticos.
- Ingresar un presupuesto y obtener automáticamente la mejor combinación de productos posible ("Automatic Zoom").
- Visualizar y gestionar un carrito de compras.
- Cumplir con buenas prácticas de desarrollo, documentación y despliegue.

---

## 📦 Características principales

- **Catálogo de productos**: Explora kits temáticos para distintas ocasiones, con descripciones, precios y detalles visuales.
- **Selección automática ("Automatic Zoom")**: Ingresa un presupuesto y la app calcula la mejor combinación de productos posible, maximizando el valor y ajustándose al monto ingresado.
- **Carrito de compras**: Agrega, elimina y visualiza productos seleccionados, con actualización dinámica del total.
- **API REST**: Endpoints para obtener productos y calcular combinaciones óptimas según presupuesto.
- **UI moderna y responsiva**: Construida con Next.js 15, React 19 y Tailwind CSS 4, adaptada a dispositivos móviles y escritorio.
- **Animaciones y feedback**: Interfaz fluida con framer-motion y notificaciones para mejorar la experiencia de usuario.
- **Código tipado**: Uso de TypeScript en todo el stack para mayor robustez y mantenibilidad.
- **Testing**: Lógica de combinaciones testeada con Jest para asegurar precisión y confiabilidad.
- **Despliegue**: Proyecto listo para ser desplegado en plataformas como Netlify, Vercel, etc.

---

## 🗂️ Estructura del proyecto

```
app/
  api/
    cart/route.ts           # Endpoint para combinaciones óptimas según presupuesto
    products/route.ts       # Endpoint para listado de productos
  components/               # Componentes reutilizables (Navbar, Footer, ProductItem, etc.)
  context/CartContext.tsx   # Contexto global para el carrito
  data/data.ts              # Listado de productos con detalles y precios
  data/temasDescripcion.ts  # Descripciones de temáticas
  hooks/useProducts.tsx     # Hook para obtener productos
  nosotros/page.tsx         # Página institucional
  products/                 # Página y componentes de productos
    ProductsClient.tsx
    components/
      ProductCard.tsx
      ProductCardSkeleton.tsx
  types/ProductType.ts      # Tipado de producto
  utils/findBestCombination.ts      # Algoritmo de combinaciones óptimas
  utils/findBestCombination.test.ts # Tests del algoritmo
  globals.css               # Estilos globales y Tailwind
  layout.tsx, page.tsx      # Layout y home principal
```

---

## 🛠️ Instalación y ejecución

### 1. Clona el repositorio

```bash
git clone https://github.com/alfarofernando/LaSuerteLoca.git
cd LaSuerteLoca
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Ejecuta el entorno de desarrollo

```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 4. Ejecuta los tests

```bash
npm run test
```

---

## 🧩 Descripción de la solución

### Backend (API)

- **`/api/products`**: Devuelve el listado completo de productos, con detalles, precio y valor relativo (`value`), permitiendo a la app mostrar el catálogo y filtrar por temáticas.
- **`/api/cart`**: Recibe un presupuesto y retorna la mejor combinación posible de productos, maximizando el valor y ajustándose al monto ingresado. Implementa la lógica de "Automatic Zoom" solicitada en la prueba técnica.

### Frontend

- **Catálogo**: Página de productos con filtros, visualización detallada y carga dinámica.
- **Carrito**: Modal interactivo para ver, agregar y eliminar productos seleccionados, con actualización automática del total.
- **Selección automática**: Formulario para ingresar presupuesto y obtener la mejor combinación posible, mostrando el resultado en formato JSON y visual.
- **Animaciones y feedback**: Uso de framer-motion y react-hot-toast para una experiencia moderna y atractiva.
- **Componentización**: Todos los elementos de UI están desacoplados en componentes reutilizables, facilitando la escalabilidad y el mantenimiento.

### Lógica de combinaciones

- El algoritmo (`utils/findBestCombination.ts`) utiliza programación dinámica para encontrar la mejor combinación de productos sin exceder el presupuesto, cumpliendo exactamente con el ejemplo y requisitos del PDF de la prueba técnica.
- Incluye tests unitarios (`utils/findBestCombination.test.ts`) para asegurar la precisión de los resultados y facilitar futuras mejoras.

#### Diagrama de flujo (textual) del método `findBestCombination`

1. **Inicio**

2. **Verificar si hay productos**
   - Si `products` está vacío, retorna lista vacía `[]` y termina.

3. **Inicializar variables**
   - `budgetLeft` = `maxBudget`
   - `selectedProducts` = []
   - `recentProducts` = []
   - `consecutiveCount` = Map vacío
   - `blockCounter` = Map vacío
   - `iteration` = 0

4. **Bucle principal (while true):**

   4.1. Incrementar `iteration` en 1

   4.2. **Elegir próximo producto (función `pickNextProduct`):**

       4.2.1. Filtrar productos que cumplen condiciones (`canSelectProduct`):

       - Precio <= `budgetLeft`  
       - Producto no bloqueado (`blockCounter[id]` <= 0)  
       - Producto no repetido consecutivamente más de `MAX_CONSECUTIVE` veces

       4.2.2. Si no hay candidatos, salir del bucle (fin).

       4.2.3. Si hay candidatos, elegir uno aleatorio y devolverlo.

   4.3. Si `nextProduct` es null, salir del bucle (fin).

   4.4. Agregar `nextProduct` a `selectedProducts`.

   4.5. Restar el precio de `nextProduct` a `budgetLeft`.

   4.6. **Actualizar conteo de repeticiones consecutivas:**

   - Si último producto seleccionado es igual a `nextProduct`:  
     - Incrementar contador en `consecutiveCount` para ese producto  
   - Si no, iniciar contador en 1 para ese producto

   4.7. Agregar `nextProduct.id` a `recentProducts`.  
   - Mantener solo los últimos `MAX_CONSECUTIVE` ids (eliminar los más antiguos si sobran).

   4.8. **Cada `BLOCK_INTERVAL` iteraciones:**

   - Obtener producto más repetido en `selectedProducts` (`getMostRepeatedProductId`)  
   - Bloquear ese producto en `blockCounter` por `BLOCK_DURATION` iteraciones

   4.9. Disminuir en 1 los contadores de bloqueo activos (`decrementBlockCounters`).

5. **Fin del bucle**

6. **Retornar `selectedProducts`**


### Tipado y buenas prácticas

- Todo el código está en TypeScript, asegurando robustez y facilidad de refactorización.
- Estructura modular y escalable, siguiendo buenas prácticas de desarrollo moderno.
- Uso de hooks y contextos para manejo de estado global y lógica compartida.

---

## 🧪 Testing

- Los tests unitarios se encuentran en `utils/findBestCombination.test.ts`.
- Ejecuta `npm run test` para correr todos los tests y asegurar la integridad de la lógica principal y la cobertura de casos de uso críticos.

---

## 💻 Tecnologías utilizadas

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Framer Motion](https://www.framer.com/motion/)
- [Axios](https://axios-http.com/)
- [React Hot Toast](https://react-hot-toast.com/)
- [ESLint](https://eslint.org/) y [Prettier](https://prettier.io/) para calidad de código

---

## 📄 Licencia

MIT

---

## 📑 Entrega y consignas cumplidas

- [x] **API REST**: Endpoints para productos y combinaciones óptimas.
- [x] **Frontend**: Visualización de catálogo, carrito y selección automática.
- [x] **Lógica "Automatic Zoom"**: Algoritmo probado y validado.
- [x] **Repositorio público en GitHub**: [https://github.com/alfarofernando/LaSuerteLoca](https://github.com/alfarofernando/LaSuerteLoca)
- [x] **README.md**: Instrucciones claras y descripción detallada.
- [x] **URL funcional**: [https://lasuerteloca.netlify.app/](https://lasuerteloca.netlify.app/)
- [x] **Testing**: Lógica principal testeada con Jest.

---

## 👤 Autor

- [Fernando Alfaro](https://github.com/alfarofernando)

---

## 🤝 Contribuciones

Las contribuciones, sugerencias y reportes de bugs son bienvenidos.  
Abre un issue o un pull request para colaborar.

---

## 📬 Contacto

¿Dudas o sugerencias?  
Abre un issue en el repositorio o contacta