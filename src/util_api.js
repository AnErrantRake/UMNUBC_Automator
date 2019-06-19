function api_retrieveDetails(responseDict){
  //trawl through search apis until get result
  
  var bookDetail = googleISBNSearch(responseDict);
  if(bookDetail == -1 || ! (util_hasTitle(bookDetail.title, responseDict.title))){
    bookDetail = googleTitleAuthorSearch(responseDict);
  }
   
  if(bookDetail == -1){
    Logger.log("Google Books API failed for " + responseDict.title);
    ballotLog.push(responseDict.title + ' - ' + responseDict.author + ' failed to find search results. Probable malformed title/author. Good candidate for single entry.');
    return -1;
  }
  //parse data into "descriptor: value" list
  var desc = [];
  
  if(bookDetail.pageCount.length > 0 || bookDetail.pageCount > 0){
    desc.push('Pages: approx. ' + bookDetail.pageCount);
  }
  
  if(bookDetail.publishedDate.length > 0){
    desc.push('Published: as recently as ' + bookDetail.publishedDate);
  }
  
  if(bookDetail.categories.length > 0){
    desc.push('Genre(s): \n' + bookDetail.categories);
  }
  
  if(!(desc.length > 0)){
    ballotLog.push(responseDict.title + ' - ' + responseDict.author + ' found results but failed to match. Probable misspelling or complex author. Good candidate for single entry.');
  }
  return [desc,bookDetail.coverURL];
}

function googleISBNSearch(responseDict){
  if(responseDict.isbn !== null || responseDict.isbn.length > 0){
    var bookDetails = util_fetchData('https://www.googleapis.com/books/v1/volumes?q=isbn:' + responseDict.isbn);
    if(bookDetails.items != null && bookDetails.items.length > 0){
      bookDetails = bookDetails.items[0];
    }
    else{
      return -1;
    }
    var bookDetail = -1;
  }
  else{
    return -1;
  }
  
  if (bookDetails == -1) {
    return -1;
  }
  else{
    bookDetail = bookDetailfromResult(bookDetails);
    Logger.log('Selected book matches expected result: ' + bookDetail.title + ' == ' + responseDict.title);
  }
  
  return bookDetail;
}

function googleTitleAuthorSearch(responseDict){
  
    //search URL
  var authorArray = responseDict.author;
  authorArray = authorArray.split(' and ');
  authorArray = authorArray.join(" ");
  authorArray = authorArray.split(" ");
  var authorsplit = '';
  for(var i = 0; i < authorArray.length; i++){
    if(authorArray[i].length > 0){
      authorsplit = authorsplit + '+inauthor:' + authorArray[i];
    }
  }
  var searchURL = 'https://www.googleapis.com/books/v1/volumes?q=' + responseDict.title + authorsplit + '+isbn:&country=US&region=US';
  
  var results = UrlFetchApp.fetch(searchURL,
                                 {
                                   "method":"GET",
                                   "followRedirects" : true,
                                   "muteHttpExceptions": true
                                 }
                                ); //result is just first page
  
  if (results.getResponseCode() != 200) {
    return -1;
  }
  results = JSON.parse(results.getContentText());
    
  if(results.totalItems < 1){
    Logger.log('No search results for provided params');
    return -1;
  }
  
  //pull data for result  
  var bookDetail = -1;
  
  for(var i = 0; i<results.items.length; i++){
    Logger.log('Looking at item ' + (i+1) + ' of ' + results.items.length);
    
    if(util_hasTitle(results.items[i].volumeInfo.title + ' ' + results.items[i].volumeInfo.subtitle, responseDict.title) &&
       util_hasAuthor(results.items[i].volumeInfo.authors, responseDict.author)){
      Logger.log('Seems reasonable');
      var bookDetails = util_fetchData(results.items[i].selfLink + '?country=US&region=US');
      
      if (bookDetails == -1) {
        continue;
      }
      else{
        bookDetail = bookDetailfromResult(bookDetails);
        break;
      }
    }
  }
  
  return bookDetail;
}

function bookDetailfromResult(bookDetails){
  var bookDetail = {
    title: '',
    authors: '',
    description: '', //unused, lot of formatting noise, also hit and miss on content
    pageCount: '',
    publishedDate: '',
    categories: '',
    coverURL: ''
  }
  if(bookDetails.volumeInfo.title != null){
    bookDetail.title = bookDetails.volumeInfo.title;
  }
  
  if(bookDetails.volumeInfo.authors != null){
    bookDetail.authors = bookDetails.volumeInfo.authors.join('\r\n');
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
    bookDetail.categories = bookDetails.volumeInfo.categories.join('\r\n');
  }
  
  if(bookDetails.volumeInfo.imageLinks.thumbnail != null){
    bookDetail.coverURL = bookDetails.volumeInfo.imageLinks.thumbnail;
  }
  else if(bookDetails.volumeInfo.imageLinks.smallThumbnail != null){
    bookDetail.coverURL = bookDetails.volumeInfo.imageLinks.smallThumbnail;
  }
  
  return bookDetail;
}