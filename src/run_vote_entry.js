function vote_ballot_entry() {
  
  var formURL = PropertiesService.getDocumentProperties().getProperty('vote_form_url');
  if(formURL == null || !(formURL.length > 0)){
    throw new Error("Adding an entry requires an existing ballot form");
    return;
  }
    
  var input = vote_entry_input();
  if(input != null){
    var items = vote_entry_details(input);
    if(items != null){
      var form = FormApp.openByUrl(formURL);
      var duplicateIndex = ballot_getDuplicateIndex(items[0].header.title, form);
      if(duplicateIndex < 0){
        for(var i = 0; i < items.length; i++){
          gen_addItem(items[i], form);
        }
      }
      else{
        // is duplicate
        Logger.log('Identified a duplicate value');
        ballot_updateExistingEntry(ballot_getExistingEntry(duplicateIndex, form), items, form);
      }
    }
  }
}

function vote_entry_input(){
  //fill the responseDict
  var responseDict = {
    title: '',
    author: '',
    isbn: '',
    pitch: ''
  };
  
  var title = SpreadsheetApp.getUi().prompt('Provide a title:', 
                                            'Cannot be blank', 
                                            SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
  if(title.getSelectedButton() == SpreadsheetApp.getUi().Button.OK && title.getResponseText().length > 0){
    responseDict.title = title.getResponseText().trim();
  }
  else {
    if(title.getSelectedButton() == SpreadsheetApp.getUi().Button.OK){
      throw new Error('Input is required!');
    }
    return;
  }
  
  var author = SpreadsheetApp.getUi().prompt('Provide an author:', 
                                             'Cannot be blank', 
                                             SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
  if(author.getSelectedButton() == SpreadsheetApp.getUi().Button.OK && author.getResponseText().length > 0){
    responseDict.author = author.getResponseText().trim();
  }
  else {
    if(title.getSelectedButton() == SpreadsheetApp.getUi().Button.OK){
      throw new Error('Input is required!');
    }
    return;
  }
  
  var isbn = SpreadsheetApp.getUi().prompt('Provide an ISBN:', 
                                           'This is optional, leave blank if unavailable.', 
                                           SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
  if(isbn.getSelectedButton() == SpreadsheetApp.getUi().Button.OK && isbn.getResponseText().length > 0){
    responseDict.isbn = isbn.getResponseText().trim();
  }
  else if(isbn.getSelectedButton() == SpreadsheetApp.getUi().Button.CANCEL){
    return;
  }
  
  var pitch = SpreadsheetApp.getUi().prompt('Provide a pitch:', 
                                            'This is optional, leave blank if unavailable.', 
                                            SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
  if(pitch.getSelectedButton() == SpreadsheetApp.getUi().Button.OK && pitch.getResponseText().length > 0){
    responseDict.pitch = pitch.getResponseText().trim();
  }
  else if(pitch.getSelectedButton() == SpreadsheetApp.getUi().Button.CANCEL){
    return;
  }
  
  var confirm = SpreadsheetApp.getUi().alert('Confirm provided details:', 
                                             'Your inputs:' + 
                                             '\n  Title: ' + responseDict.title + 
                                             '\n  Author: ' + responseDict.author + 
                                             '\n  ISBN: ' + responseDict.isbn + 
                                             '\n  Pitch: ' + responseDict.pitch + 
                                             '\n\n\n Good to go?' +
                                             '\n\nIf you answer \'No\', the script will terminate here.', 
                                             SpreadsheetApp.getUi().ButtonSet.YES_NO);
  if(confirm == SpreadsheetApp.getUi().Button.NO){
    return;
  }
  
  return responseDict;
}