var firebase = require('firebase');

app = firebase.initializeApp({
    apiKey: "AIzaSyBW3LXE8QvIvAWmcQLEJEfRu4MMy5-EbFA",
    authDomain: "hook-f936a.firebaseapp.com",
    databaseURL: "https://hook-f936a.firebaseio.com",
    storageBucket: "hook-f936a.appspot.com"
});

firebase.auth().signInWithEmailAndPassword('admin@hook.com', '123456789').catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode)
});

module.exports = app;