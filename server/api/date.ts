export default defineEventHandler((event) => {
	// console.log("Hello from date.ts")
	// console.log("Date is: ", new Date().toISOString())
	// return { date: new Date().toISOString() };
	const now = new Date(Date.now());

	// Set headers to prevent caching
	setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate');
	setHeader(event, 'Pragma', 'no-cache');

	return { date: now.toISOString() };
  });
