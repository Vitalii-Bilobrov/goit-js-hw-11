import Notiflix from 'notiflix';
import { UnplashApi } from './js/fetch';
import { renderPhotoList } from './js/render';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';

const listItems = document.createElement('ul');
gallery.append(listItems);

const unplashApi = new UnplashApi();

const onSearchFormSubmit = async event => {
  event.preventDefault();
  unplashApi.query = event.target.elements.searchQuery.value.trim();
  unplashApi.page = 1;
  listItems.innerHTML = '';
  if (unplashApi.query === '') {
    alertNoEmptySearch();
    return;
  }
  try {
    const response = await unplashApi.fetchPhotos();
    const { data } = response;
    console.log(data.totalHits);
    if (data.totalHits === 0) {
      loadMoreBtn.style.display = 'none';
      alertNoEmptySearch();
      return;
    }

    listItems.innerHTML = renderPhotoList(data.hits);
    if (unplashApi.perPage > data.totalHits) {
      alertEndOfSearch();
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  } catch (err) {
    console.log('error');
  }
};
form.addEventListener('submit', onSearchFormSubmit);

function alertImagesFound(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoEmptySearch() {
  Notiflix.Notify.failure(
    'The search string cannot be empty. Please specify your search query.'
  );
}

function alertNoImagesFound() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertEndOfSearch() {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}

const onLoadMoreBntClick = event => {
  unplashApi.page += 1;

  unplashApi
    .fetchPhotos()
    .then(data => {
      const totalPage = Math.ceil(data.data.totalHits / unplashApi.perPage);
      if (unplashApi.page > totalPage) {
        alertEndOfSearch();
        loadMoreBtn.style.display = 'none';
      }
      listItems.insertAdjacentHTML(
        'beforeend',
        renderPhotoList(data.data.hits)
      );
    })
    .catch(err => {
      console.log(err);
    });
};
loadMoreBtn.addEventListener('click', onLoadMoreBntClick);
