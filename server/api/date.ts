export default defineEventHandler((event) => {
	// console.log("Hello from date.ts")
	// console.log("Date is: ", new Date().toISOString())
	// return { date: new Date().toISOString() };

	// const now = new Date(Date.now());
	// // Set headers to prevent caching
	// setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate');
	// setHeader(event, 'Pragma', 'no-cache');
	// return { date: now.toISOString() };
	  // Get current date in the server's timezone
	  const now = new Date();

	  // Set comprehensive cache prevention headers
	  setHeaders(event, {
		'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
		'Pragma': 'no-cache',
		'Expires': '0',
		'Surrogate-Control': 'no-store',
		// Add a timestamp to force uniqueness
		'Last-Modified': now.toUTCString()
	  });

	  return {
		date: now.toISOString(),
		timestamp: now.getTime() // Add timestamp for verification
	  };
  });
