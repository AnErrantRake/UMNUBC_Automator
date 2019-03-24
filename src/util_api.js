function api_retrieveDetails(responseDict){
  //trawl through search apis until get result  
  //search URL
  var authorArray = responseDict.author.split(" ");
  var authorsplit = '';
  for(var i = 0; i < authorArray.length; i++){
    authorsplit = authorsplit + '+inauthor:' + authorArray[i];
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
  var bookDetail = {
    title: '',
    authors: '',
    description: '', //lot of formatting noise, also hit and miss on content
    pageCount: '',
    publishedDate: '',
    categories: ''
  }
  
  var coverURL = '';
  
  for(var i = 0; i<results.items.length; i++){
    Logger.log('Looking at item ' + (i+1) + ' of ' + results.items.length);
    
    if(util_hasTitle(results.items[i].volumeInfo.title, responseDict.title) &&
       util_hasAuthor(results.items[i].volumeInfo.authors, responseDict.author)){
      
      var bookDetails = util_fetchData(results.items[i].selfLink + '?country=US&region=US');
      
      if (bookDetails == -1) {
        continue;
      }
      
      if(bookDetails.volumeInfo.title != null){
        bookDetail.title = bookDetails.volumeInfo.title;
      }
      
      if(bookDetails.volumeInfo.authors != null){
        bookDetail.authors = util_concatArray(bookDetails.volumeInfo.authors);
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
        bookDetail.categories = util_concatArray(bookDetails.volumeInfo.categories);
      }
      
      if(bookDetails.volumeInfo.imageLinks.small != null){
        coverURL = bookDetails.volumeInfo.imageLinks.thumbnail;
      }
      
      break;
    }
  }
  
  if(bookDetail.title != responseDict.title){
    Logger.log('Selected book does not match expected result');
  }
  
  //parse data into "descriptor: value" list
  var desc = [];
  
  if(bookDetail.pageCount.length > 0 || bookDetail.pageCount > 0){
    desc.push('Pages: approx. ' + bookDetail.pageCount);
  }
  
  if(bookDetail.publishedDate.length > 0){
    desc.push('Published: ' + bookDetail.publishedDate);
  }
  
  if(bookDetail.categories.length > 0){
    desc.push('Genre(s): \n' + bookDetail.categories);
  }
  
  return [desc,coverURL];
}