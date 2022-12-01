<template>
  <div class="min-h-screen w-screen bg-slate-700">
    <NavBar />
    <Home />
  </div>
</template>

<script lang="ts">
  import NavBar from './components/NavBar.vue';
  import Home from './pages/Home.vue'
  export default {
    components: {
    Home,
    NavBar
  }
  }
</script>