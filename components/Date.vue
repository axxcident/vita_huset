<template>
  <span
  class="date-container"
    :class="{
    'booked': isBooked,
    'visitorsAllowed': visitorsAllowed,
    'visitorsNotAllowed': !visitorsAllowed && isBooked,
    'selected': isSelected,
    'user-booked': isUserBooked,
    'selected-for-unbooking': isSelectedForUnbooking,
    'currentDay': isCurrentDay
    }"
    @mouseenter="handleTooltipTrigger"
    @mouseleave="handleTooltipTrigger"
    @touchstart="handleTooltipTouch"
  >
    <button
    class="date"
    :class="{'currentDay': isCurrentDay}"
    @click="handleDateClick"
    :disabled="isBooked && !isUserBooked"
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
import { ref, computed } from 'vue';
import { useDatesStore } from '~/stores/dates';
import { useUserStore } from '~/stores/user';

const datesStore = useDatesStore();
const userStore = useUserStore();

const props = defineProps({
  year: Number,
  month: Number,
  day: Number,
  isBooked: Boolean,
  visitorsAllowed: Boolean,
  bookingInfo: Object,
  idag: {
    type: Object,
    default: () => null
  },
});

const showBookingInfo = ref(false);
let touchTimeout = null;

function handleTooltipTrigger(event) {
  if (window.matchMedia('(hover: hover)').matches) {
    // Only handle mouse events on devices with hover capability
    if (props.isBooked) {
      showBookingInfo.value = event.type === 'mouseenter';
    }
  }
}

function handleTooltipTouch(event) {
  if (!window.matchMedia('(hover: hover)').matches) {
    // Only handle touch events on touch devices
    if (props.isBooked) {
      if (event.type === 'touchstart') {
        event.preventDefault(); // Prevent click event from firing
        showBookingInfo.value = true;

        // Clear any existing timeout
        if (touchTimeout) {
          clearTimeout(touchTimeout);
        }
      } else if (event.type === 'touchend') {
        // Set a timeout to hide the tooltip
        touchTimeout = setTimeout(() => {
          showBookingInfo.value = false;
        }, 1500); // Hide after 1.5 seconds
      }
    }
  }
}

// Clear timeout when component is unmounted
onUnmounted(() => {
  if (touchTimeout) {
    clearTimeout(touchTimeout);
  }
});

const dateString = computed(() => {
  const monthStr = (props.month + 1).toString().padStart(2, '0');
  const dayStr = props.day.toString().padStart(2, '0');
  return `${props.year}-${monthStr}-${dayStr}`;
});

const isSelected = computed(() => datesStore.selectedDates.includes(dateString.value));
const isUserBooked = computed(() => props.bookingInfo && props.bookingInfo.userId === userStore.currentUserInfo?.id);
const isSelectedForUnbooking = computed(() => datesStore.selectedDatesForUnbooking.includes(dateString.value));

const isCurrentDay = computed(() => {
  if (!props.idag) return false;

  return props.year === props.idag.year &&
         props.month === props.idag.month &&
         props.day === props.idag.day;
});

function handleDateClick() {
  if (isUserBooked.value) {
    datesStore.toggleSelectedDateForUnbooking(dateString.value);
  } else if (!props.isBooked) {
    datesStore.toggleSelectedDate(dateString.value);
  }
}

// function showTooltip() {
//   if (props.isBooked) {
//     showBookingInfo.value = true;
//   }
// }

// function hideTooltip() {
//   showBookingInfo.value = false;
// }

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
}

.date-container.booked.user-booked.selected-for-unbooking,
.date-container.user-booked.selected-for-unbooking {
  background-color: rgb(56, 7, 24) ;
  box-shadow: 5px 5px 5px rgba(34, 34, 34, 0.5);
}

.selected-for-unbooking .date {
  font-weight: bold;
}

.date-container.booked.user-booked {
  background-color: rgb(51, 168, 194);
}

.currentDay {
  position: relative;
}

.currentDay::after {
  content: "Idag";
  position: absolute;
  color: rgb(51, 168, 194);
  font-size: 0.6rem;
  top: 69%;
  left: -60%;
  right: 0;
  bottom: 0;
  z-index: 1;
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
  color: rgb(255, 215, 0);
  font-size: 2.2rem;
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
  pointer-events: none;
}

/* Media query for touch devices */
@media (hover: none) {
  .tooltip {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .show-tooltip .tooltip {
    opacity: 1;
    visibility: visible;
  }

  /* Adjust tooltip position for better visibility on mobile */
  @media (max-width: 768px) {
    .tooltip {
      top: -120%;
      left: 50%;
      transform: translateX(-50%);
      width: max-content;
      max-width: 200px;
      text-align: center;
    }
  }
}

/* Media query for hover devices */
@media (hover: hover) {
  .tooltip {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.2s ease;
  }
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
  .visitorsAllowed::before {
    width: 8px;
    height: 8px;
  }
  .currentDay::before {
    left: 6%;
    top: 73%;
  }
}

</style>
