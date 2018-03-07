// Initialize Firebase
var config = {
	apiKey: "AIzaSyCpv3cS3sO0e5cgLD8O2GkHyDLo5VoyUVw",
	authDomain: "kelly-costner-firebase-hw.firebaseapp.com",
	databaseURL: "https://kelly-costner-firebase-hw.firebaseio.com",
	projectId: "kelly-costner-firebase-hw",
	storageBucket: "kelly-costner-firebase-hw.appspot.com",
	messagingSenderId: "752817456018"
};
firebase.initializeApp(config);

var database = firebase.database();

// FirebaseUI config.
var uiConfig = {
	signInSuccessUrl: 'index.html',
	signInOptions: [
		// Leave the lines as is for the providers you want to offer your users.
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
	],
	// Terms of service url.
	tosUrl: '<your-tos-url>'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);


var signOutBtn = '<button class="btn btn-primary" id="signOutBtn"><span class="glyphicon glyphicon-log-out"></span></button>';

var playArea = '<div class="col-lg-12 text-center whtRndBrdr" id="playArea"><h1>Rock Paper Scissors... Multiplayer!!!</h1></div>';

initApp = function () {
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// User is signed in.
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var uid = user.uid;
			var phoneNumber = user.phoneNumber;
			var providerData = user.providerData;
			user.getIdToken().then(function (accessToken) {
				$("#firebaseui-auth-container").hide();
				document.getElementById('sign-in').innerHTML = signOutBtn;
				document.getElementById('account-details').innerHTML = '<img class="userImage img-rounded" src="' + photoURL + '" alt="User Image">' + displayName;
				$("#signOutBtn").on("click", function () {
					firebase.auth().signOut().then(function () {
						console.log('Signed Out');
					}, function (error) {
						console.error('Sign Out Error', error);
					});
				});
			});
			$("body").addClass("hotBody");
			$("#playArea").html(playArea);
			console.log("User is Signed IN!");
			
		} else {
			// User is signed out.
			document.getElementById('account-details').innerHTML = '';
			document.getElementById('sign-in').innerHTML = '';
			$("#firebaseui-auth-container").show();
			console.log("User is signed out");
		}
	}, function (error) {
		console.log(error);
	});
};

window.addEventListener('load', function () {
	initApp()
});

