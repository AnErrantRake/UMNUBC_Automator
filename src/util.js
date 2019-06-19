function isInstalled(){
  if(PropertiesService.getScriptProperties().getProperty('AutomatorInstalled')){
    return true;
  }
  return false;
}

function propertyNuke(){
  PropertiesService.getDocumentProperties().deleteAllProperties();
  PropertiesService.getScriptProperties().deleteAllProperties();
  PropertiesService.getUserProperties().deleteAllProperties();
}

function util_getContainerSpreadsheet(){
  var database = SpreadsheetApp.getActive();
  if(database == null){
    throw new Error(ERROR_CONTAINER_BOUND);
  }
  return database;
}

function util_Warning(title,desc){
  var scriptProperties = PropertiesService.getScriptProperties();
  
  return SpreadsheetApp.getUi().alert(scriptProperties.getProperty(title), 
                                      scriptProperties.getProperty(desc), 
                                      SpreadsheetApp.getUi().ButtonSet.YES_NO);
}

function util_Notice(title, desc, info){
  
  var scriptProperties = PropertiesService.getScriptProperties();
  
  return SpreadsheetApp.getUi().alert(scriptProperties.getProperty(title), 
                                      (scriptProperties.getProperty(desc) + info), 
                                      SpreadsheetApp.getUi().ButtonSet.OK);
}

function util_friendlyPropertyUpdate(key){
  var reminder = SpreadsheetApp.getUi().alert(
    PropertiesService.getScriptProperties().getProperty('FRIENDLY_UPDATE_TITLE'), 
    key + ' ' + PropertiesService.getScriptProperties().getProperty('FRIENDLY_UPDATE_DESC'), 
    SpreadsheetApp.getUi().ButtonSet.YES_NO);
  if(reminder === SpreadsheetApp.getUi().Button.NO){
    // no change/prompt ignored
    return;
  }
  else{
    // update and return
    util_PublicPropertyPrompt(key);
    return PropertiesService.getDocumentProperties().getProperty(key);
  }
}

function util_PublicPropertyPrompt(key){
  var documentProperties = PropertiesService.getDocumentProperties();
  var scriptProperties = PropertiesService.getScriptProperties();
  
  var desc = scriptProperties.getProperty(key+'_desc');         //description
  desc += '\n\nCurrent:' + documentProperties.getProperty(key); //current value
  desc += '\n\nPress Cancel to quit without making changes.' //instructions
  var response = SpreadsheetApp.getUi().prompt(key, 
                                      desc, 
                                      SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
  if(response.getSelectedButton() === SpreadsheetApp.getUi().Button.CANCEL){
    throw new Error('No change');
  }
  else if (response.getResponseText().length > 0){
    documentProperties.setProperty(key, response.getResponseText());
  }
  else{
    throw new Error('Input is required!');
  }
}

function util_PrivatePropertyPrompt(key){
  var scriptProperties = PropertiesService.getScriptProperties();
  
  var desc = scriptProperties.getProperty(key+'_desc');
  return SpreadsheetApp.getUi().prompt(key, 
                                      desc, 
                                      SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
}

function util_sendEmail(toList,ccList,bccList,subject,body){
  var to = toList.join(', ');
  var cc = ccList.join(', ');
  var bcc = bccList.join(', ');
  
  Logger.log("Sending email to: " + to + cc + bcc);
  MailApp.sendEmail(
    to,
    subject,
    body,
    {cc: cc, bcc: bcc, name: 'UMNUBC Automator'}
  );
}

function util_getImage(url){
  Logger.log('Querying for image at ' + url);
  return UrlFetchApp.fetch(
    url, 
    {
      "method":"GET",
      "followRedirects" : true,
      "muteHttpExceptions": true
    }
  );
}

//takes URI, returns JSON
function util_fetchData(url){
  
  Logger.log('Querying for data at ' + url);
  var bookRaw = UrlFetchApp.fetch(url, 
                                  {
                                    "method":"GET",
                                    "followRedirects" : true,
                                    "muteHttpExceptions": true
                                  }
                                 );
  
  if (bookRaw.getResponseCode() == 200) {
    Logger.log('Data returned successfully');
    return JSON.parse(bookRaw.getContentText());
  }
  
  return -1;
}

//simple comparison with logging
//partials disallowed for titles
function util_hasTitle(itemTitle, title){  
  if(itemTitle.toUpperCase().indexOf(title.toUpperCase()) >= 0){
    Logger.log('Has title');
    return true;
  }
  
  return false;
}


//checks all fields of result item for response author
function util_hasAuthor(itemAuthors,author){
  
  //check for multiple authors - simple ' and ' for now
  var multi = author.split(' and ');
  if(multi.length > 1){
    return util_multiAuthors(itemAuthors,multi);
  }
  
  //check for commas
  var multi = author.split(',');
  if(multi.length > 1){
    return util_multiAuthors(itemAuthors,multi);
  }
  
  //divide author into individual words
  var authorSplit = author.split(' ');
  var successTracker;
  
  //for each author in the item
  for(var i = 0; i < itemAuthors.length; i++){
    successTracker = 0;
    
    //for each word in response author's name
    for(var j = 0; j < authorSplit.length; j++){
      
      if(itemAuthors[i].toUpperCase().indexOf(authorSplit[j].toUpperCase())>=0){
        successTracker++;
      }
    }
    
    //found a match for all components of author's name
    if(successTracker > Math.floor(authorSplit.length / 2)){
      Logger.log('Has author'); //majority of components are present
      return true;
    }
  }
  return false;
}

//for handling multiple authors in response
function util_multiAuthors(itemAuthors, multiAuthors){
  var result = false;
  
  for(var i = 0; i < multiAuthors.length; i++){
    result = result || util_hasAuthor(itemAuthors, multiAuthors[i]);
  }
  return result;
}

//returns name of next month based on current time
function util_getNextMonth(){
  var date = new Date();
  date.setMonth(date.getMonth() + 1); //"if values are greater than their logical range (e.g. 13 is provided as the month value or 70 for the minute value), the adjacent value will be adjusted"
  switch(date.getMonth()){
    case 0:
      return 'January';
    case 1:
      return 'February';
    case 2:
      return 'March';
    case 3:
      return 'April';
    case 4:
      return 'May';
    case 5:
      return 'June';
    case 6:
      return 'July';
    case 7:
      return 'August';
    case 8:
      return 'September';
    case 9:
      return 'October';
    case 10:
      return 'November';
    case 11:
      return 'December';
    default:
      break;
  }
  return 'Unknown Month';
}
