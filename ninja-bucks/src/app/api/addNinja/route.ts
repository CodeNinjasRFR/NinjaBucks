// app/api/users.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
export async function POST(request: NextRequest){
    noStore();
    const body = await request.json();
    const client = await sql.connect();
    try {
        const { rows } = await client.query('SELECT * FROM ninjas WHERE name = $1', [body.name]);
        if (rows.length>0) {
          return NextResponse.json("user already exists", {status:401});
        }
        await client.sql`INSERT INTO ninjas (name, bucks, location) VALUES (${body.name}, ${body.initialBalance},${body.location})`;
        return NextResponse.json({error:"successfully added: "+body.name+" to ninjas"}, {status:200});
  } catch (error) {
    console.log(error);
    return NextResponse.json({error:"Failed to create user"}, {status:500});
  }
}