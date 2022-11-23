import Notiflix from 'notiflix';
import { Pixabay } from './js/fetch';
import { renderPhotoList } from './js/render';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';

const listItems = document.createElement('ul');
gallery.append(listItems);

const pixabay = new Pixabay();

const onSearchFormSubmit = async event => {
  event.preventDefault();
  pixabay.query = event.target.elements.searchQuery.value.trim();
  pixabay.page = 1;
  listItems.innerHTML = '';
  if (pixabay.query === '') {
    alertNoEmptySearch();
    return;
  }
  try {
    const response = await pixabay.fetchPhotos();
    const { data } = response;
    console.log(data.totalHits);
    if (data.totalHits === 0) {
      loadMoreBtn.style.display = 'none';
      alertNoEmptySearch();
      return;
    }

    listItems.innerHTML = renderPhotoList(data.hits);
    if (pixabay.perPage > Math.ceil(data.totalHits / pixabay.page)) {
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
  pixabay.page += 1;

  pixabay
    .fetchPhotos()
    .then(data => {
      const totalPage = Math.ceil(data.data.totalHits / pixabay.perPage);
      if (pixabay.page < totalPage) {
      } else if (pixabay.page === totalPage) {
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
