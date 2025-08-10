# 🎁 AlQueLeTocaLeToca

¡Bienvenido/a a **AlQueLeTocaLeToca**!  
Este proyecto es una tienda MVP para la venta de kits temáticos y sorpresas, desarrollado como parte de una prueba técnica. Incluye selección automática de productos según presupuesto, carrito de compras, y una experiencia moderna y responsiva.

---

## 🚀 Demo

> _Próximamente: Si despliegas en Vercel, Heroku, etc., agrega aquí la URL._

---

## 📦 Características principales

- **Catálogo de productos**: Visualiza y explora kits temáticos para distintas ocasiones.
- **Selección automática ("Automatic Zoom")**: Ingresa un presupuesto y obtén la mejor combinación de productos posible.
- **Carrito de compras**: Agrega, elimina y visualiza productos seleccionados.
- **API REST**: Endpoints para productos y cálculo de combinaciones óptimas.
- **UI moderna y responsiva**: Construida con Next.js 15, React 19 y Tailwind CSS 4.
- **Animaciones y feedback**: Interfaz fluida con framer-motion y notificaciones.
- **Código tipado**: Uso de TypeScript en todo el stack.
- **Testing**: Lógica de combinaciones testeada con Jest.

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
git clone https://github.com/tu-usuario/AlQueLeTocaLeToca.git
cd AlQueLeTocaLeToca
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

- **`/api/products`**: Devuelve el listado completo de productos, con detalles, precio y valor relativo.
- **`/api/cart`**: Recibe un presupuesto y retorna la mejor combinación posible de productos, maximizando el valor y ajustándose al monto ingresado.

### Frontend

- **Catálogo**: Página de productos con filtros y visualización detallada.
- **Carrito**: Modal interactivo para ver y modificar la selección.
- **Selección automática**: Formulario para ingresar presupuesto y obtener la mejor combinación posible.
- **Animaciones y feedback**: Uso de framer-motion y react-hot-toast para una experiencia moderna.
- **Componentización**: Todos los elementos de UI están desacoplados en componentes reutilizables.

### Lógica de combinaciones

- El algoritmo (`utils/findBestCombination.ts`) utiliza programación dinámica para encontrar la mejor combinación de productos sin exceder el presupuesto.
- Incluye tests unitarios para asegurar la precisión de los resultados.

### Tipado y buenas prácticas

- Todo el código está en TypeScript.
- Estructura modular y escalable.
- Uso de hooks y contextos para manejo de estado global.

---

## 🧪 Testing

- Los tests se encuentran en `utils/findBestCombination.test.ts`.
- Ejecuta `npm run test` para correr todos los tests y asegurar la integridad de la lógica principal.

---

## 💻 Tecnologías utilizadas

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Framer Motion](https://www.framer.com/motion/)
- [Axios](https://axios-http.com/)

---

## 📄 Licencia

MIT

---
