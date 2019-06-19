function suggestion_getUpdate(){
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
  Logger.log('Found ' + responses.length + ' responses');
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
  Logger.log('Retained ' + responses.length + ' filtered responses');
  
  var items = [];
  for(var i = 0; i < responses.length; i++){
    Logger.log("Parsing a response");
    var parsedResponse = suggestion_parseResponse(responses[i]);
    if(parsedResponse != -1){
      // error checking/log
      if(parsedResponse.length < 4){
        ballotLog.push(parsedResponse[0].header.title + ' is missing a cover image.');
      }
      if(parsedResponse[parsedResponse.length - 2].header.desc.indexOf('Pitch:') < 0){
        ballotLog.push(parsedResponse[0].header.title + ' is missing a pitch (It may never have had one).');
      }
      if(parsedResponse[parsedResponse.length - 2].header.desc.indexOf('Pages: ') < 0){
        ballotLog.push(parsedResponse[0].header.title + ' is missing a page count.');
      }
      if(parsedResponse[parsedResponse.length - 2].header.desc.indexOf('Published: ') < 0){
        ballotLog.push(parsedResponse[0].header.title + ' is missing a published date.');
      }
      if(parsedResponse[parsedResponse.length - 2].header.desc.indexOf('Genre(s): ') < 0){
        ballotLog.push(parsedResponse[0].header.title + ' is missing a genre.');
      }
      
      for(var j = 0; j < parsedResponse.length; j++){
        items.push(parsedResponse[j]);
      }
    }
    else{
      ballotLog.push('A suggestion form response failed to get parsed. Timestamp of response: ' + responses[i].getTimestamp());
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
  
  return vote_entry_details(responseDict);
}

function vote_entry_details(responseDict){
  
  var sectionItem = {
    header : {title : '', desc : ''},
    navigation : FormApp.PageNavigationType.CONTINUE,
    type : FormApp.ItemType.PAGE_BREAK
  };
  sectionItem.header.title = responseDict.title + ' - ' + responseDict.author;
  
  var coverItem = {
    header : {title : '', desc : ''},
    image : null,
    options : {alignment : FormApp.Alignment.CENTER, width : 128}, 
    type : FormApp.ItemType.IMAGE
  };
  
  var descriptionItem = {
    header : {title : '', desc : ''},
    type : FormApp.ItemType.SECTION_HEADER
  };
  
  var responseItem = {
    header : {title : '', desc : ''},
    bounds : [0,4],
    labels : ['I LOATHE THIS TRASH','Ready to start my new cult :)'],
    options : {required : false}, 
    type : FormApp.ItemType.SCALE
  };
  
  // add pitch
  if(responseDict.pitch != null && responseDict.pitch.length > 0){
    descriptionItem.header.desc = descriptionItem.header.desc + 'Pitch:\r\n' + responseDict.pitch + '\r\n\r\n';
  }
  
  // pull and add details/cover
  var bookData = api_retrieveDetails(responseDict);
  if(bookData != -1){
    Logger.log("API returned successful");
    descriptionItem.header.desc = descriptionItem.header.desc + bookData[0].join('\r\n');
    
    //attempt to add cover
    if(bookData[1] != null && bookData[1].length > 0){
      Logger.log("Attempting book cover acquisition");
      var img = util_getImage(bookData[1]);
      if(img.getResponseCode() == 200){
        Logger.log("Successfully acquired cover image");
        coverItem.image = img;
      }
    }
  }
  
  // add placeholder image if necessary
  if(coverItem.image === null){
    Logger.log("Attempting image replacement with placeholder");
    var placeholderURL = PropertiesService.getDocumentProperties().getProperty('vote_placeholder_image_url');
    if(placeholderURL !== null && placeholderURL.length > 0){
      img = util_getImage(placeholderURL);
      if(img.getResponseCode() === 200){
        Logger.log("Successfully acquired placeholder image");
        coverItem.image = img;
        ballotLog.push(sectionItem.header.title + ' is using a placeholder image for its cover.');
      }
    }
    else{
      Logger.log("Placeholder image undefined, leaving empty");
    }
  }
  
  if(coverItem.image === null){
    return [sectionItem,descriptionItem,responseItem];
  }
  else{
    return [sectionItem,coverItem,descriptionItem,responseItem];
  }
}

// given an array of items, updates values of existing from new items
function ballot_updateExistingEntry(existingEntry, items, form){
  if(existingEntry.length === items.length){
    for(var i = 0; i < existingEntry.length; i++){
      gen_updateItem(existingEntry[i], items[i]);
    }
  }
  else if (existingEntry.length > items.length){
    //has image where update does not
    // update section
    gen_updateItem(existingEntry[0], items[0]);
    // update description
    gen_updateItem(existingEntry[2], items[1]);
    // update question
    gen_updateItem(existingEntry[3], items[2]);
    // leave existing image
  }
  else if (existingEntry.length < items.length){
    //does not have image where update does
    // update section
    gen_updateItem(existingEntry[0], items[0]);
    // update description
    gen_updateItem(existingEntry[1], items[2]);
    // update question
    gen_updateItem(existingEntry[3], items[3]);
    // add image and move to section
    var imageItem = gen_addItem(items[1], form);
    form.moveItem(imageItem.getIndex(), existingEntry[0].getIndex() + 1);
  }
}

// returns index of section with identical naming, -1 if null
function ballot_getDuplicateIndex(searchVar, form){
  var sectionItems = form.getItems(FormApp.ItemType.PAGE_BREAK);
  for(var i = 0; i < sectionItems.length; i++){
    if(sectionItems[i].getTitle() === searchVar){
      return sectionItems[i].getIndex();
    }
  }
  return -1;
}

// returns items in form corresponding to the section at index
// assumes header + image + question OR header + question
function ballot_getExistingEntry(index, form){
  var items = form.getItems();
  var sectionItem = items[index];
  
  if(items[index+1].getType() === FormApp.ItemType.IMAGE){
    // has cover image
    return [sectionItem, items[index+1], items[index+2],items[index+3]];
  }
  else{
    return [sectionItem, items[index+1], items[index+2]];
  }
}

function ballot_getSections(form){
  var sectionItems = form.getItems(FormApp.ItemType.PAGE_BREAK);
  var sections = [];
  for(var i = 0; i < sectionItems.length; i++){
      sections.push(sectionItems[i].getTitle());
  }
  return sections.join('\n');
}
