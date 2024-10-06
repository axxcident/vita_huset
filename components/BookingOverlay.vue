<template>
	<div v-if="isOpen" class="overlay">
	  <div class="overlay-content">
		<h2>Bekräfta Bokning</h2>
		<div v-if="!isLoading" class="booking-content">
			<div class="selected-dates">
			  <h3>Valda Datum:</h3>
			  <ul>
				<li v-for="date in selectedDates" :key="date">{{ formatDate(date) }}</li>
			  </ul>
			</div>
			<div class="user-selection">
				<h3>Välj Användare:</h3>
				<select v-model="selectedUser" @change="userStore.setUser(selectedUser)">
					<option value="">Välj Användare</option>
					<option v-for="user in availableUsers" :key="user" :value="user">{{ user }}</option>
				</select>
			</div>
			<div class="visitors-allowed">
			  <label>
				<input type="checkbox" v-model="visitorsAllowed"> Besökare Tillåtna
			  </label>
			</div>
			<div class="actions">
			  <button @click="confirmBooking" class="confirm-btn" :disabled="!userStore.isUserSelected">Bekräfta Bokning</button>
			  <button @click="closeOverlay" class="cancel-btn">Avbryt</button>
			</div>
		</div>
		<div v-else class="loading-container">
		  <div class="loading-spinner"></div>
		  <p>Processing your booking...</p>
		</div>
	</div>
	</div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import { useDatesStore } from '~/stores/dates';
  import { useUserStore } from '~/stores/user';
  import { storeToRefs } from 'pinia';

  const userStore = useUserStore();
  const datesStore = useDatesStore();
  const { selectedDates } = storeToRefs(datesStore);

  const isOpen = ref(false);
  const visitorsAllowed = ref(false);
  const isLoading = ref(false);
  const selectedUser = ref('');
  const availableUsers = ['Charlotta', 'Zarah', 'Vendela', 'Axel'];

  const emit = defineEmits(['close', 'booking-complete']);

  onMounted(() => {
	userStore.loadUser();
	selectedUser.value = userStore.currentUser || '';
  });

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
	if (!userStore.isUserSelected) return;
	isLoading.value = true;
	try {
	  const response = await $fetch('/api/bookings', {
		method: 'POST',
		body: JSON.stringify({
		  user_id: "42bbd328-08d7-4d92-b37c-128dd7f50cbc",
		  user_name: userStore.currentUser,
		  booking_dates: selectedDates.value,
		  visitors_allowed: visitorsAllowed.value
		})
	  });

	  if (response.status === 201) {
		datesStore.clearSelectedDates();
		emit('booking-complete');
		await new Promise(resolve => setTimeout(resolve, 2000));
		closeOverlay();
	  } else {
		throw new Error('Booking failed');
	  }
	} catch (error) {
	  console.error('Error during booking:', error);
	  alert('An error occurred while booking. Please try again.');
	} finally {
    isLoading.value = false;
  	}
  }

  defineExpose({ openOverlay });
  </script>

  <style scoped>

  .user-selection {
	margin-bottom: 1rem;
	}

  .user-selection select {
	width: 100%;
	padding: 0.5rem;
	font-size: 1rem;
	}

  .loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 200px;
	}

  .loading-spinner {
	border: 4px solid #f3f3f3;
	border-top: 4px solid #3498db;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	animation: spin 1s linear infinite;
	}

  @keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
	}

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
