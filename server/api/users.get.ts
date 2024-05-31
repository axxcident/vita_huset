import { createPool, sql } from '@vercel/postgres'
import { defineEventHandler } from 'h3';

export default defineEventHandler(async () => {


  try {
    const users = await sql`SELECT * FROM users`;
    return users.rows;
  } catch (error) {
    console.log(error);
  }
})
