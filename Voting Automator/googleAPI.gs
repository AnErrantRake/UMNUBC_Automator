//returns a URI compatible with the Google Book API using the response
function assembleSearchURI_Google(book){

  var authorArray = book.author.split(" ");

  var authorsplit = '';
  for(var i = 0; i < authorArray.length; i++){
    authorsplit = authorsplit + '+inauthor:' + authorArray[i];
  }

  return 'https://www.googleapis.com/books/v1/volumes?q=' + book.title + authorsplit + '+isbn:&country=US&region=US';
}


//returns a URI compatible with the Google Book API using the book result's selflink
function assembleDetailURI_Google(rawURI){
      return rawURI + '?country=US&region=US';
}
