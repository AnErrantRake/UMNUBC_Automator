function ballotGenerator() {
  //pull in data sets
  var responseArray = getData(INPUT_FORM_ID);
  Logger.log('Retrieved ' + responseArray.length + ' data sets from ' + INPUT_FORM_ID);
  
  //create new form
  var newForm = FormApp.create(FORM_TITLE);
  Logger.log('New form created at ' + (FORM_URI_PREFIX + newForm.getId()));
  
  //create question for each data set
  var success = fillForm(newForm, responseArray);
  Logger.log('Created new questions');
  
  //notify of new voting form status
  if(success){
    notify(NOTIFICATION_EMAIL, (FORM_URI_PREFIX + newForm.getId()));
  }
  else{
    report(NOTIFICATION_EMAIL, (FORM_URI_PREFIX + newForm.getId()));
  }
  Logger.log('Sent notification email for creation to ' + NOTIFICATION_EMAIL);
}


//for generating questions with manual entry - 1 by 1, saves time with fixing typos/adding author initials
function manualItemGenerator(){
  
  var MANUAL_FORM_ID = '1C8u4TqNxF7lHeeiArSNgMnj8vradObQoJviBcNFSdJc'; //the edit id of an existing ballot form
  
  var form = FormApp.openById(MANUAL_FORM_ID);
  var response = {
    title: 'title',
    author: 'author name',
    pitch: 'pitch text'
  };
  addItem(form, response);
}


//for generating suggestion forms in the format/order expected by the script
function newSuggestionFormGenerator(){
  
  var SUGGESTION_FORM_TITLE = '[month] Reading: Suggest a (Probably) Great Book';
  
  //create new form
  var newForm = FormApp.create(SUGGESTION_FORM_TITLE);
  Logger.log('New form created at ' + (FORM_URI_PREFIX + newForm.getId()));
   
  //title
  newForm.addTextItem()
    .setTitle(QUESTION_TITLES.title)
    .setRequired(true);
  
  //author
  newForm.addTextItem()
    .setTitle(QUESTION_TITLES.author)
    .setRequired(true);
  
  //ISBN
  newForm.addTextItem()
    .setTitle(QUESTION_TITLES.isbn)
    .setRequired(false);
  
  //pitch
  newForm.addParagraphTextItem()
    .setTitle(QUESTION_TITLES.pitch)
    .setRequired(false);
  
  //send email with link to new form
  notify(NOTIFICATION_EMAIL, (FORM_URI_PREFIX + newForm.getId()));
}
