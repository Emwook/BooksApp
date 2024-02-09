/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  'use strict';

  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      filters: '.filters',
    },
    book: {
      image: '.book__image',
    }
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  function renderBooks(){
    const books = dataSource.books;
    for(let book of books){
      const generatedHTML = templates.book(book);
      
      book.dom = utils.createDOMFromHTML(generatedHTML);

      const booksList = document.querySelector(select.containerOf.booksList);
      /* add element to menu */
      booksList.appendChild(book.dom);
    }
  }
  renderBooks();

  function hideMatchingCategory(filters) {
    const books = dataSource.books;
    const booksList = document.querySelector(select.containerOf.booksList);
    
    for (let book of books) {
      const bookId = book.id;
      const bookImage = booksList.querySelector(select.book.image + '[data-id="' + bookId + '"]');
      let hidingSwitch = false;

      for (let filter of filters) {
        if ((filter === 'adults' && book.details.adults) || (filter === 'nonFiction' && book.details.nonFiction)) {
          hidingSwitch = true;
          break;
        }
      }
      if (hidingSwitch) {
        bookImage.classList.add('hidden');
      } else {
        bookImage.classList.remove('hidden');
      }
    }
  }
  
  
  const favoriteBooks = [];

  function initActions() {
    const booksContainer = document.querySelector(select.containerOf.booksList);
    booksContainer.addEventListener('dblclick', function(event) {
      if (event.target.offsetParent.classList.contains('book__image')) {
        event.target.offsetParent.classList.toggle('favorite');
        console.log(event.target.offsetParent);
        if (event.target.offsetParent.classList.contains('favorite')) {
          favoriteBooks.push(event.target.offsetParent.getAttribute('data-id'));
        } 
        else {
          favoriteBooks.splice(favoriteBooks.indexOf(event.target.offsetParent.getAttribute('data-id')), 1); 
        }
        console.log('current favs: ', favoriteBooks);
      }
    });
    const filters = [];
    const filtersContainer = document.querySelector(select.containerOf.filters);
    filtersContainer.addEventListener('click', function(){
      if(event.target.getAttribute('type') == 'checkbox' && event.target.getAttribute('name') == 'filter' && event.target.tagName == 'INPUT'){
        if(event.target.checked){
          filters.push(event.target.value);
        }
        else{
          filters.splice(filters.indexOf(event.target.value), 1);
        }
      }
      hideMatchingCategory(filters);
    });
  }
  initActions();  
  /*
  function determineRatingBgc(rating){

  }
  */

}