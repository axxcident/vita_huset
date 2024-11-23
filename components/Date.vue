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
    'currentDay': isCurrentDay,
    'show-tooltip': showBookingInfo
    }"
    @mouseenter="handleMouseEvent"
    @mouseleave="handleMouseEvent"
    @touchstart="handleTouchEvent"
  >
    <button
    class="date"
    @click.stop.prevent="(e) => handleDateClick(e)"
    :disabled="isBooked && !isUserBooked"
    >
      {{ day }}
    </button>
    <div v-if="isBooked" class="tooltip">
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
const isTouch = ref(false);
let clickOutsideHandler = null;

// handle mouse events (hover)
function handleMouseEvent(event) {
  if (!isTouch.value && props.isBooked) {
    showBookingInfo.value = event.type === 'mouseenter';
  }
}

// handle touch events
function handleTouchEvent(event) {
  event.stopPropagation();
  isTouch.value = true;

  if (props.isBooked) {
    event.preventDefault();
    // Remove any existing click outside handler
    if (clickOutsideHandler) {
      document.removeEventListener('touchstart', clickOutsideHandler);
      document.removeEventListener('click', clickOutsideHandler);
      clickOutsideHandler = null;
    }

    // If another tooltip is already visible, close it first
    const openTooltips = document.querySelectorAll('.show-tooltip');
    openTooltips.forEach(el => {
      if (el !== event.currentTarget) {
        el.classList.remove('show-tooltip');
      }
    });

    // Toggle tooltip visibility
    showBookingInfo.value = !showBookingInfo.value;
    console.log('Tooltip visibility:', showBookingInfo.value); // Add this debug line

    if (showBookingInfo.value) {
      // Create new click outside handler
      clickOutsideHandler = (e) => {
        // Check if click/touch is outside the current date container
        if (!event.currentTarget.contains(e.target)) {
          showBookingInfo.value = false;
          document.removeEventListener('touchstart', clickOutsideHandler);
          document.removeEventListener('click', clickOutsideHandler);
          clickOutsideHandler = null;
        }
      };

      // Add both touch and click listeners
      requestAnimationFrame(() => {
        document.addEventListener('touchstart', clickOutsideHandler);
        document.addEventListener('click', clickOutsideHandler);
      });
    }
  } else {
    // For unbooked dates
    event.preventDefault(); // Prevent default touch behavior
    const touch = event.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    // Only handle date click if touch is still on the date element
    if (event.currentTarget.contains(target)) {
      handleDateClick();
    }
  }
}

// Modify handleDateClick to handle touch better
function handleDateClick(event) {
  // Prevent any default behavior
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (isUserBooked.value) {
    datesStore.toggleSelectedDateForUnbooking(dateString.value);
  } else if (!props.isBooked) {
    datesStore.toggleSelectedDate(dateString.value);
  }
}


const dateString = computed(() => {
  const monthStr = (props.month + 1).toString().padStart(2, '0');
  const dayStr = props.day.toString().padStart(2, '0');
  return `${props.year}-${monthStr}-${dayStr}`;
});

const isSelected = computed(() => datesStore.selectedDates.includes(dateString.value));
const isUserBooked = computed(() => props.bookingInfo && props.bookingInfo.userId === userStore.currentUserInfo?.id);
const isSelectedForUnbooking = computed(() => datesStore.selectedDatesForUnbooking.includes(dateString.value));

const isCurrentDay = computed(() => {
  if (!props.idag) {
    console.log('No idag-prop passed to Date component');
    return false;
  }
  else if(props.year === props.idag.year &&
          props.month === props.idag.month &&
          props.day === props.idag.day) {
    console.log('idag-prop passed to Date component and it is', props.idag);
    return true;
  }

  return props.year === props.idag.year &&
         props.month === props.idag.month &&
         props.day === props.idag.day;
});

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
  pointer-events: none;
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
  opacity: 0;
}

/* Show tooltip when container has show-tooltip class */
.show-tooltip .tooltip {
  opacity: 1;
  visibility: visible;
}

/* Media query for touch devices */
@media (hover: none) {
  .tooltip {
  top: -120%;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: 200px;
  text-align: center;
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
    opacity: 0;
    visibility: hidden;
  }

  .date-container:hover .tooltip {
    opacity: 1;
    visibility: visible;
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
