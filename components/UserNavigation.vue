<template>
	<div class="user-navigation">
	  <div class="user-display" @click="toggleDropdown">
		<div class="user-circle" :style="{ backgroundColor: currentUserColor }"></div>
		<span>{{ userStore.currentUser || 'Välj Användare' }}</span>
	  </div>
	  <div v-if="showDropdown" class="user-dropdown">
		<div v-for="user in availableUsers" :key="user"
			 class="user-option"
			 @click="selectUser(user)">
		  <div class="user-circle" :style="{ backgroundColor: userStore.userColors[user] }"></div>
		  <span>{{ user }}</span>
		</div>
	  </div>
	</div>
  </template>

  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useUserStore } from '~/stores/user';

  const userStore = useUserStore();
  const showDropdown = ref(false);
  const availableUsers = ['Charlotta', 'Zarah', 'Vendela', 'Axel', 'Torsten', 'Viktor'];

  const currentUserColor = computed(() => userStore.currentUserColor || '#ccc');

  onMounted(() => {
	userStore.loadUser();
  });

  function toggleDropdown() {
	showDropdown.value = !showDropdown.value;
  }

  function selectUser(user) {
	userStore.setUser(user);
	showDropdown.value = false;
  }
  </script>

  <style scoped>
  .user-navigation {
	position: relative;
	z-index: 100;
	display: inline-block;
  }

  .user-display, .user-option {
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0.5rem;
  }

  .user-circle {
	width: 24px;
	height: 24px;
	border-radius: 50%;
	margin-right: 0.5rem;
  }

  .user-dropdown {
	position: absolute;
	top: 100%;
	right: 0;
	background-color: white;
	border: 1px solid #ccc;
	border-radius: 4px;
	box-shadow: 0 2px 10px rgba(0,0,0,0.1);
	z-index: 10;
  }

  .user-option:hover {
	background-color: #f0f0f0;
  }
  </style>
