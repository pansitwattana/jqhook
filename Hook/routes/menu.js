var express = require('express')
var router = express.Router()
var firebase = require('firebase')

/* GET users listing. */

router.get('/get/:marketname', function (req, res) {

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

router.get('/testaddtag', function (req, res) {
    var menuid = 1
    var tagval = "Rice"

    Addtag(menuid, tagval, res)
})

router.post('/addtag', function (req, res) {
    var menuid = req.body.menuid
    var tagval = req.body.val

    Addtag(menuid, tagval, res)
})

function Addtag(menuid,tagval,res)
{
    var result = { "response": "not found" }

    Promise.all([
        firebase.database().ref().child('Menus/' + menuid).once('value', function (MenuSnapshot) {
            var Menudata = MenuSnapshot.val()
            console.log(Menudata.Tag)
            Menudata.Tag += " " + tagval
            Menudata.response = "success"
            result = Menudata

        })
    ]).then(function (Snap) {

        Promise.all([
            firebase.database().ref().child('Menus/' + menuid).set(result)
        ]).then(function (Snap) {

            console.log("Add Tag Compete")
            console.log(result)
            res.json(result)
        })

    })
}


router.get('/addmenu/test', function (req, res) {

    var Menudata = {
        "Catagory": "Rice",
        "Detail": "ข้าวปลาแซลม่อน",
        "Img": "https://cache.gmo2.sistacafe.com/images/uploads/content_image/image/19237/1437384171-11420840_817527358361780_279257982_n.jpg",
        "Name": "ข้าวปลาแซลม่อน",
        "Price": 59,
        "Store_ID": 5,
        "Tag": ""
    }

    Addmenu(Menudata, res)
})

router.post('/addmenu', function (req, res) {

    var Menudata = req.body

    Addmenu(Menudata, res)
})

function Addmenu(Menudata, res) {

    var result = { "response": "Error can't add new menu" }

    console.log("Add Menu")
    var NewMenuID = 0

    firebase.database().ref().child('Menus').once('value', function (StoreSnapshot) {

        StoreSnapshot.forEach(function (ChildSnapshot) {        

            NewMenuID++;

        })

        Menudata.ID = NewMenuID

        Promise.all([
            firebase.database().ref().child('Menus/' + NewMenuID).set(Menudata)
        ]).then(function (Snap) {

            console.log("Add Compete")
            res.json(Menudata)
        })
    })
}

module.exports = router