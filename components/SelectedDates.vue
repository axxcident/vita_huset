<template>
	<div class="selected-dates">
		<div class="date-box">
			<div class="date-area">
				<h3>Valda datum:</h3>
				<ul v-if="selectedDates.length > 0">
				  <li v-for="date in selectedDates" :key="date">{{ formatDate(date) }}</li>
				</ul>
				<p v-else>No dates selected</p>
			</div>
			<div class="booking-box">
				<button class="boka-knapp">Boka</button>
			</div>
		</div>
	</div>
  </template>

  <script setup>
  import { useDatesStore } from '~/stores/dates';
  import { storeToRefs } from 'pinia';

  const datesStore = useDatesStore();
  const { selectedDates } = storeToRefs(datesStore);

  function formatDate(dateString) {
	// Implement date formatting logic here
	return dateString;
  }
  </script>

  <style scoped>

  .selected-dates {
	margin-top: 2rem;
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
  }

  .booking-box {
	display: flex;
	align-items: center;
  }

  .boka-knapp {
	background-color: rgb(56, 194, 51);
	color: white;
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 0.5rem;
	cursor: pointer;
	font-size: 1.2rem;
  }

  </style>
