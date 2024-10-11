<template>
  <div class="month">
    <h1 class="text-white tracking-wide p-3 capitalize">vita huset bokningskalender</h1>
    <section>
        <h4 class="text-[4rem] leading-none capitalize">
          {{ monthName }}
          <span class="text-[1.2rem]">{{ year }}</span>
        </h4>
    </section>
  </div>

  <section class="relative flex w-full">
      <button id="prev" class="absolute pb-[6px] pr-[4px] left-[25%] top-[-5rem] cursor-pointer text-6xl w-[2.5rem]" @click="previousMonth">&#10094;</button>
      <button id="next" class="absolute pb-[6px] right-[25%] top-[-5rem] cursor-pointer text-6xl w-[2.5rem]" @click="nextMonth">&#10095;</button>


      <div class="ml-4">
        <div class="mt-[-5px] mb-[10px]">
          <p class="text-center text-[18px] leading-tight mb-1">Vecko- nummer</p>
        </div>

        <div class="rounded-lg bg-[rgba(61,61,61,0.1)]">
          <ul class="w-[100%] mx-auto grid grid-rows-6 grid-cols-1 gap-[24px]">
            <li v-for="week in weeks" :key="week" class="text-center text-3xl">{{ week }}</li>
          </ul>
        </div>

      </div>

      <div class="w-full">

        <div class="weekdays w-[90%] mx-auto mb-4 text-2xl grid grid-cols-7">
          <span class="text-center">Må</span>
          <span class="text-center">Ti</span>
          <span class="text-center">On</span>
          <span class="text-center">To</span>
          <span class="text-center">Fr</span>
          <span class="text-center">Lö</span>
          <span class="text-center">Sö</span>
        </div>

        <div class="days w-[90%] mx-auto grid grid-cols-7 gap-2">
          <template v-for="(day, index) in days" :key="index">
            <Date v-if="day !== null"
              :year="year"
              :month="month"
              :day="day"
              :isBooked="isBooked(day)"
              :visitorsAllowed="getVisitorsAllowed(day)"
              :bookingInfo="getBookingInfo(day)"
            />
            <div v-else class="empty-cell"></div>
          </template>
        </div>

      </div>

    </section>
    <MySelectedDates
      :year="year"
      :month="month"
      :bookings="bookings"
      @bookings-updated="fetchBookings"
    />
    <SelectedDates @booking-complete="handleBookingComplete"/>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useFetch } from '#app';
import SelectedDates from './SelectedDates.vue';
import MySelectedDates from './MySelectedDates.vue';
// import Date from './Date.vue';

// export default {
  // setup () {
  const currentDate = new Date();
  const year = ref(currentDate.getFullYear());
  const month = ref(currentDate.getMonth());

  const bookings = ref([]);

  const monthName = computed(() => {
  const date = new Date(year.value, month.value);
    return date.toLocaleString('sv-SE', { month: 'long' });
  });

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  const bookingsMap = computed(() => {
    const map = new Map();
    bookings.value.forEach(booking => {
      const day = new Date(booking.booking_date).getDate();
      map.set(day, booking);
    });
    return map;
  });

  const isBooked = computed(() => (day) => bookingsMap.value.has(day));

  const getVisitorsAllowed = computed(() => (day) => {
    const booking = bookingsMap.value.get(day);
    return booking ? booking.visitors_allowed : false;
  });

  const getBookingInfo = computed(() => (day) => {
  const booking = bookingsMap.value.get(day);
    return booking ? {
      userName: booking.user_name || 'Anonymous',
      userId: booking.user_id,
      visitorsAllowed: booking.visitors_allowed
    } : null;
  });

  async function fetchBookings() {
    const { data } = await useFetch(`/api/bookings?year=${year.value}&month=${month.value}`);
    bookings.value = data.value || [];
  }

  watch([year, month], fetchBookings);
    // watch([year, month], fetchBookings, { immediate: true }); KANSKE TA TILLBAKA

  onMounted(fetchBookings);

  function handleBookingComplete() {
    fetchBookings();
  }

  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  }

  const weeks = computed(() => {
  const daysInMonth = getDaysInMonth(year.value, month.value);
  const firstDateOfMonth = new Date(year.value, month.value, 1);
  const lastDateOfMonth = new Date(year.value, month.value, daysInMonth);

  let firstWeek = getWeekNumber(firstDateOfMonth);
  let lastWeek = getWeekNumber(lastDateOfMonth);

  const weekNumbers = [];

    // Handle year-end cases
    if (month.value === 11) {
      for (let week = firstWeek; week <= 52; week++) {
        weekNumbers.push(week);
      }
      if (lastWeek === 1) {
        weekNumbers.push(1);
      }
    } else {
      for (let week = firstWeek; week <= lastWeek; week++) {
        weekNumbers.push(week);
      }
    }

  return weekNumbers;
});

  const days = computed(() => {
    const daysInMonth = getDaysInMonth(year.value, month.value);
    const firstDay = getFirstDayOfMonth(year.value, month.value);

    // Adjust for Monday as the first day of the week
    const adjustment = firstDay === 0 ? 6 : firstDay - 1;

    // Create array with empty cells for days before the month starts
    const emptyCells = Array(adjustment).fill(null);

    // Create array with the days of the month
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Combine empty cells and month days
    return [...emptyCells, ...monthDays];
  });

  const nextMonth = () => {
    if (month.value === 11) {
      month.value = 0;
      year.value++;
    } else {
      month.value++;
    }
    fetchBookings();
  };

  const previousMonth = () => {
    if (month.value === 0) {
      month.value = 11;
      year.value--;
    } else {
      month.value--;
    }
    fetchBookings();
  };

  // return {
  //   year,
  //   month,
  //   monthName,
  //   days,
  //   nextMonth,
  //   previousMonth,
  //   isBooked,
  //   getVisitorsAllowed,
  //   weeks,
  //   handleBookingComplete,
  //   getBookingInfo
  // }
  // }
// }
</script>

<style scoped>
  * {box-sizing: border-box;}
  ul {list-style-type: none;}

.empty-cell {
  position: relative;
  background-color: rgb(170, 170, 170);
  position: relative;
  text-align: center;
  font-size:2rem;
  border: 1px solid black;
  border-radius: .5rem;
}

.month {
  padding: 70px 25px;
  width: 100%;
  /* background: url('@/assets/vita_hus_WM.jpg') no-repeat center center; */
  /* background-size: cover; */
  text-align: center;
  height: 10rem;
  margin-bottom: 8rem;
}

.month h1 {
  font-size: 2.5em;
  text-shadow:
    -1px -1px 0 #000,
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000;
}

#prev {
  border-radius: 28%;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

#prev:hover {
  color: rgb(255, 255, 255);
  background-color: rgba(52, 52, 52, 0.6);
  transform: scale(1.1);
}

#prev:active {
  color: #000;
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(0.95);
}

#next {
  border-radius: 28%;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

#next:hover {
  color: rgb(255, 255, 255);
  background-color: #34343499;
  transform: scale(1.1);
}

#next:active {
  color: #000;
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(0.95);
}

/* Flytta dessa MOBILE FIRST till Date.Vue? */
@media screen and (max-width:720px) {
 .days button {width: 13.1%;}
}

@media screen and (max-width: 420px) {
  .weekdays span, .days button {width: 12.5%;}
  .days li .active {padding: 2px;}
}

@media screen and (max-width: 290px) {
  .weekdays span, .days button {width: 12.2%;}
}
</style>
