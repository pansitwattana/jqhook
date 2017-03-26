var express = require('express')
var router = express.Router()
var firebase = require('firebase')


router.get('/:username&:password', function (req,   res) {

    var username = req.params.username
    var password = req.params.password

    console.log(username + "," + password)

    firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {

        res.error = error


        


    })

    var result = {}
    firebase.database().ref().child('Users').on('value', function (UserSnapshot) {


        UserSnapshot.forEach(function (ChildSnapshot) {
            console.log(ChildSnapshot.val().Email + "sss")
            if (ChildSnapshot.val().Email == username) {
                
                result[ChildSnapshot.key] = ChildSnapshot.val()

            }
        })

    })

    res.json(result)


    })

  




module.exports = router