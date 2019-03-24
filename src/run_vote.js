function vote_calculation(){
  util_guaranteeScriptsAvailable();
    
  var winner = vote_calculator();
  if(winner[1]){
    util_Notice('VOTE_CALC_TIE_TITLE', 'VOTE_CALC_TIE_DESC', winner[0]);
  }
  else{
    util_Notice('VOTE_CALC_WINNER_TITLE', 'VOTE_CALC_WINNER_DESC', winner[0]);
  }
  
  dashboard();
}

function vote_calculator(){
  
  var documentProperties = PropertiesService.getDocumentProperties();
  var url = documentProperties.getProperty('vote_form_url');
  
  var form = FormApp.openByUrl(url);
  var responses = form.getResponses();
  var responseCount = responses.length;
  //assumption - response order is matched to item order
  //assumption - every vote item 
  //based on docs and gen, but whole algo breaks if false
    
  //prefill the tabulation values
  //for each sectionheader
  var sections = form.getItems(FormApp.ItemType.PAGE_BREAK);
  var tabulation = [];
  for(var i = 0; i < sections.length; i++){
    tabulation.push(
      {
        book : sections[i].getTitle(),
        voteTotal : 0,
        voteCount : 0,
      }
    )
  }
  
  var questions = form.getItems(FormApp.ItemType.SCALE);
  //for each response
  //for each response item
  //for each possible item - if match, count and break
  for(var i = 0; i < responseCount; i++){
    for(var j = 0; j < responses[i].getItemResponses().length; j++){
      for(var k = 0; k < questions.length; k++){
        if(questions[k].getId() == responses[i].getItemResponses()[j].getItem().getId()){
          //match
          var voteValue = parseInt(responses[i].getItemResponses()[j].getResponse());
          switch(voteValue){
            case 0:
              tabulation[k].voteTotal += -8;
              break;
            case 1:
              tabulation[k].voteTotal += -4;
              break;
            case 2:
              tabulation[k].voteTotal += 0;
              break;
            case 3:
              tabulation[k].voteTotal += 5;
              break;
            case 4:
              tabulation[k].voteTotal += 9;
              break;
            default:
              break;
          }
          tabulation[k].voteCount += 1;
          break;
        }
      }
    }
  }
  
  for(var i = 0; i < tabulation.length; i++){
    if(responseCount > 0){
      tabulation[i].voteTotal = tabulation[i].voteTotal * (tabulation[i].voteCount / responseCount);
    }
  }
  tabulation.sort(vote_compare);
  Logger.log(tabulation);
  
  var winnerList = [tabulation[0].book];
  var checkVar = 0;
  while(tabulation[checkVar+1] != null && tabulation[checkVar].voteTotal == tabulation[checkVar+1].voteTotal){
    winnerList.push(tabulation[checkVar+1].book);
    checkVar++;
  }
  
  var winner = winnerList[0];
  var tie = false;
  if(winnerList.length > 1){
    winner = util_concatArrayComma(winnerList);
    tie = true;
  }
  
  return [winner,tie];
  
}

function vote_compare(a,b){
  var comparison = 0;
  if(a.voteTotal < b.voteTotal){
    comparison = 1;
  }
  else if (a.voteTotal > b.voteTotal){
    comparison = -1
  }
  return comparison;
}

function vote_getUpdate(){
  util_guaranteeScriptsAvailable();
  Logger.log("Updating vote data");
  var documentProperties = PropertiesService.getDocumentProperties();
  var responseCount = 0;
  var currentLeader = 'undetermined';
    
  var ballotURL = documentProperties.getProperty('suggestion_form_url');
  if(ballotURL != null && ballotURL.length > 0){
    var form = FormApp.openByUrl(ballotURL);
    responseCount = form.getResponses().length;
    currentLeader = vote_calculator()[0];
  }
  
  documentProperties.setProperty('vote_count', responseCount);
  documentProperties.setProperty('vote_current_leader', currentLeader);
}
