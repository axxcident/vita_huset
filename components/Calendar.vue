<template>
  <div class="month">
    <h1 class="text-white tracking-wide p-3 capitalize mt-20">vita huset bokningskalender</h1>
    <section class="relative">
        <h4 class="text-[2rem]">
          {{ monthName }}
          <span class="text-[1.2rem]">{{ year }}</span>
        </h4>
    </section>
  </div>

  <ul class="weekdays mt-40 mb-4 text-2xl">
    <li>Mo</li>
    <li>Tu</li>
    <li>We</li>
    <li>Th</li>
    <li>Fr</li>
    <li>Sa</li>
    <li>Su</li>
  </ul>

  <section class="relative">
      <button id="prev"class="absolute left-1 top-[7rem] cursor-pointer text-5xl w-[2.5rem]" @click="previousMonth">&#10094;</button>
      <button id="next" class="absolute right-1 top-[7rem] cursor-pointer text-5xl w-[2.5rem]" @click="nextMonth">&#10095;</button>
      <!-- <ul class="days w-full flex flex-wrap justify-center">
          <li v-for="day in days" :key="day">{{ day }}</li>
          <Date :year="year" :month="month" :day="day" :userId="userId" />
      </ul> -->
      <ul class="days w-full flex flex-wrap justify-center">
        <li v-for="day in days" :key="day" class="list-none">
          <Date :year="year" :month="month" :day="day" userId="user123" />
        </li>
      </ul>
  </section>

  <!-- <ul class="days">
    <li>9</li>
    <li><span class="active">10</span></li>
    <li>11</li>
  </ul> -->
</template>

<script>
import { ref, computed } from 'vue';
// import Date from './Date.vue'; //behövs ej tror jag
export default {
  setup () {
    const currentDate = new Date();
    const year = ref(currentDate.getFullYear());
    const month = ref(currentDate.getMonth());

    const monthName = computed(() => {
      const date = new Date(year.value, month.value);
      return date.toLocaleString('default', { month: 'long' });
    });

    function getDaysInMonth(year, month) {
      return new Date(year, month + 1, 0).getDate();
    }

    const days = computed(() => {
      const daysInMonth = getDaysInMonth(year.value, month.value);
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    });

    const nextMonth = () => {
      if (month.value === 11) {
        month.value = 0;
        year.value++;
      } else {
        month.value++;
      }
    };

    const previousMonth = () => {
      if (month.value === 0) {
        month.value = 11;
        year.value--;
      } else {
        month.value--;
      }
    };


    return {
      year,
      month,
      monthName,
      days,
      nextMonth,
      previousMonth
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
  background: url('@/assets/vita_huset_DM.jpg') no-repeat center center;
  background-size: cover;
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

/* .month ul {
  margin: 0;
  padding: 0;
} */

/* .month ul li {
  color: white;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  /* -webkit-text-stroke: 1px black;
  text-shadow:
    -1px -1px 0 #000,
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000;
} */

#prev {
  border-radius: 28%;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

#prev:hover {
  background-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.1);
}

#prev:active {
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(0.95);
}

#next {
  border-radius: 28%;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

#next:hover {
  background-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.1);
}

#next:active {
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(0.95);
}

.weekdays li {
  display: inline-block;
  width: 13.6%;
  text-align: center;
}

.days li {
  list-style-type: none;
  display: inline-block;
  width: 13.6%;
  text-align: center;
  margin: 5px;
  font-size:2rem;
  border: 2px solid white;
}

@media screen and (max-width:720px) {
  .weekdays li, .days li {width: 13.1%;}
}

@media screen and (max-width: 420px) {
  .weekdays li, .days li {width: 12.5%;}
  .days li .active {padding: 2px;}
}

@media screen and (max-width: 290px) {
  .weekdays li, .days li {width: 12.2%;}
}
</style>
