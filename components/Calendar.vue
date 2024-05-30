<template>
  <div class="month">
    <h1 class="text-white tracking-wide p-3 capitalize">Vita huset bokningskalender</h1>
    <ul>
        <li class="prev" @click="previousMonth">&#10094;</li>
        <li class="next" @click="nextMonth">&#10095;</li>
        <li>
          {{ monthName }}<br>
          <span style="font-size:25px">{{ year }}</span>
        </li>
    </ul>
  </div>

  <ul class="weekdays">
    <li>Mo</li>
    <li>Tu</li>
    <li>We</li>
    <li>Th</li>
    <li>Fr</li>
    <li>Sa</li>
    <li>Su</li>
  </ul>

  <ul class="days">
      <li v-for="day in days" :key="day">{{ day }}</li>
  </ul>

  <!-- <ul class="days">
    <li>9</li>
    <li><span class="active">10</span></li>
    <li>11</li>
  </ul> -->
</template>

<script>
import { ref, computed } from 'vue';
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
  background: url('@/assets/White-House.jpg') no-repeat center center;
  background-size: cover;
  text-align: center;
  height: 50vh;
}

.month h1 {
  font-size: 3rem;
  text-shadow:
    -1px -1px 0 #000,
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000;
}

.month ul {
  margin: 0;
  padding: 0;
}

.month ul li {
  color: white;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  /* -webkit-text-stroke: 1px black; */
  text-shadow:
    -1px -1px 0 #000,
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000;
}

.month .prev {
  float: left;
  padding: .5rem;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 40%;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.month .prev:hover {
  background-color: rgba(255, 255, 255, 0.6); /* Slightly more opaque */
  transform: scale(1.1); /* Slightly larger */
}

.month .prev:active {
  background-color: rgba(255, 255, 255, 0.8); /* Even more opaque */
  transform: scale(0.95); /* Slightly smaller to simulate a button press */
}

.month .next {
  float: right;
  padding: .5rem;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 40%;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.month .next:hover {
  background-color: rgba(255, 255, 255, 0.6); /* Slightly more opaque */
  transform: scale(1.1); /* Slightly larger */
}

.month .next:active {
  background-color: rgba(255, 255, 255, 0.8); /* Even more opaque */
  transform: scale(0.95); /* Slightly smaller to simulate a button press */
}

.weekdays {
  margin: 0;
  padding: 10px 0;
  background-color: #ddd;
}

.weekdays li {
  display: inline-block;
  width: 13.6%;
  color: #666;
  text-align: center;
}

.days {
  padding: 10px 0;
  background: #eee;
  margin: 0;
}

.days li {
  list-style-type: none;
  display: inline-block;
  width: 13.6%;
  text-align: center;
  margin-bottom: 5px;
  font-size:12px;
  color: #777;
}

.days li .active {
  padding: 5px;
  background: #1abc9c;
  color: white !important
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
