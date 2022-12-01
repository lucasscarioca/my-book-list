<template>
  <div class="flex flex-col gap-20 text-white m-4">
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
            <BookCard :book="book" @click="handleClearSelectedBook(index)" />
          </li>
        </ul>
      </div>
      <div class="flex flex-row gap-2">
        <input @keyup.enter="handleSubmitBook" v-model="message" placeholder="Enter a category" type="text" class="text-black">
        <button type="button" class="px-6 py-2.5 bg-teal-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-teal-700 hover:shadow-lg focus:bg-teal-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-800 active:shadow-lg transition duration-150 ease-in-out" @click="handleClearSearch()">Clear Category</button>
      </div>
      <div class="flex overflow-x-scroll pb-5 hide-scroll-bar">
        <ul class="flex flex-nowrap gap-4">
          <li v-if="loadingSearch">Loading...</li>
          <li v-for="(book, index) in books" :key="index" class="w-40 h-60 transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300">
            <BookCard :book="book" @click="handleSelectBook(index)"/>
          </li>
        </ul>
        <button v-if="books.length > 0" @click="handleHorizontalScroll('left')" type="button" class="text-center left-5 absolute mt-24 w-8 h-8 rounded-full shadow-md bg-teal-600 hover:bg-teal-700 hover:shadow-lg transition duration-150 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ml-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
        </button>
        <button v-if="books.length > 0" @click="handleHorizontalScroll('right')" type="button" class="text-center right-5 absolute mt-24 w-8 h-8 rounded-full shadow-md bg-teal-600 hover:bg-teal-700 hover:shadow-lg transition duration-150 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ml-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

  import type {AxiosInstance} from 'axios'
  import BookCard from '.././components/BookCard.vue'
  import NavBar from '.././components/NavBar.vue'
  import type { BookData, BookInfo } from '.././types'


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
            loadingSearch: false,
            scrollAmount: 0
        };
    },
    methods: {
        async handleSubmitBook() {
          if(!this.message) return
            try {
              this.books = []
              this.loadingSearch = true
              const { data } = await this.$axios.get("", { params: {
                q: 'subject:' + this.message,
                maxResults: 25
              } });
              this.loadingSearch = false
              if (!data || !data.items)
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
        },
        handleClearSelectedBook(index: number) {
          this.selectedBooks.splice(index, 1)
        }, 
        handleHorizontalScroll(side: string) {
          let content = document.querySelector(".hide-scroll-bar")
          if (!content) return
          const scrollPos = content.scrollLeft
          
          switch(side) {
            case 'right':
              if (!(content.clientWidth + scrollPos === content.scrollWidth)) {
                this.scrollAmount += 500
                content.scrollTo({
                  left: this.scrollAmount,
                  behavior: 'smooth'
                })
              }
              return
              case 'left':
                this.scrollAmount = Math.max(this.scrollAmount - 500, 0)
                content.scrollTo({
                  left: this.scrollAmount,
                  behavior: 'smooth'
                })
                return
            default:
              return
          }
        }
    },
    components: { BookCard, NavBar }
}
</script>

<style>
.hide-scroll-bar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scroll-bar::-webkit-scrollbar {
  display: none;
}
</style>