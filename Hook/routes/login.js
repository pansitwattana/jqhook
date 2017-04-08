var express = require('express')
var router = express.Router()
var firebase = require('firebase')

/*
router.get('/:username&:password', function (req,   res) {

    var result = {}
    var username = req.params.username
    var password = req.params.password
*/


router.post('/', function (req, res) {

    var Userdata = {}
    var username = req.body.username
    var password = req.body.password
    //var loginerror = false

    console.log("req.body")
    console.log(req.body)

    console.log(username + "," + password)

        Promise.all([

            firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {

                console.log("Sign in error")
                console.log(error)
                res.error = error
             //   loginerror = true

            })

        ]).then(function (Snap) {
            console.log("Sign in done")
            var Logindata = Snap[0]

           if (Logindata) {
               var uid = Logindata.uid
                firebase.database().ref().child('Users/' + uid).once('value', function (user) {

                    Userdata = user.val()
                    Userdata = user.val()
                    console.log(Userdata)
                    res.json(Userdata)
                })
            }
            else {
                res.json(Userdata)
            }

        })

   
    })


router.get('/admin_hook', function (req, res) {
    var Userdata = {}
    var username = "admin@hook.com"
    var password = "123456789"
    //var loginerror = false

    console.log("req.body")
    console.log(req.body)

    console.log(username + "," + password)

    Promise.all([

        firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {

            console.log("Sign in error")
            console.log(error)
            res.error = error
            //   loginerror = true

        })

    ]).then(function (Snap) {
        console.log("Sign in done")
        var Logindata = Snap[0]

        if (Logindata) {
            var uid = Logindata.uid
            firebase.database().ref().child('Users/' + uid).once('value', function (user) {

                Userdata = user.val()
                console.log(Userdata)
                res.json(Userdata)
            })
        }
        else {
            res.json(Userdata)
        }

    })

})

module.exports = router