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


initApp = function() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var uid = user.uid;
			var phoneNumber = user.phoneNumber;
			var providerData = user.providerData;
			user.getIdToken().then(function(accessToken) {
				document.getElementById('firebaseui-auth-container').innerHTML = '';
				document.getElementById('sign-in-status').textContent = 'Signed in';
				document.getElementById('sign-in').textContent = 'Sign out';
				document.getElementById('account-details').textContent = JSON.stringify({
					displayName: displayName,
					email: email,
					emailVerified: emailVerified,
					phoneNumber: phoneNumber,
					photoURL: photoURL,
					uid: uid,
					accessToken: accessToken,
					providerData: providerData
				}, null, '  ');
			});
		} else {
			// User is signed out.
			document.getElementById('sign-in-status').textContent = 'Signed out';
			document.getElementById('sign-in').textContent = 'Sign in';
			document.getElementById('account-details').textContent = 'null';
		}
	}, function(error) {
		console.log(error);
	});
};

window.addEventListener('load', function() {
	initApp()
});