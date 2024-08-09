// app/api/ninjas.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(request: NextRequest){
    noStore();

    const client = await sql.connect();

    try {
        const { rows } = await client.sql`SELECT * FROM ninjas`;
        if (rows.length === 0) {
          return NextResponse.json({ error: 'Incorrect username or password' }, { status: 401 });
        }
        return NextResponse.json({data:rows },{status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({data:[], status: 500 });
    }
}