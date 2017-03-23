var express = require('express')
var firebase = require('firebase')
var router = express.Router()

// var write = function writeUserData(userId, name, email, imageUrl) {
//     firebase.database().ref('users/' + userId).set({
//         username: name,
//         email: email,
//         profile_picture : imageUrl
//     });
// }

/* GET users listing. */
router.get('/', function (req, res) {
    //res.json(searchjson);
    //var db = GetFireDB();
    // var db = firebase.database();
    // db.child("Feedback/1/Detail").on("value", function(snapshot) {
    //     alert(snapshot.val());  // Alerts "San Francisco"
    // });
    // res.end("Test db");
    //res.json(db);
    // var detail 
    

    // var id = firebase.auth().currentUser.uid;
    // write(id, 'admin', 'admin@hook.com', '/google.com');

    // var userId = firebase.auth().currentUser.uid;
    // var read = firebase.database().ref('/users/' + userId).once('value').then(function(snapshot){
    //     username = snapshot.val().username;
    // });
    // console.log(userId);
    // console.log(username);

    //var userId = firebase.auth().currentUser.uid;
	var dbRefObject = firebase.database().ref().child('Stores')
	dbRefObject.once('value').then(function(snapshot){
    	res.json(snapshot.val())
	})
});


router.get('/:name', function (req, res) {
	var searchName = req.params.name

    // //var result = find(searchjson, searchName);
    // function match(element) {
    //     return element.name == searchName;
    // }


    // var storeResults = searchjson.stores.filter(match);

    // var searchResult = { stores: storeResults };

    // res.json(searchResult);

    //------------------------------------------------------------------------
	/*var dbRefObject = firebase.database().ref().child('Stores/' + searchName)
	dbRefObject.once('value').then(function(snapshot){
		res.json(snapshot.val())
    }) */
    //------------------------------------------------------------------------



    //var Result_Json = ' { "Stores" : [ ';
    //var Childnum = 0;

    //firebase.database().ref().child('Stores').on('value', function (snap) {
    //    snap.forEach(function (snap2) {
    //        if (snap2.key.includes(searchName)) {

    //            if (Childnum != 0) {
    //                Result_Json += ",";
    //            }
    //            //Result_Json += snap2.key + "</p>" + JSON.stringify(snap2.val()) + "</p>";  
    //            Result_Json += JSON.stringify(snap2.val());  
    //            Childnum++;          
    //        }
    //    });
    //});

    //Result_Json += ']}';
    //res.send(Result_Json);
    
    firebase.database().ref().child('Stores').on('value', function (snapshot) {
        var result = {}
        snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.key.includes(searchName)) {
                var obj = {}
                result[childSnapshot.key] = childSnapshot.val()
                //obj[childSnapshot.key] = childSnapshot.val()
                //result.push(obj)
            }
        });
        res.json(result)
    });


})

// function GetFireDB()
// {
//     // Set the configuration for your app
//     // TODO: Replace with your project's config object
//     var config = {
//         apiKey: "AIzaSyBW3LXE8QvIvAWmcQLEJEfRu4MMy5-EbFA",
//         authDomain: "hook-f936a.firebaseapp.com",
//         databaseURL: "https://hook-f936a.firebaseio.com",
//         storageBucket: "hook-f936a.appspot.com"
//     };
//     firebase.initializeApp(config);

//     // Get a reference to the database service
//     var database = firebase.database();
//     return database;
// }

module.exports = router