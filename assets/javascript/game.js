"use strict";

/**
 * Module that controls all the gameplay logic and UI of Rock, Paper, Scissors Multiplayer
 */
var Game = (function () {

	var ref;
	//set of states a game can be in.
	var STATE = { OPEN: 1, JOINED: 2, COMPLETE: 3 };
	var PIECES = {
		ROCK: { label: "Rock", url: "assets/images/rock.jpg" },
		PAPER: { label: "Paper", url: "assets/images/paper.jpg" },
		SCISSORS: { label: "Scissors", url: "assets/images/scissors.jpg" }
	};

	//ui elements
	var create;
	var gameList;


	/*
	 * Enable the ability (via the UI) for the currently logged in player
	 * to create a game
	 * */
	function enableCreateGame(enabled) {
		create.disabled = !enabled;
	}

	/*
	 * Add a join game button to the list, for a given game.
	 * */
	function addJoinGameButton(key, game) {
		var item = document.createElement("li");
		item.id = key;
		item.innerHTML = '<button id="create-game" ' +
			'class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">' +
			'Join ' + game.creator.displayName + '</button>';
		item.addEventListener("click", function () {
			joinGame(key);
		});

		gameList.appendChild(item);
	}

	/*
	 * Create a game in Firebase
	 * */
	function createGame() {
		console.log("creating a game!");
		enableCreateGame(false);

		var user = firebase.auth().currentUser;
		var currentGame = {
			creator: {
				uid: user.uid,
				displayName: user.displayName
			},
			state: STATE.OPEN
		};

		var key = ref.push();
		key.set(currentGame, function (error) {
			if (error) {
				console.log("Uh oh, error creating game.", error);
				UI.snackbar({ message: "Error creating game" });
			} else {
				//disable access to joining other games
				console.log("I created a game!", key);
				//drop this game, if I disconnect
				key.onDisconnect().remove();
				gameList.style.display = "none";
				watchGame(key.key);
			}
		})
	}

	/*
	 * Join an open game, via it's unique key.
	 * */
	function joinGame(key) {
		console.log("Attempting to join game: ", key);
		var user = firebase.auth().currentUser;
		ref.child(key).transaction(function (game) {
			//only join if someone else hasn't
			if (!game.joiner) {
				game.state = STATE.JOINED;
				game.joiner = {
					uid: user.uid,
					displayName: user.displayName
				}
			}
			return game;
		}, function (error, committed, snapshot) {
			if (committed) {
				if (snapshot.val().joiner.uid == user.uid) {
					enableCreateGame(false);
					watchGame(key);
				} else {
					UI.snackbar({ message: "Game already joined. Please choose another." });
				}
			} else {
				console.log("Could not commit when trying to join game", error);
				UI.snackbar({ message: "Error joining game" });
			}
		});
	}

	/*
	 * One the current player has joined a game, update the UI
	 * and move the game state to TAKE_PICTURE
	 * */
	function joinedGame(game, gameRef) {
		if (game.creator.uid == firebase.auth().currentUser.uid) {
			UI.snackbar({ message: game.joiner.displayName + " has joined your game." });
		}
	}










	/*
	 * If both players have emotions, we'll work out the
	 * winner, save the results, and update the game state to COMPLETE.
	 * */
	function determineWinner(gameRef, game) {
		//the creator can manage this. So if you aren't them, exit now.
		if (game.creator.uid != firebase.auth().currentUser.uid) {
			return
		}
		//make sure we have both emotions.
		if (!(game.creator.emotion && game.joiner.emotion)) {
			return
		}

		console.log("We both have emotions!");
		var creatorWins = false;
		var joinerWins = false;

		if (game.creator.emotion.label == EMOTIONS.HAPPY.label &&
			game.joiner.emotion.label == EMOTIONS.ANGRY.label) {
			creatorWins = true;
		} else if (game.creator.emotion.label == EMOTIONS.SURPRISED.label &&
			game.joiner.emotion.label == EMOTIONS.HAPPY.label) {
			creatorWins = true;
		} else if (game.creator.emotion.label == EMOTIONS.ANGRY.label &&
			game.joiner.emotion.label == EMOTIONS.SURPRISED.label) {
			creatorWins = true;
		} else if (game.creator.emotion.label == game.joiner.emotion.label) {
			//do nothing, its a draw
		} else if (game.creator.emotion.label == UNKNOWN_EMOTION.label) {
			joinerWins = true;
		} else if (game.joiner.emotion.label == UNKNOWN_EMOTION.label) {
			creatorWins = true;
		} else {
			joinerWins = true;
		}

		console.log("Setting game state as complete");
		gameRef.update({
			state: STATE.COMPLETE,
			"creator/wins": creatorWins,
			"joiner/wins": joinerWins
		});
	}

	/*
	 * Displays in the UI who won!
	 * */
	function showWinner(game) {
		var result = document.querySelector("#result");
		var resultTitle = result.querySelector(".mdl-dialog__title");

		if (result.open) {
			return;
		}

		if (game.creator.wins == game.joiner.wins) {
			resultTitle.innerText = "It was a DRAW! 😒";
			result.showModal();
			return;
		}

		var player = game.creator;
		if (game.joiner.uid == firebase.auth().currentUser.uid) {
			player = game.joiner;
		}

		if (player.wins) {
			resultTitle.innerText = "YOU WON! 😃";
		} else {
			resultTitle.innerHTML = "Sorry.<br/>You lost. 😢"
		}

		result.showModal();
	}

	/*
	 * Watch the current game, and depending on state
	 * changes, perform actions to move the game on to the next state.
	 * */
	function watchGame(key) {
		var gameRef = ref.child(key);
		gameRef.on("value", function (snapshot) {
			var game = snapshot.val();
			console.log("Game update:", game);

			//if we get a null value, because remove - ignore it.
			if (!game) {
				UI.snackbar({ message: "Game has finished. Please play again." });
				enableCreateGame(true);
				return
			}

			switch (game.state) {
				case STATE.JOINED:
					joinedGame(game, gameRef);
					break;
				case STATE.COMPLETE:
					showWinner(game);
					break;
			}
		})
	}

	// Exposed functions
	return {
		/*
		 * Firebase event handlers for when open games are created,
		 * and also handing when they are removed.
		 * */
		init: function () {
			create = document.querySelector("#create-game");
			create.addEventListener("click", createGame);

			gameList = document.querySelector("#games ul");
			cam = document.querySelector("#cam");
			dialog = document.querySelector("#game-cam");

			ref = firebase.database().ref("/games");

			var openGames = ref.orderByChild("state").equalTo(STATE.OPEN);
			openGames.on("child_added", function (snapshot) {
				var data = snapshot.val();
				console.log("Game Added:", data);

				//ignore our own games
				if (data.creator.uid != firebase.auth().currentUser.uid) {
					addJoinGameButton(snapshot.key, data);
				}
			});

			openGames.on("child_removed", function (snapshot) {
				var item = document.querySelector("#" + snapshot.key);
				if (item) {
					item.remove();
				}
			});
		},

		/*
		 * Enable creation of open games once the player has logged in.
		 * */
		onlogin: function () {
			enableCreateGame(true);
		}
	};
})
	();