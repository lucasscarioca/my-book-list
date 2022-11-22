<template>
  <div class="flex flex-col gap-20 h-screen w-screen bg-slate-700 text-white">
    <div class="flex justify-center items-center">
      <h1 class="text-3xl mt-10">My Book List</h1>
    </div>
  
    <div class="flex flex-col gap-20">
      <div class="flex flex-col">
        <h2>Books you might like</h2>
        <ul class="flex flex-row gap-4">
          <li>Clean Code</li>
          <li>Design Patterns</li>
          <li>Clean Architecture</li>
        </ul>
      </div>

      <div class="flex flex-col gap-4">
        <h2>Selected books</h2>
        <ul class="flex flex-row gap-4">
          <li v-for="(book, index) in selectedBooks" :key="index" class="w-40 h-60 transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300">
            <BookCard :book="book" />
          </li>
        </ul>
      </div>
    
      <div class="flex flex-col gap-4">
        <form @submit.prevent="handleSubmitBook()">
          <input v-model="message" placeholder="Search for books" class="text-black">
          <button @click="handleClearSearch()">Limpar buscar</button>
        </form>
      
        <ul class="flex flex-wrap gap-4">
          <li v-if="loadingSearch">Loading...</li>
          <li v-for="(book, index) in books" :key="index" class="w-40 h-60 transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300">
            <BookCard :book="book" @click="handleSelectBook(index)"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

  import type {AxiosInstance} from 'axios'
  import BookCard from './components/BookCard.vue'
  import type { BookData, BookInfo } from './types'


  declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      $axios: AxiosInstance
      catTags: string[]
    }
  }

  export default {
    data() {
        return {
            books: new Array<BookData>(),
            message: "",
            selectedBooks: new Array<BookData>(),
            loadingSearch: false
        };
    },
    methods: {
        async handleSubmitBook() {
          if(!this.message) return
            try {
              this.books = []
              this.loadingSearch = true
              const { data } = await this.$axios.get("", { params: {
                q: this.message,
                maxResults: 8
              } });
              this.loadingSearch = false
              if (!data)
                return;
              data.items.forEach((element: {
                volumeInfo: BookInfo;
              }) => {
                let book = element.volumeInfo;
                this.books.push({
                  title: book.title,
                  authors: book.authors,
                  categories: book.categories,
                  description: book.description,
                  image: book?.imageLinks?.thumbnail ?? "",
                  infoLink: book.infoLink,
                  pageCount: book.pageCount
                });
              });
            }
            catch (e) {
              console.log(e);
            }
            this.message = "";
        },
        handleSelectBook(index: number) {
          let selectedBook = this.books[index]

          if(this.selectedBooks.includes(selectedBook)) return

          this.selectedBooks.push(selectedBook)
        },
        handleClearSearch() {
          this.books = []
        }
    },
    components: { BookCard }
}
</script>