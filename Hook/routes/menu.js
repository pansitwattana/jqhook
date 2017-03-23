var express = require('express')
var router = express.Router()
var firebase = require('firebase')

/* GET users listing. */

router.get('/get/:marketname/', function (req, res) {

    var marketName = req.params.marketname
    var marketID = -1
    var result = {}

    //Find MarketID
    firebase.database().ref().child('Stores').on('value', function (StoresSnapshot) {
        StoresSnapshot.forEach(function (ChildSnapshot) {

            if (ChildSnapshot.key.includes(marketName)) {
                var obj = ChildSnapshot.val()
                marketID = obj.ID


            }


        })

        // Find Menu of Market
        firebase.database().ref().child('Menus').on('value', function (MenuSnapshot) {
            MenuSnapshot.forEach(function (ChildSnapshot) {

                if (ChildSnapshot.val().Store_ID == marketID) {
                    result[ChildSnapshot.key] = ChildSnapshot.val();
                }
            })

            res.json(result)
        })

    })

})

module.exports = router