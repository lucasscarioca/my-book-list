<template>
  <button type="button" class="float-right px-6 py-2.5 bg-teal-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-teal-700 hover:shadow-lg focus:bg-teal-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-800 active:shadow-lg transition duration-150 ease-in-out" @click="$emit('close')">
    {{label}}
  </button>
</template>

<script lang="ts">
  export default {
    props: {
      label: String
    }
  }
</script>