<template>
  <header>
    <UserNavigation class="user-nav" />
  </header>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
  header {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
  }

  .user-nav {
    margin-left: auto;
  }
</style>
