function shuffle() {
  var formURL = PropertiesService.getDocumentProperties().getProperty('vote_form_url');
  if(formURL == null || !(formURL.length > 0)){
    throw new Error("Shuffling requires an existing ballot form");
    return;
  }
  var form = FormApp.openByUrl(formURL);
  var items = form.getItems();
  
  var entries = [];
  var entry = [];
  for(var i = 0; i < items.length; i++){
    if(items[i].getType() === FormApp.ItemType.PAGE_BREAK){
      entries.push(entry);
      entry = [];
      entry.push(items[i]);
    }
    else if (i === (items.length - 1)){
      entry.push(items[i]);
      entries.push(entry);
    }
    else{
      entry.push(items[i]);
    }
  }
  
  while(entries.length > 0){
    var randIndex = Math.floor(Math.random()*entries.length);
    var randEntry = entries[randIndex];
    pushToBottom(randEntry, form);
    entries.splice(randIndex, 1);
  }
  
}

function pushToBottom(entry, form){
  for(var i = 0; i < entry.length; i++){
    form.moveItem(entry[i], (form.getItems().length - 1));
  }
}