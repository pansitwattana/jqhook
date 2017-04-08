var express = require('express')
var router = express.Router()
var firebase = require('firebase')

router.get('/', function (req, res) {

    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log("Sign-out Successful")
       
    }).catch(function (error) {
        // An error happened.
        console.log(error)
    });

    res.send("")


    })


module.exports = router