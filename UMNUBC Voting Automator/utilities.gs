//takes an array and makes it a \n separated string - might be replacable w/ .toString()
function concatArray(array){

  var out = '';

  for(var i = 0; i<array.length; i++){
    out = out + array[i] + '\n'
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
