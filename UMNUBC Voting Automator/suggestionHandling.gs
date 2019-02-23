//pulls in responses from a suggestion form
//builds an array of key accessible responses
function getData(sourceFormID) {

  var sourceForm = FormApp.openById(sourceFormID);

  var responseArray = [];
  for(var i = 0; i < sourceForm.getResponses().length; i++){
    responseArray = responseArray.concat(extractResponse(sourceForm.getResponses()[i]));
  }

  return responseArray;
}


//parses a single response into a dictionary object
function extractResponse(rawResponse) {

  var response = {
    title: '',
    author: '',
    isbn: '',
    pitch: ''
  };

  for(var i = 0; i < rawResponse.getItemResponses().length; i++){

    switch(rawResponse.getItemResponses()[i].getItem().getTitle()) {
      case QUESTION_TITLES.title:
        response.title = rawResponse.getItemResponses()[i].getResponse().trim();
        break;
      case QUESTION_TITLES.author:
        response.author = rawResponse.getItemResponses()[i].getResponse().trim();
        break;
      case QUESTION_TITLES.isbn:
        response.isbn = rawResponse.getItemResponses()[i].getResponse().trim();
        break;
      case QUESTION_TITLES.pitch:
        response.pitch = rawResponse.getItemResponses()[i].getResponse().trim();
        break;
      default:
        break;
    }
  }

  return response;
}
