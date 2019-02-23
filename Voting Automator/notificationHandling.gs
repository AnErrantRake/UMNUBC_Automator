//sends success notification email
function notify(notifyEmail, newFormURI) {

  var NOTIFY_BODY_INTRO = 'The form can be found at ';
  var NOTIFY_BODY_CONC = ' Be sure to manually review the result before distributing.';

  MailApp.sendEmail(
    notifyEmail, //to
    'Voting Automator - Successful Form Creation', //subject
    NOTIFY_BODY_INTRO + newFormURI + NOTIFY_BODY_CONC //body
  );
}


//sends error notification email
function report(notifyEmail, newFormURI) {

  var REPORT_BODY = 'An error occurred during question creation. Manual review is required of the form found at ';

  MailApp.sendEmail(
    notifyEmail, //to
    'Voting Automator - Error during Automated Form Creation', //subject
    REPORT_BODY + newFormURI //body
  );
}
