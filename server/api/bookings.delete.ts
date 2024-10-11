import { sql } from '@vercel/postgres';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    if (Array.isArray(body.booking_dates) && body.booking_dates.length > 0 && body.user_id) {
      // console.log("Deleting bookings for selected dates")

      for (const date of body.booking_dates) {
        await sql`
          DELETE FROM bookings
          WHERE user_id = ${body.user_id}::uuid
          AND booking_date = ${date}::date;
        `;
      }

      return { status: 200, message: "Bookings deleted successfully" };
    } else {
      console.error("Invalid booking dates or user_id provided");
      throw createError({ statusCode: 400, statusMessage: 'Invalid booking dates or user_id' });
    }
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
