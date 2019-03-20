function getLoanerTemplate() {
  return {
    header : {
      title : 'Book Club Loaners', 'desc' : ''
    },
    sections : {
     section1 : {
        header : {title : '', desc : ''},
        items : [
          {header : {title : 'Book Title', desc : ''}, 
           choices : ['TBA'], 
           options : {required : true}, 
           type : FormApp.ItemType.LIST},
          {header : {title : 'Have or Need?', desc : ''}, 
           choices : ['Have', 'Need'], 
           options : {required : true}, 
           type : FormApp.ItemType.LIST},
        ],
          },
    },
    options : {
          requireLogin : true,
          collectEmail : true,
    },
    metadata : {
      version : '', date : '', type : '',
    },
  };
}

function getSuggestionTemplate() {

}