function loaner(response) {
  Logger.log(response);
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

function loaner_getUpdate(){
  Logger.log("Updating loaner data");
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperty('loaner_have_count', 0);
  documentProperties.setProperty('loaner_have_need', 0);
  documentProperties.setProperty('loaner_matches', 0);
}