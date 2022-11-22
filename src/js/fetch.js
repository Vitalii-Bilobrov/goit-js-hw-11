'use strict';
import axios from 'axios';

export class UnplashApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '31492616-f7e5141788943e3bc0dbb552f';
  constructor() {
    this.page = 1;
    this.query = null;
    this.perPage = 40;
  }
  fetchPhotos() {
    const serchParams = new URLSearchParams({
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.perPage,
    });
    return axios.get(`${this.#BASE_URL}?key=${this.#API_KEY}&${serchParams}`);
  }
}
