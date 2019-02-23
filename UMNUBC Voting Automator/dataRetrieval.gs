//queries Google Book API
//returns JSON if successful, -1 on failure
function getSearchResults(book){

  var searchURI = assembleSearchURI_Google(book);

  Logger.log('Querying ' + searchURI);
  var result = UrlFetchApp.fetch(searchURI, FETCH_GET_OPTIONS); //result is just first page

  if (result.getResponseCode() == 200) {
    return JSON.parse(result.getContentText());
  }

  return -1;
}


//takes URI, returns JSON
function fetchData(URI){

      Logger.log('Querying ' + URI);
      var bookRaw = UrlFetchApp.fetch(URI, FETCH_GET_OPTIONS);

      return JSON.parse(bookRaw.getContentText());
}


//performs a get request for an image
//returns -1 if the request fails or uri is empty
function getImage(uri){

  if(uri.length > 0){

    Logger.log('Fetching ' + uri);
    var img = UrlFetchApp.fetch(uri, FETCH_GET_OPTIONS);

    if(img.getResponseCode() == 200){
      return img;
    }
  }

  return -1;
}


  
