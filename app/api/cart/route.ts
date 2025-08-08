import { NextRequest, NextResponse } from 'next/server'
import { Producto } from '../../data/data'
import { ProductType } from "../../types/ProductType"

const cart: ProductType[] = []

export async function GET() {
    return NextResponse.json(cart)
}

export async function POST(req: NextRequest) {
    const { id, quantity = 1 } = await req.json() as { id: number, quantity?: number };

    const product = Producto.find(p => p.id === id);

    if (!product) {
        return NextResponse.json({ success: false, message: 'Producto no encontrado' }, { status: 404 });
    }

    const existing = cart.find(p => p.id === id);
    if (existing) {
        return NextResponse.json({
            success: false,
            message: 'Producto ya existe en el carrito. Para modificar cantidad usar PUT.'
        }, { status: 400 });
    }

    cart.push({ ...product, quantity }); // ✅ ahora respeta la cantidad enviada

    return NextResponse.json({
        success: true, message: 'Producto actualizado correctamente utilizando PUT.'
        , cart
    }, { status: 200 });
}


export async function PUT(req: NextRequest) {
    const { id, quantity } = await req.json() as { id: number, quantity: number };

    const productIndex = cart.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return NextResponse.json({ success: false, message: 'Producto no encontrado en carrito' }, { status: 404 });
    }

    if (quantity <= 0) {
        cart.splice(productIndex, 1);
    } else {
        cart[productIndex].quantity = quantity;
    }

    return NextResponse.json({ success: true, cart });
}


// Método DELETE para vaciar el carrito
export async function DELETE() {
    cart.length = 0 // vacía el array
    return NextResponse.json({ success: true, cart })
}
