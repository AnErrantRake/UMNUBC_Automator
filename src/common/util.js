function getContainerSpreadsheet(){
  var database = SpreadsheetApp.getActive();
  if(database == null){
    throw new Error(ERROR_CONTAINER_BOUND);
  }
  return database;
}

function guaranteeScriptsAvailable(){
  var is_installed = PropertiesService.getDocumentProperties().getProperty('is_installed');
  if(is_installed == null){
    resetScriptProperties();
  }
}

function isInstalled(){
  var scriptProperties = PropertiesService.getScriptProperties();

  if( ! PropertiesService.getDocumentProperties().getProperty('is_installed') ){
    SpreadsheetApp.getUi().alert(
      scriptProperties.getProperty('OUTOFORDER_TITLE'),
      scriptProperties.getProperty('OUTOFORDER_DESC'),
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    throw new Error(scriptProperties.getProperty('ERROR_NOT_INSTALLED'));
    return false;
  }
  return true;
}

function formGen(template){
  var templateURL = PropertiesService.getDocumentProperties().getProperty('template_form_url');

  //get form and update main header
  if(templateURL != null && templateURL.length > 0){
    var templateForm = FormApp.openByUrl(templateURL);
    var formID = DriveApp.getFileById(templateForm.getId()).makeCopy().setName(template.header.title).getId();
    var form = FormApp.openById(formID); //gross - probably a better way to cast

    form.setTitle(template.header.title);
    form.deleteAllResponses();
    var items = form.getItems();
    for(var i = 0; i < items.length; i++){
      form.deleteItem(items[i]);
    }
  }
  else{
    var form = FormApp.create(template.header.title);
  }
  form.setDescription(template.header.desc);

  //sections and items
  for(var section in template.sections){
    for(var item in template.sections[section].items){
      //create item
      gen_addItem(template.sections[section].items[item], form);
    }
  }

  //options
  gen_addOptions(template.options,form);

  //metadata


  return form;
}


function warning(title,desc){
  var scriptProperties = PropertiesService.getScriptProperties();

  return SpreadsheetApp.getUi().alert(scriptProperties.getProperty(title),
                                      scriptProperties.getProperty(desc),
                                      SpreadsheetApp.getUi().ButtonSet.YES_NO);
}

function notice(title, desc, info){

  var scriptProperties = PropertiesService.getScriptProperties();

  return SpreadsheetApp.getUi().alert(scriptProperties.getProperty(title),
                                      (scriptProperties.getProperty(desc) + info),
                                      SpreadsheetApp.getUi().ButtonSet.OK);
}

function publicPropertyPrompt(key){
  var documentProperties = PropertiesService.getDocumentProperties();
  var scriptProperties = PropertiesService.getScriptProperties();

  var desc = scriptProperties.getProperty(key+'_desc');         //description
  desc += '\n\nCurrent:' + documentProperties.getProperty(key); //current value
  desc += '\n\nLeave blank to make no changes. Press OK to continue. Press Cancel to quit without making changes.' //instructions
  return SpreadsheetApp.getUi().prompt(key,
                                      desc,
                                      SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
}

function privatePropertyPrompt(key){
  var scriptProperties = PropertiesService.getScriptProperties();

  var desc = scriptProperties.getProperty(key+'_desc');
  return SpreadsheetApp.getUi().prompt(key,
                                      desc,
                                      SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
}

function sendEmail(toList,ccList,bccList,subject,body){
  var to = util_concatArrayComma(toList);
  var cc = util_concatArrayComma(ccList);
  var bcc = util_concatArrayComma(bccList);

  Logger.log("Sending email to: " + to + cc + bcc);
  MailApp.sendEmail(
    to,
    subject,
    body,
    {cc: cc, bcc: bcc, name: 'UMNUBC Automator'}
  );
}

function getDefaultCoverItem(){
  return {
    header : {title : '', desc : ''},
    image : util_getImage('https://picsum.photos/300/300'),
    options : {alignment : FormApp.Alignment.CENTER, width : 300},
    type : FormApp.ItemType.IMAGE
  };
}

function getImage(url){
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
function fetchData(url){

  Logger.log('Querying for data at ' + url);
  var bookRaw = UrlFetchApp.fetch(url,
                                  {
                                    "method":"GET",
                                    "followRedirects" : true,
                                    "muteHttpExceptions": true
                                  }
                                 );

  if (bookRaw.getResponseCode() == 200) {
    return JSON.parse(bookRaw.getContentText());
  }

  return -1;
}

//takes an array and makes it a \n separated string - might be replacable w/ .toString()
function concatArray(array){

  var out = '';

  for(var i = 0; i<array.length; i++){
    out = out + array[i] + '\n'
  }

  return out;
}


//takes an array and makes it a comma separated string
function concatArrayComma(array){

  var out = '';

  for(var i = 0; i<array.length; i++){
    out = out + array[i] + ', '
  }

  return out;
}


//simple comparison with logging
//partials disallowed for titles
function hasTitle(itemTitle, title){

    if(itemTitle === title){
      Logger.log('Has title');
      return true;
    }

  return false;
}


//checks all fields of result item for response author
//does not handle multiple authors in response
function hasAuthor(itemAuthors,author){

  //divide author into individual words
  var authorSplit = author.split(' ');
  var successTracker;

  //for each author in the item
  for(var i = 0; i < itemAuthors.length; i++){
    successTracker = 0;

    //for each word in response author's name
    for(var j = 0; j < authorSplit.length; j++){

      if(itemAuthors[i].indexOf(authorSplit[j])>=0){
        successTracker++;
      }
    }

    //found a match for all components of author's name
    if(successTracker == authorSplit.length){
      Logger.log('Has author');
      return true;
    }
  }
  return false;
}

//returns name of next month based on current time
function getNextMonth(){
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
