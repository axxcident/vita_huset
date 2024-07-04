<template>
  <span
    class="date"
    :class="{ 'booked': isBooked, 'can-book': canBook }"
    @click="handleBooking"
  >
    {{ day }}
</span>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFetch } from '#app';

const props = defineProps({
  year: Number,
  month: Number,
  day: Number,
  userId: String,
});

const isBooked = ref(false);
const canBook = ref(false);

// onMounted(async () => {
//   const { data } = await useFetch(`/api/bookings?year=${props.year}&month=${props.month}&day=${props.day}&userId=${props.userId}`);
//   isBooked.value = data.some((booking) => booking.booking_date.split('T')[0] === `${props.year}-${props.month + 1}-${props.day}`);
//   canBook.value = !isBooked.value;
// });

// const handleBooking = async () => {
//   if (canBook.value) {
//     // Send POST request to book the date
//     const response = await $fetch('/api/bookings', {
//       method: 'POST',
//       body: {
//         userId: props.userId,
//         bookingDate: `${props.year}-${props.month + 1}-${props.day}`,
//         visitorsAllowed: false, // Set the desired value
//       },
//     });

//     // Update the UI based on the response
//     isBooked.value = true;
//     canBook.value = false;
//   }
// };
</script>

<style scoped>
/* .date {
  list-style-type: none;
  display: inline-block;
  width: 13.6%;
  text-align: center;
  margin: 5px;
  font-size:2rem;
  border: 2px solid white;
} */

.days li .active {
  padding: 5px;
  background: #1abc9c;
  color: white !important
}

.booked {
  /* Add styling for booked dates */
}

.can-book {
  /* Add styling for dates that can be booked */
}
</style>
