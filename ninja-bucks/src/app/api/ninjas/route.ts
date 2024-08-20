// app/api/ninjas.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(request: NextRequest) {
    noStore();

    // Get query parameters for pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;
    const client = await sql.connect();

    try {
        // Fetch paginated data
        const { rows } = await client.sql`
            SELECT * FROM ninjas
            LIMIT ${limit}
            OFFSET ${offset}
        `;
        
        // Fetch total count for pagination metadata
        const { rows: countRows } = await client.sql`SELECT COUNT(*) AS total FROM ninjas`;
        const total = parseInt(countRows[0].total, 10);
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            data: rows,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ data: [], error: 'Internal Server Error' }, { status: 500 });
    }
}
