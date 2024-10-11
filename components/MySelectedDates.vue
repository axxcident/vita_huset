<template>
	<div v-if="userBookings.length > 0" class="my-selected-dates">
	  <h3>Mina bokningar för {{ currentMonthName }}</h3>
	  <ul>
		<li v-for="date in userBookings" :key="date">
		  <label>
			<input type="checkbox" v-model="selectedDatesForUnbooking" :value="date">
			{{ formatDate(date) }}
		  </label>
		</li>
	  </ul>
	  <button @click="unbookSelectedDates" :disabled="selectedDatesForUnbooking.length === 0">
		Avboka
	  </button>
	</div>
  </template>

  <script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useDatesStore } from '~/stores/dates';
  import { useUserStore } from '~/stores/user';

  const datesStore = useDatesStore();
  const userStore = useUserStore();

  const props = defineProps({
	year: Number,
	month: Number,
	bookings: {
	  type: Array,
	  default: () => []
	},
  });

  const selectedDatesForUnbooking = ref([]);

  const userBookings = computed(() => {
	if (!props.bookings || !Array.isArray(props.bookings)) return [];

	return props.bookings.filter(booking =>
	  booking.user_id === userStore.currentUserInfo?.id &&
	  new Date(booking.booking_date).getMonth() === props.month &&
	  new Date(booking.booking_date).getFullYear() === props.year
	).map(booking => booking.booking_date);
  });

  const currentMonthName = computed(() => {
	const date = new Date(props.year, props.month);
	return date.toLocaleString('sv-SE', { month: 'long' });
  });

  function formatDate(dateString) {
	const [year, month, day] = dateString.split('-');
	return `${day}/${month}/${year}`;
  }

  async function unbookSelectedDates() {
	if (await datesStore.deleteBookings(userStore.currentUserInfo?.id)) {
	  selectedDatesForUnbooking.value = [];
	  // Emit an event to refresh bookings
	  emit('bookings-updated');
	} else {
	  alert('Failed to unbook dates. Please try again.');
	}
  }

  watch(selectedDatesForUnbooking, (newValue) => {
	datesStore.selectedDatesForUnbooking = newValue;
  });

  // Sync with datesStore when component mounts
  onMounted(() => {
	selectedDatesForUnbooking.value = datesStore.selectedDatesForUnbooking;
  });

  const emit = defineEmits(['bookings-updated']);
  </script>

  <style scoped>
  .my-selected-dates {
	margin-top: 2rem;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
  }

  ul {
	list-style-type: none;
	padding: 0;
  }

  li {
	margin-bottom: 0.5rem;
  }

  button {
	margin-top: 1rem;
	padding: 0.5rem 1rem;
	background-color: #ff4136;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
  }

  button:disabled {
	background-color: #ccc;
	cursor: not-allowed;
  }
  </style>
