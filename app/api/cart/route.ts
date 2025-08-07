import { NextRequest, NextResponse } from 'next/server'

type Product = {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const cart: Product[] = []

export async function GET() {
    return NextResponse.json(cart)
}

export async function POST(req: NextRequest) {
    const product: Omit<Product, 'quantity'> = await req.json()

    // Verifico si ya existe para sumar cantidad 1
    const existing = cart.find(p => p.id === product.id)
    if (existing) {
        existing.quantity += 1
    } else {
        cart.push({ ...product, quantity: 1 })
    }

    return NextResponse.json({ success: true, cart })
}

export async function PUT(req: NextRequest) {
    const { id, action } = await req.json() as { id: number; action: 'increment' | 'decrement' }

    const index = cart.findIndex(p => p.id === id)
    if (index === -1) {
        // Si no existe y es incrementar, agrego con cantidad 1
        if (action === 'increment') {
            // Aquí podrías requerir info del producto para agregarlo, por ahora no hago nada
            return NextResponse.json({ success: false, message: 'Producto no encontrado para incrementar' }, { status: 404 })
        } else {
            return NextResponse.json({ success: false, message: 'Producto no existe para decrementar' }, { status: 404 })
        }
    }

    if (action === 'increment') {
        cart[index].quantity += 1
    } else if (action === 'decrement') {
        cart[index].quantity -= 1
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1) // elimino producto si qty 0
        }
    }

    return NextResponse.json({ success: true, cart })
}
