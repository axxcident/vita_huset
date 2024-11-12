<template>
  <div class="month sm:pb-10 sm:pt-10 pt-0 sm:py-[70px] sm:text-center text-start sm:mb-32 mb-12">
    <h1 class="text-white tracking-wide p-3 capitalize">vita huset bokningskalender</h1>
    <section>
        <h4 class="sm:text-[4rem] text-[1.8rem] leading-none capitalize px-3 text-center">
          {{ monthName }}
          <span class="text-[1.2rem]">{{ year }}</span>
        </h4>
    </section>
  </div>

  <section class="relative flex w-full">
      <button id="prev" class="absolute pb-[6px] pr-[4px] left-[10%] lg:left-[25%] top-[-5rem] cursor-pointer text-6xl w-[2.5rem]" @click="previousMonth">&#10094;</button>
      <button id="next" class="absolute pb-[6px] lg:right-[25%] right-[10%] top-[-5rem] cursor-pointer text-6xl w-[2.5rem]" @click="nextMonth">&#10095;</button>


      <div class="sm:ml-4 ml-0 w-min">
        <div class="mt-[5px] sm:mt-[-5px] mb-[10px] sm:w-full">
          <p class="text-center text-[10px] sm:text-[18px] leading-tight mb-1">Vecko- nummer</p>
        </div>

        <div class="rounded-lg bg-[rgba(61,61,61,0.1)] sm:w-full sm:mt-0 mt-[17px]">
          <ul class="w-[100%] mx-auto grid grid-rows-6 grid-cols-1 sm:gap-[24px] gap-[22px] sm:pt-0 pt-[11px] pb-[11px]">
            <li v-for="week in weeks" :key="week" class="text-center text-xl sm:text-3xl">{{ week }}</li>
          </ul>
        </div>
      </div>

      <div class="w-full">

        <div class="weekdays sm:w-[90%] w-[99%] mx-auto mb-4 text-2xl grid grid-cols-7">
          <span class="text-center">Må</span>
          <span class="text-center">Ti</span>
          <span class="text-center">On</span>
          <span class="text-center">To</span>
          <span class="text-center">Fr</span>
          <span class="text-center">Lö</span>
          <span class="text-center">Sö</span>
        </div>

        <div class="days w-full sm:w-[90%] mx-auto grid grid-cols-7 gap-0 sm:gap-2">
          <div v-if="!isDataLoaded" class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
          <template v-else v-for="(day, index) in days" :key="index">
            <Date v-if="day !== null"
              :year="year"
              :month="month"
              :day="day"
              :isBooked="isDateBooked(day)"
              :visitorsAllowed="getVisitorsAllowed(day)"
              :bookingInfo="getBookingInfo(day)"
              :idag="idag"
              :key="`${year}-${month}-${day}`"
            />
            <div v-else class="empty-cell"></div>
          </template>
        </div>

      </div>

    </section>
    <div class="flex sm:flex-row flex-col justify-center items-center">
      <MySelectedDates
        :year="year"
        :month="month"
        :bookings="bookings"
        @bookings-updated="fetchBookings"
      />
      <SelectedDates @booking-complete="handleBookingComplete"/>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { $fetch } from 'ofetch';
import SelectedDates from './SelectedDates.vue';
import MySelectedDates from './MySelectedDates.vue';

  const currentDate = new Date();
  const year = ref(currentDate.getFullYear());
  const month = ref(currentDate.getMonth());
  const bookings = ref([]);
  const isDataLoaded = ref(false);

  const { data: serverDate } = await useFetch('/api/date', {
    server: true,
  });

  const idag = computed(() => {
    if (!serverDate.value?.date) return null;
    const date = new Date(serverDate.value.date);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    };
  });

  const monthName = computed(() => {
  const date = new Date(year.value, month.value);
    return date.toLocaleString('sv-SE', { month: 'long' });
  });

  const isDateBooked = (day) => {
    if (!bookings.value || !Array.isArray(bookings.value)) return false;
    const dateStr = formatDateString(year.value, month.value, day);
    return bookings.value.some(booking => booking.booking_date === dateStr);
  };

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  const getVisitorsAllowed = (day) => {
    if (!bookings.value || !Array.isArray(bookings.value)) return false;
    const dateStr = formatDateString(year.value, month.value, day);
    const booking = bookings.value.find(b => b.booking_date === dateStr);
    return booking ? booking.visitors_allowed : false;
  };

  const getBookingInfo = (day) => {
    if (!bookings.value || !Array.isArray(bookings.value)) return null;
    const dateStr = formatDateString(year.value, month.value, day);
    const booking = bookings.value.find(b => b.booking_date === dateStr);
    return booking ? {
      userName: booking.user_name || 'Anonymous',
      userId: booking.user_id,
      visitorsAllowed: booking.visitors_allowed
    } : null;
  };

  function formatDateString(year, month, day) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  }

  async function fetchBookings() {
    try {
      // Use $fetch instead of fetch
      const data = await $fetch('/api/bookings', {
        method: 'GET',
        params: {
          year: year.value,
          month: month.value
        }
      });

      if (data && Array.isArray(data)) {
        bookings.value = data;
      } else {
        bookings.value = [];
        console.warn('Received invalid bookings data format');
      }
      isDataLoaded.value = true;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      bookings.value = [];
      isDataLoaded.value = true;
    }
  }

  watch([year, month], async () => {
    isDataLoaded.value = false;
    await fetchBookings();
    isDataLoaded.value = true;
  });

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

  onMounted(async () => {
    // Small delay to ensure component is fully mounted
    await new Promise(resolve => setTimeout(resolve, 100));
    await fetchBookings();
    isDataLoaded.value = true;
  });
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
  width: 100%;
  /* background: url('@/assets/vita_hus_WM.jpg') no-repeat center center; */
  /* background-size: cover; */
  height: 10rem;
}

.month h1 {
  font-size: 2.5em;
  text-shadow:
    -1px -1px 0 #000,
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
</style>
