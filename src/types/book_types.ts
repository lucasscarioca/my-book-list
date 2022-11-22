import type { ImgHTMLAttributes } from 'vue'

export interface BookData {
    title: String,
    authors: [String],
    categories: [String],
    description: String, 
    image: ImgHTMLAttributes["src"],
    infoLink: String,
    pageCount: Number
  }

export interface BookInfo {
    title: String,
    authors: [String],
    categories: [String],
    description: String,
    imageLinks: {
      thumbnail: ImgHTMLAttributes["src"] 
    },
    infoLink: String,
    pageCount: Number
  }