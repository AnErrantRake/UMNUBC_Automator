function appInstall() {
    includes('src/install/install.js');
    var runtime = new Install();
    runtime.nuke().pave().init();
}

function appRemove() {
  includes('src/install/install.js');
  var runtime = new Install();
  runtime.nuke();
}
