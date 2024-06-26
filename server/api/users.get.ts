import { sql } from '@vercel/postgres'
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (events) => {

  const cookies = parseCookies(events);
  const query = getQuery(events);
  // console.log("events is: ", events)
  // console.log("query is: ", query)
  // console.log("cookies is: ",cookies)

  const date = new Date()
  // const date = new Date().toString()
  console.log(date)

  try {
    const users = await sql`SELECT * FROM users`;

    // If the query has a 'limit' parameter, you can apply it
    if (query.limit) {
      return users.rows.slice(0, parseInt(query.limit as string));
    }

    return users.rows;
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
