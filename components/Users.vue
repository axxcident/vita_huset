<script setup>
  const { data } = useFetch('/api/users')

</script>

<template>
  <div>
    <h1>Users</h1>
      <ul>
        <li v-for="user in data" :key="user.user_id">{{ user.first_name }} ID:{{ user.user_id }}</li>
      </ul>
  </div>
</template>
