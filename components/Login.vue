<template>
	<div v-if="isOpen" class="login-overlay" @click="handleOverlayClick">
	  <div class="login-content">
		<button class="close-btn" @click="closeOverlay">✕</button>
		<h2>Vad hette Ines innan hon bytte namn</h2>
		<div class="login-form">
		  <input
			type="password"
			v-model="password"
			placeholder="Ange lösenord"
			@keyup.enter="attemptLogin"
		  />
		  <button
			@click="attemptLogin"
			:disabled="isLoading"
			class="login-btn"
		  >
			{{ isLoading ? 'Verifierar...' : 'Fortsätt' }}
		  </button>
		</div>
		<p v-if="error" class="error-message">{{ error }}</p>
	  </div>
	</div>
  </template>

  <script setup>
  import { ref } from 'vue';

  const isOpen = ref(false);
  const password = ref('');
  const error = ref('');
  const isLoading = ref(false);

  const emit = defineEmits(['loginSuccess', 'close']);

  function closeOverlay() {
	isOpen.value = false;
	password.value = '';
	error.value = '';
	emit('close');
  }

  function handleOverlayClick(event) {
	if (event.target.classList.contains('overlay')) {
	  closeOverlay();
	}
  }

  async function attemptLogin() {

	if (!password.value) {
	  error.value = 'Vänligen ange ett lösenord';
	  return;
	}

	isLoading.value = true;
	error.value = '';

	try {
		const response = await $fetch('/api/login', {
		method: 'GET',
		params: {
			password: password.value
		}
	  });

	  if (response.success) {
		const lowercasePassword = password.value.toLowerCase();
		localStorage.setItem('bookingAuth', lowercasePassword);
		emit('loginSuccess');
		closeOverlay();
	  } else {
		error.value = 'Felaktigt lösenord';
	  }
	} catch (err) {
	  	error.value = 'Ett fel uppstod. Försök igen.';
	} finally {
	  	isLoading.value = false;
	}
  }

  function openLoginOverlay() {
	isOpen.value = true;
  }

  defineExpose({ openLoginOverlay });
  </script>

  <style scoped>
  .login-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 200;
  }

  .login-content {
	background-color: white;
	padding: 2rem;
	border-radius: 0.5rem;
	max-width: 400px;
	width: 90%;
	position: relative;
	z-index: 202;
  }

  .close-btn {
	position: absolute;
	top: 1rem;
	right: 1rem;
	border: none;
	background: none;
	font-size: 1.2rem;
	cursor: pointer;
  }

  .login-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-top: 1rem;
  }

  input {
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 0.25rem;
  }

  .login-btn {
	padding: 0.5rem 1rem;
	background-color: rgb(56, 194, 51);
	color: white;
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
  }

  .login-btn:disabled {
	background-color: #ccc;
	cursor: not-allowed;
  }

  .error-message {
	color: red;
	margin-top: 1rem;
	font-size: 0.9rem;
  }
  </style>
