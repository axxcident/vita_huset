<template>
  <div class="month">
    <h1 class="text-white tracking-wide p-3 capitalize">vita huset bokningskalender</h1>
    <section>
        <h4 class="text-[4rem] leading-none">
          {{ monthName }}
          <span class="text-[1.2rem]">{{ year }}</span>
        </h4>
    </section>
  </div>

  <section class="relative">
      <button id="prev" class="absolute left-[25%] top-[-5rem] cursor-pointer text-6xl w-[2.5rem]" @click="previousMonth">&#10094;</button>
      <button id="next" class="absolute right-[25%] top-[-5rem] cursor-pointer text-6xl w-[2.5rem]" @click="nextMonth">&#10095;</button>

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
        <Date v-for="day in days"
        :key="day"
        :year="year"
        :month="month"
        :day="day"
        :isBooked="isBooked(day)"
        :visitorsAllowed="getVisitorsAllowed(day)"
        :currentDay="isCurrentDay(day)"
        />
      </div>
  </section>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { defineStore } from 'pinia'
import { useFetch } from '#app';

export default {
  setup () {
    const currentDate = new Date();
    const year = ref(currentDate.getFullYear());
    const month = ref(currentDate.getMonth());
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const bookings = ref([]);

    const monthName = computed(() => {
      const date = new Date(year.value, month.value);
      return date.toLocaleString('default', { month: 'long' });
    });

    function getDaysInMonth(year, month) {
      return new Date(year, month + 1, 0).getDate();
    }

    const isCurrentDay = (day) => {
      return year.value === currentYear && month.value === currentMonth && day === currentDay;
    };

    // async function fetchBookings() {
    //   const { data } = await useFetch(`/api/bookings?year=${year.value}&month=${month.value}`);
    //   bookings.value = data.value;
    // }

    // onMounted(() => {

    //   if (bookings.value.length === 0) {
    //     fetchBookings();
    //   }
    //   // fetchBookings();
    // });


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

    async function fetchBookings() {
      const { data } = await useFetch(`/api/bookings?year=${year.value}&month=${month.value}`);
      bookings.value = data.value || [];
    }

    watch([year, month], fetchBookings, { immediate: true });


    const days = computed(() => {
      const daysInMonth = getDaysInMonth(year.value, month.value);
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    });

    // const isBooked = (day) => {
    //   return bookings.value.some(booking => new Date(booking.booking_date).getDate() === day);
    // };

    // const getVisitorsAllowed = (day) => {
    //   const booking = bookings.value.find(booking => new Date(booking.booking_date).getDate() === day);
    //   return booking ? booking.visitors_allowed : false;
    // };

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


    return {
      year,
      month,
      monthName,
      days,
      nextMonth,
      previousMonth,
      isBooked,
      getVisitorsAllowed,
      isCurrentDay,
    }
  }
}
</script>

<style scoped>
  * {box-sizing: border-box;}
  ul {list-style-type: none;}

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
  font-size: 2em;
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
  background-color: rgba(52, 52, 52, 0.6);
  transform: scale(1.1);
}

#next:active {
  color: #000;
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(0.95);
}

/* Flytta dessa MOBILE FIRST till Date.Vue? */
@media screen and (max-width:720px) {
  .weekdays span, .days span {width: 13.1%;}
}

@media screen and (max-width: 420px) {
  .weekdays span, .days span {width: 12.5%;}
  .days li .active {padding: 2px;}
}

@media screen and (max-width: 290px) {
  .weekdays span, .days span {width: 12.2%;}
}
</style>
