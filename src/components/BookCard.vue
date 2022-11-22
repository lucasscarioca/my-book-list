<template>
  <img  :src="book?.image" alt="book image" class="w-full h-full">
  <!-- <div class="flex flex-row gap-2">
    <img :src="book.image" alt="book image">
    <div class="flex flex-col">
      <h3>{{book.title}}</h3>
      <p>{{book.authors?.join(", ")}}</p>
      <p>Category: {{book.categories?.join(", ")}}</p>
      <p>Pages: {{book.pageCount}}</p>
      <p class="text-sm max-w-4 max-h-20 text-ellipsis overflow-hidden">{{book.description}}</p>
    </div>
  </div> -->
</template>

<script lang="ts">
  import type { BookData } from '../types';
  import { defineComponent, type PropType } from 'vue';

  export default defineComponent({
    props: {
      book: Object as PropType<BookData>
    }
  })
</script>