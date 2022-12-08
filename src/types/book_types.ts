import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'vue'

export interface BookData {
    title: String,
    authors: [String],
    categories: [String],
    description: String, 
    image: ImgHTMLAttributes["src"],
    infoLink: AnchorHTMLAttributes["href"],
    pageCount: number
  }

export interface BookInfo {
    title: String,
    authors: [String],
    categories: [String],
    description: String,
    imageLinks: {
      thumbnail: ImgHTMLAttributes["src"] 
    },
    infoLink: AnchorHTMLAttributes["href"],
    pageCount: number
  }