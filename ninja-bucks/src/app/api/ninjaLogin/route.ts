// app/api/users.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
export async function POST(request: NextRequest){
    noStore();
    const body = await request.json();
    const client = await sql.connect();
    try {
        const { rows } = await client.query('SELECT * FROM ninjas WHERE name = $1', [body.username]);
        if (rows.length>0) {
          return NextResponse.json("Logged in as " + body.username, {status:200});
        }
        else{
          return NextResponse.json({error:"ninja not found"}, {status:500});
        }
        
  } catch (error) {
    console.log(error);
    return NextResponse.json({error:"Failed to login"}, {status:401});
  }
}