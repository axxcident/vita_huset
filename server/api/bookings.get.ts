import { sql } from '@vercel/postgres'
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (events) => {

  const cookies = parseCookies(events);
  const query = getQuery(events);
  // console.log("events is: ", events)
  // console.log("query is: ", query)
  // console.log("cookies is: ",cookies)

  // "booking_id": 42,
  // "user_id": "42bbd328-08d7-4d92-b37c-128dd7f50cbc",
  // "booking_date": "2024-02-10T23:00:00.000Z",
  // "visitors_allowed": true

  try {
    // const bookings = await sql`SELECT * FROM bookings`;
    // const bookings = await sql`SELECT booking_date::text FROM bookings`;
    const bookings = await sql`SELECT booking_id, user_id, booking_date::text, visitors_allowed FROM bookings`;

    return bookings.rows;
  }

  catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      // handle Error object
      sendError(events, error);
    } else if (typeof error === 'string') {
      console.error(error);
      // handle string error
      sendError(events, createError({ statusCode: 500, statusMessage: 'Else if: Internal Server Error' }));
    } else {
      console.error(error);
      sendError(events, createError({ statusCode: 500, statusMessage: 'Else: Internal Server Error' }));
      // handle other types of errors
    }
  }
})
