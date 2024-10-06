import { sql } from '@vercel/postgres';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // console.log("body is: ", body)

  try {
    if (Array.isArray(body.booking_dates) && body.booking_dates.length > 0) {
      console.log("Creating multiple bookings for selected dates")

      for (const date of body.booking_dates) {
        await sql`
          INSERT INTO bookings (user_id, user_name, booking_date, visitors_allowed)
          VALUES (${body.user_id}, ${body.user_name}, ${date}::date, ${body.visitors_allowed});
        `;
      }

      return { status: 201, message: "Multiple bookings created: 201 Success" };
    } else {
      console.error("Invalid booking dates provided");
      throw createError({ statusCode: 400, statusMessage: 'Invalid booking dates' });
    }
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
