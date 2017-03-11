var express = require('express');
var firebase = require("firebase");
var router = express.Router();

var searchjson = {
    stores : [
        {
            name: 'tokai',
            img: 'https://th.openrice.com/userphoto/Article/0/V/0006BBF9E616E90551D87Dj.jpg',
            detail: 'detail',
            open: true,
            coordinates: {
                lat: 37.330576,
                long: -122.029739
            }
        },
        {
            name: 'hor5',
            img: 'http://cmlive.in.th/home/wp-content/uploads/2013/01/DSC_4262.jpg',
            detail: 'up2u',
            open: false,
            coordinates: {
                lat: 37.330576,
                long: -122.029739
            }
        }
    ]
}

/* GET users listing. */
router.get('/', function (req, res) {

    //var db = GetFireDB();
    res.json(searchjson);
    //res.json(db);
});


router.get('/:name', function (req, res) {
    var searchName = req.params.name;

    //var result = find(searchjson, searchName);
    function match(element) {
        return element.name == searchName;
    }


    var storeResults = searchjson.stores.filter(match);

    var searchResult = { stores: storeResults };

    res.json(searchResult);
});

//function GetFireDB()
//{
//    // Set the configuration for your app
//    // TODO: Replace with your project's config object
//    var config = {
//        apiKey: "AIzaSyBW3LXE8QvIvAWmcQLEJEfRu4MMy5-EbFA",
//        authDomain: "hook-f936a.firebaseapp.com",
//        databaseURL: "https://hook-f936a.firebaseio.com",
//        storageBucket: "hook-f936a.appspot.com"
//    };
//    firebase.initializeApp(config);

//    // Get a reference to the database service
//    var database = firebase.database();
//    return database;
//}

module.exports = router;