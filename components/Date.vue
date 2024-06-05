<template>
  <div
    class="date"
    :class="{ 'booked': isBooked, 'can-book': canBook }"
    @click="handleBooking"
  >
    {{ day }}
  </div>
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

onMounted(async () => {
  const { data } = await useFetch(`/api/bookings?year=${props.year}&month=${props.month}&day=${props.day}&userId=${props.userId}`);
  isBooked.value = data.some((booking) => booking.booking_date.split('T')[0] === `${props.year}-${props.month + 1}-${props.day}`);
  canBook.value = !isBooked.value; // You can add additional logic here to determine if the date can be booked
});

const handleBooking = async () => {
  if (canBook.value) {
    // Send POST request to book the date
    const response = await $fetch('/api/bookings', {
      method: 'POST',
      body: {
        userId: props.userId,
        bookingDate: `${props.year}-${props.month + 1}-${props.day}`,
        visitorsAllowed: false, // Set the desired value
      },
    });

    // Update the UI based on the response
    isBooked.value = true;
    canBook.value = false;
  }
};
</script>

<style scoped>
.date {
  /* Add your styling for the date component */
}

.booked {
  /* Add styling for booked dates */
}

.can-book {
  /* Add styling for dates that can be booked */
}
</style>
