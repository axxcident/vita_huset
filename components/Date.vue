<template>
  <span
  class="date-container"
    :class="{
    'booked': isBooked,
    'visitorsAllowed': visitorsAllowed,
    'visitorsNotAllowed': !visitorsAllowed && isBooked,
    'selected': isSelected
    }"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <button
    class="date"
    :class="{'currentDay': isCurrentDay}"
    @click="toggleDate"
    :disabled="isBooked"
    >
      {{ day }}
    </button>
    <div v-if="showBookingInfo" class="tooltip">
      <p>Bokad av: {{ bookingInfo.userName }}</p>
      <p>Besökare: {{ visitorsAllowed ? 'Tillåtna' : 'Ej Tillåtna' }}</p>
    </div>
  </span>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDatesStore } from '~/stores/dates';

const datesStore = useDatesStore();

const props = defineProps({
  year: Number,
  month: Number,
  day: Number,
  isBooked: Boolean,
  visitorsAllowed: Boolean,
  bookingInfo: Object
});

const now = ref(null);
const showBookingInfo = ref(false);

onMounted(() => {
  now.value = new Date();
  setInterval(() => {
    now.value = new Date();
  }, 60000);
});

const isCurrentDay = computed(() => {
  if (!now.value) return false;
  return props.year === now.value.getFullYear() &&
         props.month === now.value.getMonth() &&
         props.day === now.value.getDate();
});

function getDateString() {
  const monthStr = (props.month + 1).toString().padStart(2, '0');
  const dayStr = props.day.toString().padStart(2, '0');
  return `${props.year}-${monthStr}-${dayStr}`;
}

const dateString = computed(() => getDateString());

const isSelected = computed(() => datesStore.selectedDates.includes(dateString.value));

function toggleDate() {
  datesStore.toggleSelectedDate(dateString.value);
}

function showTooltip() {
  if (props.isBooked) {
    showBookingInfo.value = true;
  }
}

function hideTooltip() {
  showBookingInfo.value = false;
}

</script>

<style scoped>

.date-container {
  position: relative;
  background-color: white;
  position: relative;
  text-align: center;
  font-size:2rem;
  border: 1px solid black;
  border-radius: .5rem;
}

.date-container .date {
  z-index: 2;
  width: 100%;
}

.booked {
  color: white;
  background-color: rgb(55, 55, 55);
  border: 1px solid rgb(255, 11, 11);
}

.currentDay {
  position: relative;
}

.currentDay::after {
  content: "Today";
  position: absolute;
  color: rgb(51, 168, 194);
  font-size: 0.5rem;
  top: 69%;
  left: -60%;
  right: 0;
  bottom: 0;
  z-index: 1;
}


/* Media queries for adjusting left property */
@media (max-width: 1200px) {
  .currentDay::after {
    left: -50%;
  }
}
 @media (max-width: 992px) {
  .currentDay::after {
    left: -40%;
  }
}

@media (max-width: 768px) {
  .currentDay::after {
    content: none;
  }
}

.currentDay::before {
  content: "";
  position: absolute;
  top: 70%;
  left: 5%;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  background-color: rgb(51, 168, 194);
  z-index: 2;
  pointer-events: none;
  border-radius: 100%;
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
  background-color: rgb(94, 194, 51);
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
  background-color: rgb(194, 51, 51);
  z-index: 1;
  pointer-events: none;
  border-radius: 100%;
}

.selected {
  color: white;
  background-color: rgb(51, 168, 194);
}

.tooltip {
  position: absolute;
  top: -100%;
  left: 70%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  color: black;
  padding: 5px;
  border-radius: 4px;
  border-width: 2px;
  border-color: rgba(0, 0, 0, 0.8);
  font-size: 0.7rem;
  z-index: 10;
  white-space: nowrap;
  transition: opacity 1s ease;
}

</style>
