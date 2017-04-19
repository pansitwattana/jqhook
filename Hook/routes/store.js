var express = require('express')
var router = express.Router()
var firebase = require('firebase')

/* GET users listing. */

function AddStore(Storedata, res)
{
    console.log("Add Store")
    var NewStoreID = 0

    firebase.database().ref().child('Stores').once('value', function (StoreSnapshot) {



        StoreSnapshot.forEach(function (ChildSnapshot) {
            console.log("Find id Store")
           
            NewStoreID++;
         
        })

        Storedata.ID = NewStoreID
        var storename = Storedata.Name

        Promise.all([
            firebase.database().ref().child('Stores/' + storename).set(Storedata)
        ]).then(function (Snap) {

            console.log("Add Compete")
            res.json(Storedata)
        })
    })
}

router.get('/add/test', function (req, res) {

    var newstore = {
        "ID": -1, "Name": "TestMarket", "Img": "abc.img", "Thumnail": "abc.img", "Address": "12345"
        , "Owner_ID": "HSjRqk2ClfbaKpQSGzpUgiI1gV52", "Open": "True", "Rate": 0, "Location": { "lat" : 1.2442, "long" : 10.224 }
    }


    AddStore(newstore, res)

})

router.post('/add', function (req, res) {

    var newstore = req.body
    AddStore(newstore, res)

})

router.get('/:storeid/open', function (req, res) {


})

router.get('/:storeid/close', function (req, res) {


})

module.exports = router