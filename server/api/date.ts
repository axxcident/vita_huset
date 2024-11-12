export default defineEventHandler(() => {
	// console.log("Hello from date.ts")
	// console.log("Date is: ", new Date().toISOString())
	return { date: new Date().toISOString() };
  });
