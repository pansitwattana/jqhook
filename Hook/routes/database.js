var firebase = require('firebase')

var app = firebase

/*
var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
var authData = ref.getAuth();
*/

app.initializeApp({
	apiKey: 'AIzaSyBW3LXE8QvIvAWmcQLEJEfRu4MMy5-EbFA',
	authDomain: 'hook-f936a.firebaseapp.com',
	databaseURL: 'https://hook-f936a.firebaseio.com',
	storageBucket: 'hook-f936a.appspot.com'
})



app.auth().signInWithEmailAndPassword('admin@hook.com', '123456789').catch(function(error){
	if (error) throw error
    //console.log(errorCode)
})



firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        console.log("Signed in Success")
        console.log("Welcome " + user.email)
    } 
})

module.exports = app