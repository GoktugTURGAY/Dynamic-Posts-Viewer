/* 
 ### ||| Pagination system ||| ###
*/

// Selecting elements from the DOM
const postsContainer = document.querySelector('.posts');
const btnPrev = document.querySelector('.btn-previous');
const btnNext = document.querySelector('.btn-next');
const pageInfo = document.querySelector('.page-info');
const paginationBtns = document.querySelectorAll('.pagination button');
const loading = document.querySelector('.loading');
const API_URL = 'https://dummyjson.com/posts';

// Initial states
let currentPage = 1;
let isAllowed = true;
const LIMIT = 5;
getPosts(currentPage);
btnPrev.classList.add('disabled');

// Functions
function getPosts(page) {
  // The 'skip' logic for the API
  const skip = (page - 1) * LIMIT;
  loading.classList.remove('hidden');
  postsContainer.classList.add('hidden');

  // Fetching posts
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${API_URL}?limit=${LIMIT}&skip=${skip}`);
  xhr.responseType = 'json';

  xhr.onreadystatechange = () => {
    if (xhr.status !== 200) {
      loading.classList.add('hidden');
      postsContainer.classList.remove('hidden');
      postsContainer.innerHTML =
        '<h2 class="failed-message">Failed loading data.</h2><a href="index.html">Reload the page</a>';
      return;
    }

    if (xhr.readyState === 4 && xhr.status === 200) {
      const posts = xhr.response.posts;

      // Updating the UI
      loading.classList.add('hidden');
      postsContainer.classList.remove('hidden');
      addPosts(posts);
      handleActivePage(page);

      if (currentPage === 1) {
        btnPrev.disabled = true;
        btnNext.disabled = false;
      } else if (currentPage === paginationBtns.length - 2) {
        btnNext.disabled = true;
        btnPrev.disabled = false;
      } else {
        btnPrev.disabled = false;
        btnNext.disabled = false;
      }
    }
  };

  xhr.send();
}

function addPosts(posts) {
  postsContainer.textContent = '';

  posts.forEach(post => {
    const {
      title,
      body,
      reactions: { likes, dislikes },
      views,
    } = post;

    const li = document.createElement('li');
    li.className = 'post';
    const article = document.createElement('article');
    article.className = 'post-article';
    li.appendChild(article);
    const h2 = document.createElement('h2');
    h2.className = 'post-heading';
    const h2Text = document.createTextNode(title);
    h2.appendChild(h2Text);
    article.appendChild(h2);

    const p = document.createElement('p');
    p.className = 'post-text';
    const pText = document.createTextNode(body);
    p.appendChild(pText);
    article.appendChild(p);

    const divFirst = document.createElement('div');
    divFirst.className = 'post-views';
    const strong = document.createElement('strong');
    strong.className = 'post-views-count';
    const strongText = document.createTextNode(views);
    const iconEye = document.createElement('i');
    iconEye.className = 'fa fa-eye';
    strong.appendChild(iconEye);
    strong.appendChild(strongText);
    divFirst.appendChild(strong);
    article.appendChild(divFirst);

    const divSecond = document.createElement('div');
    divSecond.className = 'post-reactions';
    const spanFirst = document.createElement('span');
    spanFirst.className = 'post-likes';
    const spanFirstText = document.createTextNode(likes);
    const iconThumbsUp = document.createElement('i');
    iconThumbsUp.className = 'fa fa-thumbs-up';
    spanFirst.appendChild(iconThumbsUp);
    const spanSecond = document.createElement('span');
    spanSecond.className = 'post-dislikes';
    const spanSecondText = document.createTextNode(dislikes);
    const iconThumbsDown = document.createElement('i');
    iconThumbsDown.className = 'fa fa-thumbs-down';
    spanSecond.appendChild(iconThumbsDown);
    spanFirst.appendChild(spanFirstText);
    spanSecond.appendChild(spanSecondText);
    divSecond.appendChild(spanFirst);
    divSecond.appendChild(spanSecond);
    article.appendChild(divSecond);

    postsContainer.appendChild(li);
  });
}

function handleActivePage(page) {
  paginationBtns.forEach(link => link.classList.remove('active'));
  paginationBtns[currentPage].classList.add('active');

  paginationBtns.forEach(link => link.removeAttribute('aria-current'));
  paginationBtns[currentPage].setAttribute('aria-current', 'page');

  pageInfo.textContent = `Page: ${page}`;
}

// Event listeners
paginationBtns.forEach((link, index) => {
  link.addEventListener('click', e => {
    if (isAllowed) {
      if (index === 0) {
        if (currentPage > 1) {
          currentPage--;
        }
      } else if (index === paginationBtns.length - 1) {
        if (currentPage < 6) {
          currentPage++;
        }
      } else {
        currentPage = index;
      }

      getPosts(currentPage);
      isAllowed = false;
      setTimeout(() => (isAllowed = true), 500);
    }
  });
});
