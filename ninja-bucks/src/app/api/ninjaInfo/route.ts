// app/api/users.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function POST(request: NextRequest) {
    noStore();
    const body = await request.json();

    // Validate the request body to ensure it contains the required field
    if (!body.username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const client = await sql.connect();
    try {
        // Adjust the query to select all required fields
        const { rows } = await client.query(
            'SELECT id, name, location, bucks FROM ninjas WHERE name = $1',
            [body.username]
        );

        if (rows.length > 0) {
            // Return the full details of the ninja
            return NextResponse.json(rows[0], { status: 200 });
        } else {
            return NextResponse.json({ error: "Ninja not found" }, { status: 404 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch ninja details" }, { status: 500 });
    } finally {
        client.release(); // Ensure the client is released back to the pool
    }
}
