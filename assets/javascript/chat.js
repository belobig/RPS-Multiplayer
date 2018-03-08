"use strict";

// Module for managing the real-time chat.
var Chat = (function () {
	var send;
	var messageField;
	var messages;
	var ref;

	//Turn on or off chat UI capabilities
	function enableChat(enable) {
		console.log("enabling chat: ", enable);
		[send, messageField].forEach(function (item) {
			item.disabled = !enable;
		});
	}

	//Push a chat message to firebase
	function sendChatMessage() {
		enableChat(false);
		ref.push().set({
			name: firebase.auth().currentUser.displayName,
			message: messageField.value
		}, function (error) {
			if (error) {
				console.log("Oh crap, error saving data.", error);
				UI.snackbar({ message: "Error sending message" });
			} else {
				messageField.value = "";
				messageField.parentElement.classList.remove("is-dirty");
			}

			enableChat(true);
		});

	}

	// Add a chat message to the chat UI
	function addChatMessage(name, message) {
		var item = document.createElement("li");
		item.innerHTML = "<strong>" + name + "</strong>" + message;

		var messageList = messages.querySelector("ul");
		messageList.appendChild(item);
		messages.scrollTop = messageList.scrollHeight;
	}

	// Exposed functions
	return {
		// Setup click handlers for the chat UI
		//Add firebase listeners to /chat to act when chat messages are sent to firebase
		init: function () {
			send = document.querySelector("#send-chat");
			messageField = document.querySelector("#chat-message");
			messages = document.querySelector("#chat-messages");

			// my realtime database reference
			ref = firebase.database().ref("/chat");

			send.addEventListener("click", sendChatMessage);

			// as soon as the initial set is loaded, get up to date chat messages
			ref.on("child_added", function (snapshot) {
				var message = snapshot.val();
				addChatMessage(message.name, message.message);
			});
		},

		// Enable chat after user has logged in
		onlogin: function () {
			enableChat(true);
		}
	}
})();
