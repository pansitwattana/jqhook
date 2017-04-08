var express = require('express')
var router = express.Router()
var firebase = require('firebase')

var MemberStatus = {
    User: 0,
    Market: 1,
    Admin: 2,
}




router.get('/test', function (req, res) {

    var newuser = { "Email": "0kaiyast0@gmail.com", "Password": "123456789", "Name": "MuMu", "LastName": "KiKi", "Type": 0 }

    Register(newuser, res)

})


router.post('/', function (req, res) {

    var newuser = req.body
    console.log("Post Register")
    console.log(newuser)
    Register(newuser, res)

})


function Register(Register_data, res) {
    var newuser = Register_data
    var response = { "response": "success" }
    var isSuccess = true;
    email = newuser.Email
    password = newuser.Password

    Promise.all([
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {

            var errorCode = error.code;
            var errorMessage = error.message;
            response.response = errorCode + " " + errorMessage
            isSuccess = false
        })
    ]).then(function (Snap) {

        console.log("Done")
        delete newuser.Password

        if (isSuccess) {

            var uid = Snap[0].uid
            Promise.all([
                firebase.database().ref().child('Users/' + uid).set(newuser)
            ]).then(function (Snap2) {
                console.log("Firebase save done")
                res.json(response)
            })
        }
        else {

            res.json(response)
        }



    })

}

module.exports = router