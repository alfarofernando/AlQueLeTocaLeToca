import { NextRequest, NextResponse } from 'next/server'
import { Producto } from '../../utils/data'
import { ProductType } from "../../types/ProductType"

const cart: ProductType[] = []

export async function GET() {
    return NextResponse.json(cart)
}

export async function POST(req: NextRequest) {
    const { id } = await req.json() as { id: number }

    const product = Producto.find(p => p.id === id)

    if (!product) {
        return NextResponse.json({ success: false, message: 'Producto no encontrado' }, { status: 404 })
    }

    const existing = cart.find(p => p.id === id)
    if (existing) {
        // Ya existe, no agregamos más por POST
        return NextResponse.json({
            success: false,
            message: 'Producto ya existe en el carrito. Para modificar cantidad usar PUT.'
        }, { status: 400 })
    }

    // Si no existe, agregar con cantidad 1
    cart.push({ ...product, quantity: 1 })

    return NextResponse.json({ success: true, cart })
}

export async function PUT(req: NextRequest) {
    const { id, action } = await req.json() as { id: number; action: "increment" | "decrement" }

    const productIndex = cart.findIndex(p => p.id === id)

    if (productIndex === -1) {
        return NextResponse.json({ success: false, message: 'Producto no encontrado en carrito' }, { status: 404 })
    }

    const product = cart[productIndex]

    if (typeof product.quantity !== "number") {
        product.quantity = 1
    }

    if (action === "increment") {
        product.quantity += 1
    } else if (action === "decrement") {
        product.quantity -= 1
        // Si la cantidad llega a 0 o menos, eliminar producto del carrito
        if (product.quantity <= 0) {
            cart.splice(productIndex, 1)
        }
    } else {
        return NextResponse.json({ success: false, message: 'Acción inválida' }, { status: 400 })
    }

    return NextResponse.json({ success: true, cart })
}

// Método DELETE para vaciar el carrito
export async function DELETE() {
    cart.length = 0 // vacía el array
    return NextResponse.json({ success: true, cart })
}
