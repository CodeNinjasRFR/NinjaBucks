// app/api/ninjas.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(request: NextRequest) {
    noStore();

    // Get query parameters for pagination and filtering
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const filter = url.searchParams.get('filter') || ''; // Get the filter parameter
    const offset = (page - 1) * limit;
    const client = await sql.connect();

    try {
        if(filter){
            const { rows: countRows } = await client.sql`Select COUNT(*) AS total FROM ninjas WHERE name ILIKE ${`%${filter}%`} `;
            const total = parseInt(countRows[0].total, 10);
            const totalPages = Math.ceil(total / limit);
            const { rows } = await client.sql`
                SELECT * FROM ninjas
                WHERE name ILIKE ${`%${filter}%`}
                ORDER BY id ASC
                LIMIT ${limit}
                OFFSET ${offset}
            `;
            return NextResponse.json({
                data: rows,
                pagination: {
                    page,
                    totalPages
                }
            }, { status: 200 });
        }
        else{
            const { rows: countRows } = await client.sql`Select COUNT(*) AS total FROM ninjas`;
            const total = parseInt(countRows[0].total, 10);
            const totalPages = Math.ceil(total / limit);

            const { rows } = await client.sql`
                SELECT * FROM ninjas
                ORDER BY id ASC
                LIMIT ${limit}
                OFFSET ${offset}
            `;
            return NextResponse.json({
                data: rows,
                pagination: {
                    page,
                    totalPages
                }
            }, { status: 200 });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ data: [], error: 'Internal Server Error' }, { status: 500 });
    }
}
