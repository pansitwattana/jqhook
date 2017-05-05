var express = require('express')
var router = express.Router()
var firebase = require('firebase')

var MemberStatus = {
    User: 0,
    Market: 1,
    Admin: 2,
}

/*
router.get('/:username&:password', function (req,   res) {

    var result = {}
    var username = req.params.username
    var password = req.params.password
*/


router.post('/user', function (req, res) {

    var username = req.body.username
    var password = req.body.password
    //var loginerror = false

    Login(username, password, MemberStatus.User, res)

   
    })

router.post('/manager', function (req, res) {

    var username = req.body.username
    var password = req.body.password
    //var loginerror = false

    Login(username, password, MemberStatus.Market, res)


})

router.get('/admin_hook', function (req, res) {
  
    var username = "admin@hook.com"
    var password = "123456789"
    //var loginerror = false

    Login(username, password, MemberStatus.Admin, res)
})



function Login(username, password,usertype, res)
{
    var Userdata = { "response": "success" }

    console.log(username + "," + password)

    Promise.all([

        firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {

            console.log("Sign in error")
            console.log(error)
            Userdata.response = error

        })

    ]).then(function (Snap) {
        console.log("Sign in done")
        var Logindata = Snap[0]

        if (Logindata) {
            var uid = Logindata.uid
            firebase.database().ref().child('Users/' + uid).once('value', function (user) {

                Userdata = user.val()
                Userdata.ID = user.key
                console.log(Userdata.Type + "  " + usertype)

                if (Userdata.Type == usertype) {
                    // if user is market store
                    if (Userdata.Type == MemberStatus.Market) {

                        firebase.database().ref().child('Stores').once('value', function (StoreSnapshot) {

                            StoreSnapshot.forEach(function (ChildSnapshot) {
                                var StoreData = ChildSnapshot.val()
                                if (user.key == StoreData.Owner_ID) {
                                    Userdata.Store = StoreData

                                }
                            })

                        }).then(function (Snap) {
                            console.log(Userdata)

                            try { res.json(Userdata) }
                            catch (err)
                            { res.json("Network Error") }

                        })

                    }
                    else {  // normal user
                        console.log(Userdata)

                        try { res.json(Userdata) }
                        catch (err)
                        { res.json("Network Error") }

                    }
                } else  // error login type
                {
                     Userdata = { "response": "Login fail user not found" }
                     console.log(Userdata)

                     try { res.json(Userdata) }
                     catch (err)
                     { res.json("Network Error") }

                }

            })
        }
        else {

            try { res.json(Userdata) }
            catch (err)
            { res.json("Network Error") }
          
        }

        })

}


module.exports = router