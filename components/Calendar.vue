<template>
  <h1>CSS Calendar</h1>

  <div class="month">
    <ul>
        <li class="prev" @click="previousMonth">&#10094;</li>
        <li class="next" @click="nextMonth">&#10095;</li>
        <li>
          {{ monthName }}<br>
          <span style="font-size:18px">{{ year }}</span>
        </li>
    </ul>
    <!-- <ul>
      <li class="prev">&#10094;</li>
      <li class="next">&#10095;</li>
      <li>
        August<br>
        <span style="font-size:18px">2021</span>
      </li>
    </ul> -->
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
      return currentDate.toLocaleString('default', { month: 'long' });
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
  background: #1abc9c;
  text-align: center;
}

.month ul {
  margin: 0;
  padding: 0;
}

.month ul li {
  color: white;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 3px;
}

.month .prev {
  float: left;
  padding-top: 10px;
}

.month .next {
  float: right;
  padding-top: 10px;
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
