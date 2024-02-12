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

  class BooksList{
    constructor(){
      const thisBooksList = this;

      thisBooksList.getElements();
      thisBooksList.renderBooks();
      thisBooksList.initActions();
    }
    getElements(){
      const thisBooksList = this;

      thisBooksList.data = dataSource.books;
      thisBooksList.favoriteBooks = [];

      thisBooksList.dom = {};
      thisBooksList.dom.booksList = document.querySelector(select.containerOf.booksList);
      thisBooksList.dom.filtersContainer = document.querySelector(select.containerOf.filters);
    }
    determineRatingBgc(rating){
      let ratingBgc;
      if(rating < 6){
        ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
      }
      if(rating > 6 && rating <=8){
        ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
      }
      if(rating > 8 && rating <=9){
        ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
      }
      if(rating > 9){
        ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
      }
  
      return ratingBgc;
    }
    renderBooks(){
      const thisBooksList = this;

      for(let book of thisBooksList.data){
        book.ratingBgc = thisBooksList.determineRatingBgc(book.rating);
  
        book.ratingWidth = book.rating * 10;
  
        const generatedHTML = templates.book(book);
        
        book.dom = utils.createDOMFromHTML(generatedHTML);

        thisBooksList.dom.booksList.appendChild(book.dom);
      }
    }
    hideMatchingCategory(filters) {
      const thisBooksList = this;

      for (let book of thisBooksList.data) {
        const bookId = book.id;
        const bookImage = thisBooksList.dom.booksList.querySelector(select.book.image + '[data-id="' + bookId + '"]');
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

    initActions() {
      const thisBooksList = this;
      const filters = [];

      thisBooksList.dom.booksList.addEventListener('dblclick', function(event) {
        if (event.target.offsetParent.classList.contains('book__image')) {
          event.target.offsetParent.classList.toggle('favorite');
          if (event.target.offsetParent.classList.contains('favorite')) {
            thisBooksList.favoriteBooks.push(event.target.offsetParent.getAttribute('data-id'));
          } 
          else {
            thisBooksList.favoriteBooks.splice(thisBooksList.favoriteBooks.indexOf(event.target.offsetParent.getAttribute('data-id')), 1); 
          }
        }
      });

      thisBooksList.dom.filtersContainer.addEventListener('click', function(){
        if(event.target.getAttribute('type') == 'checkbox' && event.target.getAttribute('name') == 'filter' && event.target.tagName == 'INPUT'){
          if(event.target.checked){
            filters.push(event.target.value);
          }
          else{
            filters.splice(filters.indexOf(event.target.value), 1);
          }
        }
        thisBooksList.hideMatchingCategory(filters);
      });
    }
  }

  const app = new BooksList();
  console.log(app);
}