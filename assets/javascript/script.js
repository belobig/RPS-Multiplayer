"use strict";

/*
 * This is the starting point for the application
 * Configures all the window events, and starts the
 * application.
 * */

// Configure Firebase
// firebase.initializeApp(config);

// Application starts
window.onload = function() {
    // console.log("version: 0.2");
    UI.fillVertically();
		UI.init();
		Session.init();
    Chat.init();
    Game.init();
};

// Manage layout on resize
window.onresize = function() {
    UI.fillVertically();
};