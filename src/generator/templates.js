function getLoanerTemplate() {
  return {
    header : {
      title : 'Book Club Loaners', desc : ''
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
          allowResponseEdits : false,
          confirmationMessage : 'If this is your first time submitting for this book, you should receive an email response.',
          isQuiz : false,
          limitOneResponsePerUser : true,
          progressBar : false,
          publishingSummary : false,
          showLinkToRespondAgain : false,
          shuffleQuestions : false, 
    },
    metadata : {
      version : '1.0', date : new Date(), type : 'loaner',
    },
  };
}

function getSuggestionTemplate() {
  return {
    header : {
      title : (util_getNextMonth() + ' Reading: Suggest a (Probably) Great Book'), 
      desc : ''
    },
    sections : {
     section1 : {
        header : {title : '', desc : ''},
        items : [
          {header : {title : 'Your Name (optional)', desc : ''},  
           options : {required : false}, 
           type : FormApp.ItemType.TEXT},
          {header : {title : 'Book Title', desc : ''}, //contains 'title'
           options : {required : true}, 
           type : FormApp.ItemType.TEXT},
          {header : {title : 'Book Author', desc : ''}, //contains 'author'
           options : {required : true}, 
           type : FormApp.ItemType.TEXT},
          {header : {title : 'ISBN (optional)', desc : 'This will be used to help lookup information about the book.'}, //contains 'ISBN'
           options : {required : false}, 
           type : FormApp.ItemType.TEXT},
          {header : {title : 'Pitch this book!', desc : 'This will be displayed on the ballot.'}, //contains 'pitch'
           options : {required : false}, 
           type : FormApp.ItemType.PARAGRAPH_TEXT},
        ],
          },
    },
    options : {
      requireLogin : false,
      collectEmail : false,
      allowResponseEdits : false,
      confirmationMessage : '',
      isQuiz : false,
      limitOneResponsePerUser : false,
      progressBar : false,
      publishingSummary : false,
      showLinkToRespondAgain : true,
      shuffleQuestions : false, 
    },
    metadata : {
      version : '1.0', date : new Date(), type : 'suggestion',
    },
  };
}


function getBallotTemplate() {
  return {
    header : {
      title : (util_getNextMonth() + ' Book Voting'),
      desc : 'Thanks to everybody that suggested books to read!\n\nOur voting system works like this: if you vote a 0 or a 1, you are voting against that book. If you vote a 3 or a 4, you are voting for that book (to their respective degrees). 2 (or a non-vote) is neutral -- when you don\'t really care either way if we read the book or not.'
    },
    sections : {
     section1 : {
        header : {title : '', desc : ''},
        items : [], //filled by runner
          },
    },
    options : {
      requireLogin : false,
      collectEmail : false,
      allowResponseEdits : false,
      confirmationMessage : '',
      isQuiz : false,
      limitOneResponsePerUser : true,
      progressBar : true,
      publishingSummary : false,
      showLinkToRespondAgain : false,
      shuffleQuestions : false, //no way to link images and questions with this 'true'
    },
    metadata : {
      version : '1.0', date : new Date(), type : 'ballot',
    },
  };
}