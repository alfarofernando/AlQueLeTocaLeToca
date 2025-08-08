import { NextResponse } from 'next/server'
import { Producto } from '../../data/data'

export async function GET() {
    return NextResponse.json(Producto)
}
