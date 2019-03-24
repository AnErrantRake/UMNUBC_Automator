function loaner(response) {
  util_guaranteeScriptsAvailable();
  Logger.log(response);
  //receipts are stored in the spreadsheet
  //possibility for collision here - if response comes in while this is running
  //could lock the form until function completes...probably not worth it
  //less disastrous error is missing a match - locking form breaks the whole thing if anything goes down
  
  //get responses from form newer than 6 months - getResponses(timestamp)
  
  //check if duplicate - same email for same book
    //filter by book
    //filter for response email < 6 months
    //fail if result
  
  //check for available opposite
    //filter responses for opposites < 6 months
    //get first unused
  
  //notify
    //email response, if match, both on cc
    //bcc owner email
  
  //add receipt
    //if sheet doesn't exist, create it - write protected
    //append row w/ transaction data
}

function loaner_manualUpdate(){
  util_guaranteeScriptsAvailable();
  
  var response = util_PublicPropertyPrompt('loaner_current_book');
  if(response.getSelectedButton() == SpreadsheetApp.getUi().Button.CANCEL){
    return;
  }
  else if (response.getResponseText().length > 0){
    PropertiesService.getDocumentProperties().setProperty('loaner_current_book', response.getResponseText());
    loaner_updateBookTitle();
    dashboard();
  }
}

function loaner_updateBookTitle(){
  var documentProperties = PropertiesService.getDocumentProperties();
  
  var formURL = documentProperties.getProperty('loaner_form_url');
  if(formURL != null && formURL.length > 0){
  
    var form = FormApp.openByUrl(formURL); 
    if(form != null){
      
      var items = form.getItems();
      for(var item in items){
        if(items[item].getTitle() == 'Book Title'){
          //update book
          items[item].asListItem().setChoiceValues([documentProperties.getProperty('loaner_current_book')]);
        }
      }
    }
  }
}

function loaner_getCurrentHaves(responses){
  return [];
}

function loaner_getCurrentNeeds(responses){
  return [];
}

function loaner_getCurrentMatches(){
  return [];
}

function loaner_getUpdate(){
  Logger.log("Updating loaner data");
  var documentProperties = PropertiesService.getDocumentProperties();
  var responses = [];
  
  var loanerURL = documentProperties.getProperty('loaner_form_url');
  if(loanerURL != null && loanerURL.length > 0){
    responses = FormApp.openByUrl(loanerURL).getResponses();
  }
  
  documentProperties.setProperty('loaner_have_count', loaner_getCurrentHaves(responses).length);
  documentProperties.setProperty('loaner_need_count', loaner_getCurrentNeeds(responses).length);
  documentProperties.setProperty('loaner_matches_count', loaner_getCurrentMatches().length);
}