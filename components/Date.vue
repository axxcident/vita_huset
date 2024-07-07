<template>
  <span
  class="date-container"
    :class="{ 'booked': isBooked, 'visitorsAllowed': visitorsAllowed }"
  >
    <span class="date">
      {{ day }}
    </span>
</span>
</template>

<!-- <span
class="date"
:class="{ 'booked': isBooked, 'visitorsAllowed': visitorsAllowed }"
@click="handleBooking"
>
{{ day }}
</span> -->

<script setup>
import { ref, onMounted } from 'vue';
import { useFetch } from '#app';

const props = defineProps({
  year: Number,
  month: Number,
  day: Number,
  userId: String,
  isBooked: Boolean,
  visitorsAllowed: Boolean,
});

// const isBooked = ref(false);
const canBook = ref(false);

// console.log("props.year, props.month, props.day, props.userId");
// console.log(props.year, props.month, props.day, props.userId);


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

/* .days li .active {
  padding: 5px;
  background: #1abc9c;
  color: white !important
} */

.date-container {
  display: inline-block;
  background-color: rgb(42, 42, 42);
  min-width: 100%;
  position: relative;
  /* overflow: hidden; */
}

.date-container .date {
  position: relative;
  z-index: 2;
}

/* .date-container span {
  position: relative;
  z-index: 2;
} */

.booked {
  background-color: rgb(160, 42, 42);
}

.visitorsAllowed {
  position: relative;
}

.visitorsAllowed::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom right, transparent 75%, rgb(187, 187, 187) 50%);
  z-index: 1;
  pointer-events: none;
}

</style>
