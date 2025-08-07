import { NextResponse } from 'next/server'
import { Producto } from '../../utils/data'

export async function GET() {
    return NextResponse.json(Producto)
}
