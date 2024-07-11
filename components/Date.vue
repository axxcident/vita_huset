<template>
  <span
  class="date-container"
    :class="{
    'booked': isBooked,
    'visitorsAllowed': visitorsAllowed,
    'visitorsNotAllowed': !visitorsAllowed && isBooked}"
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

// console.log("for date: ", props.day, "visitors are allowed: ", props.visitorsAllowed);

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

.date-container {
  background-color: white;
  /* background-color: rgb(42, 42, 42); */
  position: relative;
  /* overflow: hidden; */
  text-align: center;
  font-size:2rem;
  border: 1px solid black;
  border-radius: .5rem;
}

.date-container .date {
  position: relative;
  z-index: 2;
}

.booked {
  color: white;
  background-color: rgb(55, 55, 55);
  border: 1px solid rgb(255, 11, 11);
  /* background-color: rgb(160, 42, 42); */
}

.visitorsAllowed {
  position: relative;
}

.visitorsAllowed::before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  background-color: rgb(194, 51, 51);
  z-index: 1;
  pointer-events: none;
  border-radius: 100%;
}

.visitorsNotAllowed::before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  background-color: rgb(94, 194, 51);
  z-index: 1;
  pointer-events: none;
  border-radius: 100%;
}

/*
.visitorsAllowed::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom right, transparent 75%, rgb(255, 42, 42) 50%);
  /* background: linear-gradient(to bottom right, transparent 75%, rgb(187, 187, 187) 50%);
  z-index: 1;
  pointer-events: none;
  border-bottom-right-radius: .9rem;
} */

</style>
