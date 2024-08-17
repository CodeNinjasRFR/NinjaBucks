// app/api/ninjas.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function POST(request: NextRequest){
    noStore();

    const client = await sql.connect();
    const body = await request.json();
    try {
        const { rows } = await client.query('SELECT * FROM ninjas WHERE id = $1', [body.id]);
        if (rows.length==0) {
          return NextResponse.json({ error: 'Incorrect username or password' }, { status: 401 });
        }
        const ninja = rows[0];
        const newBucks = ninja.bucks + (body.queryAmount || 0);
        console.log(newBucks)
        if (newBucks < 0) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 401 });
        }
        
        await client.query('UPDATE ninjas SET bucks = $1 WHERE id = $2', [newBucks, body.id]);
        return NextResponse.json({ status: 'success', updatedBucks: newBucks }, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({error:
            'Backend error', status: 500 });
    }
}