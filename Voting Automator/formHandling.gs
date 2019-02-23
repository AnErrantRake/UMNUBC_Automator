//generates items in the form for each response
//returns false if an error is encountered
function fillForm(newForm, responses){

  var success = true;

  for(var i = 0; i < responses.length; i++){
    if(!addItem(newForm, responses[i])){
      success = false;
    };
  }

  return success;
}

//adds a response as an option on the ballot form
//fails to
function addItem(newForm, response) {

  //query Google Book API for title and author
  var results = getSearchResults(response);
  if(results.totalItems < 1){
    Logger.log('No search results, adding error item');
    addErrorItem(newForm, response);
    return false;
  }

  //search for and extract book details from Google Book API search results
  var bookDetail = getBookDetailFromItems(results.items,response);
  if(bookDetail.title != response.title){
    Logger.log('Selected book does not match expected result - adding error item');
    addErrorItem(newForm, response);
    return false;
  }

  //attempt to retrieve Google API cover
  var img = getImage(bookDetail.imageURI);
  if(img == -1){
    Logger.log('Failed to retrieve book cover, attempting placeholder replacement');
    img = getImage('https://picsum.photos/300/300'); //alternate placeholder image
  }

  if(img.getResponseCode() == 200){
    addCover(newForm, img);
  }

  //combine book details into a string for the item description
  var description = getDescription(bookDetail,response);

  addBallotItem(newForm, response, description);

  return true;
}


//add cover/placeholder image to form
function addCover(form, img){

    form.addImageItem()
      .setImage(img)
      .setAlignment(FormApp.Alignment.CENTER);
}


//add successful ballot item to form with gathered data
function addBallotItem(form, response, description){

  form.addScaleItem()
    .setTitle(response.title + ' - ' + response.author)
    .setHelpText(description)
    .setBounds(BOUND_LOWER, BOUND_UPPER)
    .setLabels(LABEL_LEFT,LABEL_RIGHT)
    .setRequired(ALL_VOTES_REQUIRED);

}


//adds a titled but otherwise empty ballot item to the form
function addErrorItem(newForm, response){

     newForm.addScaleItem()
      .setTitle(response.title + ' - ' + response.author)
      .setHelpText('//****// An Error was encountered generating this entry. \\\\****\\\\')
      .setBounds(BOUND_LOWER, BOUND_UPPER)
      .setLabels(LABEL_LEFT,LABEL_RIGHT)
      .setRequired(ALL_VOTES_REQUIRED);
}
