<template>
	<div v-if="isOpen" class="overlay">
	  <div class="overlay-content">
		<h2>Bekräfta Bokning</h2>
		<div class="selected-dates">
		  <h3>Valda Datum:</h3>
		  <ul>
			<li v-for="date in selectedDates" :key="date">{{ formatDate(date) }}</li>
		  </ul>
		</div>
		<div class="visitors-allowed">
		  <label>
			<input type="checkbox" v-model="visitorsAllowed"> Besökare Tillåtna
		  </label>
		</div>
		<div class="actions">
		  <button @click="confirmBooking" class="confirm-btn">Bekräfta Bokning</button>
		  <button @click="closeOverlay" class="cancel-btn">Avbryt</button>
		</div>
	  </div>
	</div>
  </template>

  <script setup>
  import { ref } from 'vue';
  import { useDatesStore } from '~/stores/dates';
  import { storeToRefs } from 'pinia';

  const datesStore = useDatesStore();
  const { selectedDates } = storeToRefs(datesStore);

  const isOpen = ref(false);
  const visitorsAllowed = ref(false);

  const emit = defineEmits(['close']);

  function formatDate(dateString) {
	const [year, month, day] = dateString.split('-');
	return `${day}/${month}/${year}`;
  }

  function openOverlay() {
	isOpen.value = true;
  }

  function closeOverlay() {
	isOpen.value = false;
	emit('close');
  }

  async function confirmBooking() {
	try {
	  const response = await $fetch('/api/bookings', {
		method: 'POST',
		body: JSON.stringify({
		  user_id: "42bbd328-08d7-4d92-b37c-128dd7f50cbc",
		  start_date: selectedDates.value[0],
		  end_date: selectedDates.value[selectedDates.value.length - 1],
		  visitors_allowed: visitorsAllowed.value
		})
	  });

	  if (response.status === 201) {
		alert('Booking confirmed successfully!');
		datesStore.clearSelectedDates();
		closeOverlay();
	  } else {
		throw new Error('Booking failed');
	  }
	} catch (error) {
	  console.error('Error during booking:', error);
	  alert('An error occurred while booking. Please try again.');
	}
  }

  defineExpose({ openOverlay });
  </script>

  <style scoped>
  .overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
  }

  .overlay-content {
	background-color: white;
	padding: 2rem;
	border-radius: 0.5rem;
	max-width: 500px;
	width: 90%;
  }

  .selected-dates ul {
	list-style-type: none;
	padding: 0;
  }

  .visitors-allowed {
	margin: 1rem 0;
  }

  .actions {
	display: flex;
	justify-content: space-between;
	margin-top: 1rem;
  }

  .confirm-btn, .cancel-btn {
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
  }

  .confirm-btn {
	background-color: rgb(56, 194, 51);
	color: white;
  }

  .cancel-btn {
	background-color: #f44336;
	color: white;
  }
  </style>
