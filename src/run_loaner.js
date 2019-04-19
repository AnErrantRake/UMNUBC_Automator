function loaner(event) {
  util_guaranteeScriptsAvailable();
  //receipts are stored in the spreadsheet
  //possibility for collision here - if response comes in while this is running
  //could lock the form until function completes...probably not worth it
  //less disastrous error is missing a match - locking form breaks the whole thing if anything goes down
  
  var responseEmail = event.response.getRespondentEmail();  
  var responseType = '';
  var responseBook = '';
  var titleItem = null;
  var typeItem = null;
  
  for(var i = 0; i < event.response.getItemResponses().length; i++){
    
    if(event.response.getItemResponses()[i].getItem().getTitle() == 'Book Title'){
      responseBook = event.response.getResponseForItem(event.response.getItemResponses()[i].getItem()).getResponse();
      titleItem = event.response.getItemResponses()[i].getItem();
    }
    else if(event.response.getItemResponses()[i].getItem().getTitle() == 'Have or Need?'){
      responseType = event.response.getResponseForItem(event.response.getItemResponses()[i].getItem()).getResponse();
      typeItem = event.response.getItemResponses()[i].getItem();
    }
  }
  
  //get responses from form newer than 6 months - getResponses(timestamp)
  var form = FormApp.openByUrl(PropertiesService.getDocumentProperties().getProperty('loaner_form_url'));
  if(form.getId() != event.source.getId()){
    //not a current form -  attempt deletion and ignore
    var oldFormTriggers = ScriptApp.getUserTriggers(event.source);
    for(var i = 0; i < oldFormTriggers.length; i++){
      if(oldFormTriggers[i].getUniqueId() == event.triggerUid){
        Logger.log("Trigger deleted for form " + event.source.getId());
        ScriptApp.deleteTrigger(oldFormTriggers[i]);
      }
    }
    Logger.log("Fired by out of date form - exiting");
    return;
  }
  var minimumDate = new Date();
  minimumDate.setMonth(minimumDate.getMonth() - 6);
  var responses = form.getResponses(minimumDate);
  
  
  //find potential matches and check for duplicate
  var filteredResponses = [];
  for(var i = 0; i < responses.length; i++){
    //same book
    if(responses[i].getResponseForItem(titleItem).getResponse() == responseBook){
      //event is a duplicate response
      if(responses[i].getId() != event.response.getId() && responses[i].getRespondentEmail() == responseEmail){
        Logger.log("Duplicate response - deleting and exiting");
        form.deleteResponse(event.response.getId());
        return;
      }
      //event is a need, filter for have
      else if(responseType == 'Need' &&
              responses[i].getResponseForItem(typeItem).getResponse() == 'Have'){
        filteredResponses.push(responses[i]);
      }
      //event is a have, filter for need
      else if(responseType == 'Have' &&
              responses[i].getResponseForItem(typeItem).getResponse() == 'Need'){
        filteredResponses.push(responses[i]);
      }
      
    }
  }
  filteredResponses.sort(loaner_timestampCompare);
  var potentials = [];
  for(var i = 0; i < filteredResponses.length; i++){
    potentials.push(filteredResponses[i].getRespondentEmail());
  }
    
  var receiptHeader = ['Have','Need','Book','Date'];
  var receiptsSheet = SpreadsheetApp.getActive().getSheetByName('Receipts');
  if(receiptsSheet == null){
    receiptsSheet = SpreadsheetApp.getActive().insertSheet('Receipts');
    receiptsSheet.deleteColumns(receiptHeader.length+1, receiptsSheet.getMaxColumns()-receiptHeader.length);
    receiptsSheet.appendRow(receiptHeader);
    
    util_sendEmail(
      [responseEmail],
      [],
      [],
      PropertiesService.getScriptProperties().getProperty('LOANER_EMAIL_' + responseType.toUpperCase() + '_SUBJECT') + responseBook,
      PropertiesService.getScriptProperties().getProperty('LOANER_EMAIL_' + responseType.toUpperCase() + '_BODY')
    );
    Logger.log("No match found - emailing status and exiting");
    return;
  }
  
  //pull receipts from spreadsheet    
    //filter responses for opposites < 6 months
  var dataset = receiptsSheet.getDataRange().getValues().filter(loaner_isCurrent);
  var receiptEmails = [];
  for(var i = 0; i < dataset.length; i++){
    if(responseType == 'Have'){
      //used 'need' emails
      receiptEmails.push(dataset[i][1]);
    }
    else{
      //used 'have' emails
      receiptEmails.push(dataset[i][0]);
    }
  }
  
  //check for available opposite
    //list of valid -> responses without a receipt
  var validContacts = [];
  var validContacts = potentials.filter(function(val) {
    return receiptEmails.indexOf(val) == -1;
  });
  
  //notify
    //email response, if match, both on cc
    //bcc owner email
  if(validContacts.length > 0){
    var match = validContacts[0];
    Logger.log("Found match, sending emails");
    util_sendEmail(
      [],
      [responseEmail,match],
      [Session.getActiveUser().getEmail()],
      PropertiesService.getScriptProperties().getProperty('LOANER_EMAIL_SUCCESS_SUBJECT') + responseBook,
      PropertiesService.getScriptProperties().getProperty('LOANER_EMAIL_SUCCESS_BODY')
    );
    
  //add receipt
    //append row w/ transaction data
    if(responseType == 'Have'){
      var receipt = [responseEmail,match,responseBook,(new Date()).toDateString()]
    }
    else{
      var receipt = [match,responseEmail,responseBook,(new Date()).toDateString()];
    }
    Logger.log("Adding receipt");
    receiptsSheet.appendRow(receipt);
  }
  else{
    Logger.log("No match found - emailing status and exiting");
    util_sendEmail(
      [responseEmail],
      [],
      [],
      PropertiesService.getScriptProperties().getProperty('LOANER_EMAIL_' + responseType.toUpperCase() + '_SUBJECT') + responseBook,
      PropertiesService.getScriptProperties().getProperty('LOANER_EMAIL_' + responseType.toUpperCase() + '_BODY')
    );
  }
  
}

function loaner_isCurrent(dataRow){
  var minimumDate = new Date();
  minimumDate.setMonth(minimumDate.getMonth() - 6);
  
  var date = new Date(dataRow[3]);
  if(date < minimumDate){
    return false;
  }
  return true;
}

//oldest to top of list
function loaner_timestampCompare(a,b){
  var comparison = 0;
  if(a.getTimestamp() > b.getTimestamp()){
    comparison = 1;
  }
  else if (a.getTimestamp() < b.getTimestamp()){
    comparison = -1
  }
  return comparison;
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
  var bookTitle = documentProperties.getProperty('loaner_current_book');
  if(bookTitle != null && bookTitle.length > 0 && formURL != null && formURL.length > 0){
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

function loaner_getCurrentHavesAndNeeds(){
  var currentBook = PropertiesService.getDocumentProperties().getProperty('loaner_current_book');
  //get responses from form newer than 6 months - getResponses(timestamp)
  var url = PropertiesService.getDocumentProperties().getProperty('loaner_form_url');
  if(url == null || url.length <= 0){
    return [[],[]];
  }
  var form = FormApp.openByUrl(url);
  var minimumDate = new Date();
  minimumDate.setMonth(minimumDate.getMonth() - 6);
  var responses = form.getResponses(minimumDate);
  if(responses.length <= 0){
    return [[],[]];
  }
  
  var titleItem = null;
  var typeItem = null;
  
  for(var i = 0; i < responses[0].getItemResponses().length; i++){
    
    if(responses[0].getItemResponses()[i].getItem().getTitle() == 'Book Title'){
      titleItem = responses[0].getItemResponses()[i].getItem();
    }
    else if(responses[0].getItemResponses()[i].getItem().getTitle() == 'Have or Need?'){
      typeItem = responses[0].getItemResponses()[i].getItem();
    }
  }
  
  //find potential matches and check for duplicate
  var currentHaves = [];
  var currentNeeds = [];
  for(var i = 0; i < responses.length; i++){
    //same book
    if(responses[i].getResponseForItem(titleItem).getResponse() == currentBook){
      if(responses[i].getResponseForItem(typeItem).getResponse() == 'Have'){
        currentHaves.push(responses[i]);
      }
      else{
        currentNeeds.push(responses[i]);
      }
    }
  }
  return [currentHaves,currentNeeds];
}

function loaner_getCurrentMatchCount(){
  var matchCount = 0;
  var receiptsSheet = SpreadsheetApp.getActive().getSheetByName('Receipts');
  if(receiptsSheet != null){
    matchCount = receiptsSheet.getDataRange().getValues().filter(loaner_isCurrent).length - 1;
  };
  return matchCount;
}

function loaner_getUpdate(){
  Logger.log("Updating loaner data");
  var documentProperties = PropertiesService.getDocumentProperties();
  var responses = [];
  var havesAndNeeds = loaner_getCurrentHavesAndNeeds();
  
  documentProperties.setProperty('loaner_have_count', havesAndNeeds[0].length);
  documentProperties.setProperty('loaner_need_count', havesAndNeeds[1].length);
  documentProperties.setProperty('loaner_matches_count', loaner_getCurrentMatchCount());
}