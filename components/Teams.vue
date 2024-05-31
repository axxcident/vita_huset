<script setup>
  const { data } = useFetch('/api/teams')

</script>

<template>
  <div>
    <h1>Teams</h1>
      <ul>
        <li v-for="team in data" :key="team.team_id">{{ team.team_name }}</li>
      </ul>
  </div>
</template>
