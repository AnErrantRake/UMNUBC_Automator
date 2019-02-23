var INPUT_FORM_ID = '[edit id]'; //the edit id of an existing suggestion form
var NOTIFICATION_EMAIL = '[notification email]';
var FORM_TITLE = 'UPDATE ME'
var FORM_URI_PREFIX = 'https://docs.google.com/forms/d/';

//title text for questions added to suggestion form - title content in the form must match these values
var QUESTION_TITLES = {
  title: 'Book Title:',
  author: 'Book Author:',
  isbn: 'ISBN (optional):',
  pitch: 'Anything you want to say about why you want to read this book?'
}

//commonly used options for GET requests
var FETCH_GET_OPTIONS = {
  "method":"GET",
  "followRedirects" : true,
  "muteHttpExceptions": true
};

//ballot item parameters
var ALL_VOTES_REQUIRED = true;
var BOUND_LOWER = 0;  //0 or 1, uses floor if decimal
var BOUND_UPPER = 4;  //3-10, uses floor if decimal
var LABEL_LEFT = 'I LOATHE THIS TRASH';
var LABEL_RIGHT = 'Ready to start my new cult :)';
