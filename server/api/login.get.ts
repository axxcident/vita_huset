import { defineEventHandler } from 'h3';
import { sql } from '@vercel/postgres'


export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { password } = query;

  // console.log('Query:', query);
  // console.log('Password:', password);

  if (!password) {
	return { success: false, message: 'Password is required' };
  }

  // console.log('password:', password)
  const passwordString = typeof password === 'string' ? password.toLowerCase() : password;
  // console.log('passwordString:', passwordString)


  try {
    const result = await sql`SELECT name FROM password LIMIT 1`;

    // Check if we got any results
    if (result.rows.length === 0) {
      console.error('No password found in database');
      return {
        success: false,
        message: 'System configuration error'
      };
    }

    // Get the password from the first row
    const correctPassword = result.rows[0].name;

    // Compare the provided password with the stored one
    if (passwordString === correctPassword) {
      return {
        success: true,
        message: 'Login successful'
      };
    } else {
      return {
        success: false,
        message: 'Invalid password'
      };
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Database error:', error.message);
      return sendError(event, createError({
        statusCode: 500,
        statusMessage: error.message
      }));
    } else {
      console.error('Unknown error:', error);
      return sendError(event, createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error'
      }));
    }
  }
});
