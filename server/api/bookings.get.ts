import { sql } from '@vercel/postgres'
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (events) => {


  // const cookies = parseCookies(events);
  const query = getQuery(events);
  // console.log("events is: ", events)
  // console.log("query is: ", query)
  // console.log("cookies is: ",cookies)

  const { month, year } = query;
  // console.log("Query params:", query);

  try {
    // const bookings = await sql`SELECT * FROM bookings`;
    // const bookings = await sql`SELECT booking_date::text FROM bookings`;
    // const bookings = await sql`SELECT booking_id, user_id, booking_date::text, visitors_allowed FROM bookings`;

    // Check if month and year parameters are provided
    if (!month || !year) {
      throw new Error('Missing month or year parameter');
    }

    // Convert month and year to integers
    let monthInt = parseInt(month as string, 10);
    monthInt = monthInt + 1;
    // console.log("monthInt is: ", monthInt)
    const yearInt = parseInt(year as string, 10);

    const bookings = await sql`SELECT booking_id, user_id, user_name, booking_date::text, visitors_allowed FROM bookings WHERE EXTRACT(MONTH FROM booking_date) = ${monthInt} AND EXTRACT(YEAR FROM booking_date) = ${yearInt} ORDER BY booking_date ASC`;

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
