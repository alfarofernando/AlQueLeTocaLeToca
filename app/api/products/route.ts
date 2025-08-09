import { NextResponse } from 'next/server'
import { Producto } from '../../data/data'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const theme = searchParams.get("theme");

    if (theme) {
        return NextResponse.json(
            Producto.filter((p) => p.theme.toLowerCase() === theme.toLowerCase())
        );
    }

    return NextResponse.json(Producto);
}



