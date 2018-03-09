"use strict";

//Module for layouts and UI controls
var UI = (function () {

	// Exposed functions
	return {
		// Make Layout fill div vertically
		fillVertically: function () {
			//fill vertically
			var pageHeader = document.querySelector("header"); //changed from just 'header'
			var chat = document.querySelector("#chat");
			chat.style.height = (window.innerHeight - pageHeader.clientHeight - 32) + "px";

			//expand out chat area
			var messages = document.querySelector("#chat-messages");
			var chatHeader = document.querySelector("#chat-header");
			var input = document.querySelector("#chat-input");

			messages.style.height = (chat.clientHeight - (chatHeader.clientHeight + input.clientHeight)) + "px";

			//manage image height -- Probably won't need this
			var images = document.querySelectorAll("#game .face");
			var height = (chat.clientHeight / 2) - 80;
			for (var counter = 0; counter < images.length; counter++) {
				var img = images.item(counter);
				img.style.maxHeight = height + "px";
			}
		},

		/*
		 * Simple way to show an MDL snackbar at the bottom of the page
		 * https://getmdl.io/components/index.html#snackbar-section
		 * */
		snackbar: function (data) {
			document.querySelector("#snackbar").MaterialSnackbar.showSnackbar(data);
		},

		/*
		 * Initialization for some generic ui elements
		 * */
		init: function () {
			// help dialog -- Probably won't need this
			// document.querySelector("#help").addEventListener("click", function () {
			// 	document.querySelector('#help-dialog').showModal();
			// });

			// play again dialog
			var result = document.querySelector("#result");
			result.querySelector("button").addEventListener("click", function () {
				//result.close();
				window.location.reload();
			});
		}
	}
})();