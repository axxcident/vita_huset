import { sql } from '@vercel/postgres';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // console.log("body is: ", body)

  try {
    // Check if the request is for a single booking or multiple bookings
    if (body.start_date && body.end_date) {
      console.log("Creates a multiple bookings")
      // Create a new user booking period
      const userBookingResult = await sql`
        INSERT INTO user_bookings (user_id, start_date, end_date)
        VALUES (${body.user_id}, ${body.start_date}, ${body.end_date})
        RETURNING user_booking_id;
      `;

      const userBookingId = userBookingResult.rows[0].user_booking_id;

      // Create individual bookings for each date within the booking period
      const bookingDates = generateDateRange(body.start_date, body.end_date);

      // console.log("bookingDates are: ", bookingDates)

      for (const date of bookingDates) {

        await sql`
          INSERT INTO bookings (user_id, booking_date, visitors_allowed)
          VALUES (${body.user_id}, ${date}::date, ${body.visitors_allowed || true});
        `;
        // await sql`
        //   INSERT INTO bookings (user_id, booking_date, visitors_allowed)
        //   VALUES (${body.user_id}, ${date}, ${body.visitors_allowed || true});
        // `;
      }

      return { userBookingId };
    } else {
      console.log("Creates a single booking")
      // Create a single booking
      const bookingResult = await sql`
        INSERT INTO bookings (user_id, booking_date, visitors_allowed)
        VALUES (${body.user_id}, ${body.booking_date}, ${body.visitors_allowed || true})
        RETURNING booking_id;
      `;

      const bookingId = bookingResult.rows[0].booking_id;
      return { bookingId };
    }
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});

// Helper function to generate a range of dates
function generateDateRange(start:Date, end:Date) {
  const dates = [];
  const startDate = new Date(start);
  const endDate = new Date(end);

  // hack to fix timezone issue
  // Add one day to the start date
  startDate.setDate(startDate.getDate() + 1);
  // Add one day to the end date
  endDate.setDate(endDate.getDate() + 1);

  while (startDate <= endDate) {
    dates.push(startDate.toISOString().split('T')[0]);
    startDate.setDate(startDate.getDate() + 1);
  }

  // console.log("in generateDateRange function")
  // console.log("dates are: ", dates)

  return dates;
}
