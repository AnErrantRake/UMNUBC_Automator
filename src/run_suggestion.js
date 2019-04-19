function suggestion_getUpdate(){
  util_guaranteeScriptsAvailable();
  Logger.log("Updating suggestion data");
  var documentProperties = PropertiesService.getDocumentProperties();  
  var responseCount = 0;
    
  var suggestionURL = documentProperties.getProperty('suggestion_form_url');
  if(suggestionURL != null && suggestionURL.length > 0){
    responseCount = FormApp.openByUrl(suggestionURL).getResponses().length;
  }
  
  documentProperties.setProperty('suggestion_response_count', responseCount);
}

function suggestion_getResponseItems(){
  var formURL = PropertiesService.getDocumentProperties().getProperty('suggestion_form_url')
  var responses = FormApp.openByUrl(formURL).getResponses();
  
  //find author and title item indexes
  var testResponseItems = responses[0].getItemResponses();
  var authorItemIndex = 0;
  var titleItemIndex = 0;
  for(var i = 0; i < testResponseItems.length; i++){
    if(testResponseItems[i].getItem().getTitle().toUpperCase().indexOf('AUTHOR') > -1){
      var authorItemIndex = i;
    }
    if(testResponseItems[i].getItem().getTitle().toUpperCase().indexOf('TITLE') > -1){
      var titleItemIndex = i;
    }
  }
  
  //filter for duplicates
  var filtered = [];
  //for every response
  for(var i = 0; i < responses.length; i++){
    //for every response in filtered
    var isOriginal = true;
    for(var j = 0; j < filtered.length; j++){
      if(responses[i].getItemResponses()[authorItemIndex].getResponse().toUpperCase() === filtered[j].getItemResponses()[authorItemIndex].getResponse().toUpperCase()
         &&
           responses[i].getItemResponses()[titleItemIndex].getResponse().toUpperCase() === filtered[j].getItemResponses()[titleItemIndex].getResponse().toUpperCase()){
             Logger.log("Identified a duplicate: "
                        + responses[i].getItemResponses()[titleItemIndex].getResponse()
                        + " - "
                        + responses[i].getItemResponses()[authorItemIndex].getResponse()
                        )
             isOriginal = false;
           }
    }
    if(isOriginal){
      filtered.push(responses[i]);
    }
  }
  responses = filtered;
  
  var items = [];
  for(var i = 0; i < responses.length; i++){
    Logger.log("Parsing a response");
    //parsed response - [sectionitem, coveritem, questionitem]
    var parsedResponse = suggestion_parseResponse(responses[i]);
    if(parsedResponse != -1){
      
      //section header
      items.push(parsedResponse[0]);
      
      //cover image
      if(parsedResponse[1].image != null){
        items.push(parsedResponse[1]);
      }
      
      //description and vote question
      items.push(parsedResponse[2]);
    }
  }
  
  return items;
}

function suggestion_parseResponse(rawResponse){
  var responseDict = {
    title: '',
    author: '',
    isbn: '',
    pitch: ''
  };
  
  var responses = rawResponse.getItemResponses();
  
  Logger.log("Determining question type");
  for(var i = 0; i < responses.length; i++){
    if(responses[i].getItem().getTitle().toUpperCase().indexOf('TITLE') > -1){
      Logger.log("title");
      responseDict.title = responses[i].getResponse().trim();
    }
    else if (responses[i].getItem().getTitle().toUpperCase().indexOf('AUTHOR') > -1){
      Logger.log("author");
      responseDict.author = responses[i].getResponse().trim();
    }
    else if (responses[i].getItem().getTitle().toUpperCase().indexOf('ISBN') > -1){
      Logger.log("isbn");
      responseDict.isbn = responses[i].getResponse().trim();
    }
    else if (responses[i].getItem().getTitle().toUpperCase().indexOf('PITCH') > -1){
      Logger.log("pitch");
      responseDict.pitch = responses[i].getResponse().trim();
    }
  }
  
  var sectionItem = {
    header : {title : '', desc : ''},
    navigation : FormApp.PageNavigationType.CONTINUE,
    type : FormApp.ItemType.PAGE_BREAK
  };
  
  var responseItem = {
    header : {title : '', desc : ''},
    bounds : [0,4],
    labels : ['I LOATHE THIS TRASH','Ready to start my new cult :)'],
    options : {required : false}, 
    type : FormApp.ItemType.SCALE
  };
  
  var coverItem = {
    header : {title : '', desc : ''},
    image : null,
    options : {alignment : FormApp.Alignment.CENTER, width : 128}, 
    type : FormApp.ItemType.IMAGE
  };
  
  sectionItem.header.title = responseDict.title + ' - ' + responseDict.author;
    
  //book data - [description details, coverURL]
  var bookData = api_retrieveDetails(responseDict);
  if(bookData != -1){
    Logger.log("API returned successful - processing");
    if(responseDict.pitch != null && responseDict.pitch.length > 0){
      bookData[0].push('Pitch: \n' + responseDict.pitch);
    }
    
    var description = '';
    for(var i = 0; i < bookData[0].length; i++){
      if(bookData[0][i] != null && bookData[0][i].length > 0){
        description = description + '\n' + bookData[0][i]; 
      }
    }
    responseItem.header.desc = description;
    
    //attempt to add cover
    if(bookData[1] != null && bookData[1].length > 0){
      Logger.log("this shouldn't be empty: " + bookData[1]);
      var img = util_getImage(bookData[1]);
      if(img.getResponseCode() == 200){
        Logger.log("Successfully acquired cover image");
        coverItem.image = img;
      }
    }
    
  }
  Logger.log("returning response item");
  return [sectionItem,coverItem,responseItem];
}