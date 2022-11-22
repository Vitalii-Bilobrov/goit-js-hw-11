import Notiflix from 'notiflix';
import { UnplashApi } from './js/fetch';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';

const listItems = document.createElement('ul');
gallery.append(listItems);
listItems.style.listStyle = 'none';
listItems.style.display = 'flex';
listItems.style.justifyContent = 'center';
listItems.style.gap = '20px';
listItems.style.flexWrap = 'wrap';
document.body.style.display = 'flex';
document.body.style.flexDirection = 'column';
document.body.style.alignItems = 'center';
const unplashApi = new UnplashApi();

const onSearchFormSubmit = async event => {
  event.preventDefault();
  unplashApi.query = event.target.elements.searchQuery.value.trim();
  page = 1;
  listItems.innerHTML = '';

  //   if(data.data.totalHits)

  try {
    const response = await unplashApi.fetchPhotos();
    const { data } = response;
    console.log(data.hits);
    if (data.totalHits === 0) {
      alertNoEmptySearch();
      return;
    }
    listItems.innerHTML = renderPhotoList(data.hits);
    loadMoreBtn.style.display = 'block';
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

function renderPhotoList(data) {
  return data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<li class="list-item">
      <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width="450" height="250"  />
      <div class="info">
        <p class="info-item" >
          <b>Likes</b>${likes}
        </p>
        <p class="info-item">
          <b>Views</b>${views}
        </p>
        <p class="info-item">
          <b>Comments</b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>${downloads}
        </p>
      </div>
    </div>
            </li>`;
      }
    )
    .join('');
}
const onLoadMoreBntClick = event => {
  unplashApi.page += 1;

  unplashApi
    .fetchPhotos()
    .then(data => {
      console.log(data.data.totalHits);
      const totalPage = Math.ceil(data.data.totalHits / unplashApi.perPage);
      if (unplashApi.page > totalPage) {
        alertEndOfSearch();
      }
      listItems.insertAdjacentHTML(
        'beforeend',
        renderPhotoList(data.data.hits)
      );

      console.log(totalPage);
    })
    .catch(err => {
      console.log(err);
    });
};
loadMoreBtn.addEventListener('click', onLoadMoreBntClick);
