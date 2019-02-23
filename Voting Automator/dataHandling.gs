//concats the data points from the response into a single string
//the edit view on the form can distort this - live form actually shows the line breaks
function getDescription(bookDetail, response){

  var desc = '';

  if(bookDetail.pageCount.length > 0){
    desc = desc + 'Pages: approx. ' + bookDetail.pageCount;
  }

  if(bookDetail.publishedDate.length > 0){
    desc = desc + '\nPublished: ' + bookDetail.publishedDate;
  }

  if(bookDetail.categories.length > 0){
    desc = desc + '\nGenre(s): \n' + bookDetail.categories;
  }

  if(response.pitch.length > 0){
    desc = desc + '\nPitch: \n' + response.pitch;
  }

  return desc;
}


//trawls through items of search result
//fills a bookDetail dictionary with values if found
function getBookDetailFromItems(items,book){

  var bookDetail = {
    title: '',
    authors: '',
    description: '', //lot of formatting noise, also hit and miss on content
    pageCount: '',
    publishedDate: '',
    categories: '',
    imageURI: ''
  }

  for(var i = 0; i<items.length; i++){
    Logger.log('Looking at item ' + (i+1) + ' of ' + items.length);

    if(hasTitle(items[i].volumeInfo.title, book.title) &&
       hasAuthor(items[i].volumeInfo.authors, book.author)){

      var bookDetails = fetchData(assembleDetailURI_Google(items[i].selfLink));

      if(bookDetails.volumeInfo.title != null){
        bookDetail.title = bookDetails.volumeInfo.title;
      }

      if(bookDetails.volumeInfo.authors != null){
        bookDetail.authors = concatArray(bookDetails.volumeInfo.authors);
      }

      if(bookDetails.volumeInfo.description != null){
        bookDetail.description = bookDetails.volumeInfo.description;
      }

      if(bookDetails.volumeInfo.pageCount != null){
        bookDetail.pageCount = bookDetails.volumeInfo.pageCount;
      }

      if(bookDetails.volumeInfo.publishedDate != null){
        bookDetail.publishedDate = bookDetails.volumeInfo.publishedDate;
      }

      if(bookDetails.volumeInfo.categories != null){
        bookDetail.categories = concatArray(bookDetails.volumeInfo.categories);
      }

      if(bookDetails.volumeInfo.imageLinks.small != null){
        bookDetail.imageURI = bookDetails.volumeInfo.imageLinks.small;
      }

      break;
    }
  }
  return bookDetail;
}
