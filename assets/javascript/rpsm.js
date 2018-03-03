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
	signInSuccessUrl: '<url-to-redirect-to-on-success>',
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