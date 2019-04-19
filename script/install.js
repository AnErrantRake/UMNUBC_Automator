function appInstall() {
    includes('src/install/install.js');
    var runtime = new Install();
    runtime.nuke().pave();
    //.pave().init();
}
