var express = require('express')
var router = express.Router()
var firebase = require('firebase')

/*
router.get('/:username&:password', function (req,   res) {

    var result = {}
    var username = req.params.username
    var password = req.params.password
*/
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