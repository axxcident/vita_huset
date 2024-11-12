<template>
	<div class="selected-dates sm:mt-[2rem] mt-0 sm:mb-0 mb-8">
		<div class="date-box">
			<div class="date-area">
				<h3>Valda datum:</h3>
				<ul v-if="selectedDates.length > 0">
				  <li v-for="date in selectedDates" :key="date">{{ formatDate(date) }}</li>
				</ul>
				<p v-else>Välj ett datum eller fler.</p>
			</div>
			<div class="booking-box">
				<button class="boka-knapp"
				        :class="{ 'active': hasDatesSelected, 'inactive': !hasDatesSelected }"
        				:disabled="!hasDatesSelected"
						@click="openBookingOverlay"
				>Boka</button>
			</div>
		</div>
		<BookingOverlay ref="bookingOverlay" @booking-complete="handleBookingComplete"/>
	</div>
  </template>

  <script setup>
  import { useDatesStore } from '~/stores/dates';
  import { storeToRefs } from 'pinia';
  import { computed, ref } from 'vue';
  import BookingOverlay from './BookingOverlay.vue';

  const datesStore = useDatesStore();
  const { selectedDates } = storeToRefs(datesStore);

  const hasDatesSelected = computed(() => selectedDates.value.length > 0);

  const bookingOverlay = ref(null);

	function formatDate(dateString) {
	const [year, month, day] = dateString.split('-');
	return `${day}/${month}/${year}`;
	}

	function openBookingOverlay() {
	bookingOverlay.value.openOverlay();
	}

	function handleBookingComplete() {
		emit('booking-complete');
	}

	const emit = defineEmits(['booking-complete']);
  </script>

  <style scoped>

  .selected-dates {
	width: 100%;
	display: flex;
	justify-content: center;
  }

  .date-box {
	border: black solid 1px;
	width: 300px;
	padding: 1rem;
	border-radius: 0.5rem;
	display: flex;
	justify-content: space-between;
	margin-bottom: 1.5rem;
  }

  .booking-box {
	display: flex;
	align-items: start;
  }

  .boka-knapp {
	color: white;
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 0.5rem;
	font-size: 1.2rem;
	transition: all 0.3s ease;
  }

  .inactive {
	background-color: rgb(170, 170, 170);
	cursor: not-allowed;
  }

  .active {
	background-color: rgb(56, 194, 51);
	cursor: pointer;
  }

  .boka-knapp:hover.active {
  background-color: rgb(46, 164, 41);
  }

  </style>
