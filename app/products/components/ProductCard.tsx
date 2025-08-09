import { FiPlus } from "react-icons/fi";
import { ProductType } from "../../types/ProductType";
import { useCart } from "../../context/CartContext"; // Ajusta la ruta

type Props = {
    product: ProductType;
};

export default function ProductCard({ product }: Props) {
    const { addToCart } = useCart();

    return (
        <div className="rounded-2xl border border-white/40 bg-white/30 backdrop-blur-lg shadow-xl p-6 transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2 mb-4">
                <h2 className="text-xl font-bold text-center text-gray-800 drop-shadow-sm">
                    {product.name}
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                    <span className="text-md font-medium">Que puede traer?: </span>
                    {product.description}
                </p>
            </div>

            <div className="flex justify-between items-center mt-auto">
                <span className="text-lg font-semibold text-gray-900 drop-shadow-sm">
                    Precio Minorista: ${product.price}
                </span>
                <button
                    onClick={() => addToCart(product.id, 1)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-xl shadow transition duration-200"
                >
                    <FiPlus size={18} />
                    Agregar
                </button>
            </div>
        </div>
    );
}
