<template>
  <div class="flex flex-col gap-20 text-white mt-4">
    <div class="flex flex-col gap-12">
      <div class="flex flex-col gap-4 min-h-[280px] items-center">
        <h2 class="text-xl font-bold">Books you might like</h2>
        <div class="flex overflow-x-scroll pb-5 hide-scroll-bar-recommended">
          <ul class="flex flex-nowrap gap-4">
            <li v-for="(book, index) in recommendedBooks" :key="index" class="w-40 h-60 transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300">
              <BookCard :book="book" />
            </li>
          </ul>
        </div>
      </div>
      <div class="flex flex-col items-center gap-4 min-h-[280px]">
        <div class="flex flex-row gap-2">
          <h2 class="text-xl font-bold">Selected books</h2>
          <Button @click="showGraphModal = true" label="View Graph"></Button>
        </div>
        <div class="flex overflow-x-scroll pb-5 hide-scroll-bar-selected">
          <ul class="flex flex-nowrap gap-4">
            <li v-for="(book, index) in selectedBooks" :key="index" class="w-40 h-60 transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300">
              <BookCard :book="book" @click="handleClearSelectedBook(index)" />
            </li>
          </ul>
        </div>
      </div>
      <div class="flex flex-col items-center gap-4">
        <div class="flex flex-row gap-2">
          <input @keyup.enter="handleSubmitBook" v-model="message" placeholder="Enter a category" type="text" class="text-black rounded-md">
          <Button @click="handleClearSearch()" label="Clear"></Button>
          <button type="button" @click="handleOpenGraphModal" class="px-6 py-2.5 bg-teal-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-teal-700 hover:shadow-lg focus:bg-teal-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-800 active:shadow-lg transition duration-150 ease-in-out">
            <img src="/network.png" alt="graph icon" height="20" width="20" class="invert">
          </button>
        </div>
        <div class="flex overflow-x-scroll pb-5 hide-scroll-bar-search max-w-[90%] min-h-[280px]">
          <ul class="flex flex-nowrap gap-4">
            <li v-if="loadingSearch">Loading...</li>
            <li v-for="(book, index) in books" :key="index" class="w-40 h-60 transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300">
              <BookCard :book="book" @click="handleOpenBook(index)"/>
            </li>
          </ul>
          <button v-if="books.length > 0" @click="handleHorizontalScroll('left')" type="button" class="text-center left-[5.25rem] absolute mt-24 w-8 h-8 rounded-full shadow-md bg-teal-600 hover:bg-teal-700 hover:shadow-lg transition duration-150 ease-in-out">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ml-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
            </svg>
          </button>
          <button v-if="books.length > 0" @click="handleHorizontalScroll('right')" type="button" class="text-center right-[4.25rem] absolute mt-24 w-8 h-8 rounded-full shadow-md bg-teal-600 hover:bg-teal-700 hover:shadow-lg transition duration-150 ease-in-out">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ml-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <modal :show="showModal" @close="showModal = false">
      <template #header>
        <div class="flex justify-between">
          <h3>{{currentBook.title}}</h3>
          <Button @click="(showModal = false)" label="X"></Button>
        </div>
      </template>
      <template #body>
        <a :href="currentBook.infoLink" target="_blank" class="font-semibold text-indigo-500 hover:text-indigo-800 underline hover:decoration-indigo-500">more info</a>
        <p><b>Authors:</b> {{currentBook.authors.join(', ')}}</p>
        <p><b>Pages:</b> {{currentBook.pageCount}}</p>
        <p><b>Description:</b> {{currentBook.description}}</p>
      </template>
      <template #footer>
        <Button @click="handleSelectBook()" label="Add"></Button>
      </template>
    </modal>

    <modal :show="showGraphModal" @close="showGraphModal = false">
      <template #body>
        <v-network-graph :nodes="nodes" :edges="edges" class="h-[400px] w-[700px] mb-1 border border-solid border-black">
          <template #edge-label="{ edge, ...slotProps }">
            <v-edge-label :text="edge.label" align="center" vertical-align="above" v-bind="slotProps" />
          </template>
        </v-network-graph>
      </template>
    </modal>
  </Teleport>
</template>

<script lang="ts">

  import type {AxiosInstance} from 'axios'
  import BookCard from '../components/BookCard.vue'
  import Button from '../components/Button.vue'
  import Modal from '../components/Modal.vue'
  import NavBar from '../components/NavBar.vue'
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
        recommendedBooks: new Array<BookData>(),
        loadingSearch: false,
        scrollAmount: 0,
        showModal: false,
        showGraphModal: false,
        currentBook: {} as BookData,
        nodes: {} as any,
        edges: {} as any,
      }
    },
    methods: {
        async handleSubmitBook() {
          if(!this.message) return
            try {
              this.books = []
              this.loadingSearch = true
              const { data } = await this.$axios.get("", { params: {
                q: 'subject:' + this.message,
                maxResults: 15
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

              this.initGraph(this.books)
            }
            catch (e) {
              console.log(e);
            }
            this.message = "";
        },
        handleSelectBook() {
          if(this.selectedBooks.includes(this.currentBook)) return

          this.selectedBooks.push(this.currentBook)
          this.showModal = false
        },
        handleOpenBook(index: number) {
          this.currentBook = this.books[index]
          this.showModal = true
        },
        handleClearSearch() {
          this.books = []
        },
        handleClearSelectedBook(index: number) {
          this.selectedBooks.splice(index, 1)
        }, 
        handleHorizontalScroll(side: string) {
          let content = document.querySelector(".hide-scroll-bar-search")
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
        },
        handleOpenGraphModal() {
          if(this.books.length > 0) {
            this.showGraphModal = true
          }
        },
        initGraph(books: Array<BookData>) {
          this.nodes = {}
          this.edges = {}
          for(let i = 0; i < books.length; i++) {
            this.nodes[i] = { name: books[i].title }
          }
          for(let k = 0; k < books.length; k++) {
            for(let j = 0; j < books.length; j++) {
              if (k !== j && !this.edges[`${j}${k}`]) {
                let edgeWeight = this.getEdgeWeight(this.books[k], this.books[j])
                if (edgeWeight > 0) {
                  this.edges[`${k}${j}`] = { source: k, target: j, label: edgeWeight }
                }
              }
            }
          }
          console.log("edges", this.edges)
        },
        getEdgeWeight(book1: BookData, book2: BookData, evalCategory: Boolean = false) {
          let edgeWeight = 0
          let book1TitleKeywords = book1.title.split(' ').filter(word => word.length > 3)
          
          book1.authors.forEach(author => {
            if (book2.authors.includes(author)) {
              edgeWeight += 4
            }
          })

          if (evalCategory) {
            book1.categories.forEach(category => {
              if (book2.categories.includes(category)) {
                edgeWeight += 1
              }
            })
          }
          
          book1TitleKeywords.forEach(keyword => {
            if (book2.title.split(' ').includes(keyword)) {
              edgeWeight += 5
            }
          })

          if ((Math.max(book1.pageCount, book2.pageCount) - Math.min(book1.pageCount, book2.pageCount) <= 20)) {
            edgeWeight += 1
          }

          return edgeWeight
        }
      },
      components: { BookCard, NavBar, Modal, Button }
  }
</script>

<style>
.hide-scroll-bar-search, .hide-scroll-bar-selected, .hide-scroll-bar-recommended {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scroll-bar-search::-webkit-scrollbar, .hide-scroll-bar-selected::-webkit-scrollbar, .hide-scroll-bar-recommended::-webkit-scrollbar {
  display: none;
}
</style>