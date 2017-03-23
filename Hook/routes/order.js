var express = require('express')
var router = express.Router()
var firebase = require('firebase')

/*
var order = {
        1112: {
            username: "ball",
            time: 30,
            menu:
            [
                {
                    food: "ricewithegg",
                    price: 40
                },
                {
                    food: "steak",
                    price: 50
                }
            ]
        },
        1113: {
            username: "jj",
            time: 40,
            menu:
            [
                {
                    food: "salmon",
                    price: 200
                },
                {
                    food: "steak",
                    price: 50
                }
            ]
        }
}
*/


/* GET users listing.
router.get('/', function (req, res) {

    var Tempdata;
    firebase.database().ref().child('Orders/').on('value', function (snapshot) {
        Tempdata = snapshot.val();
    })

    res.json(Tempdata)

})  */

/* GET users listing. 
router.get('/get/:id', function (req, res) {

    var orderID = req.params.id;

    var Tempdata;
    firebase.database().ref().child('Orders/' + orderID).on('value', function (snapshot) {
        Tempdata = snapshot.val();
    })

    res.json(Tempdata)

})*/

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

        // Find Order of Market
        firebase.database().ref().child('Orders').on('value', function (OrderSnapshot) {
            OrderSnapshot.forEach(function (ChildSnapshot) {

                if (ChildSnapshot.val().Store_ID == marketID) {
                    result[ChildSnapshot.key] = ChildSnapshot.val();
                }
            })

            res.json(result)
        })       

    })

   



})

router.get('/:id/done', function (req, res) {

    var orderID = req.params.id;

    var OrderData
    firebase.database().ref().child('Orders/' + orderID).on('value', function (snapshot) {
        OrderData = snapshot.val();
    })


        try
        {   
            OrderData['Type'] = "Done";
            firebase.database().ref().child('Orders/' + orderID).update(OrderData)
            res.send("success")
        }
        catch(err)
        {
            res.send("not found")
        }
     



    

    res.send(OrderData)

})
/*
router.get('/', function (req, res) {

    var username = req.query.username
    res.send(username)
})
*/



router.post('/', function (req, res) {

    var email = req.body.email

    res.send(email)
})

router.post('/set', function (req, res) {
    //{"Comment":"ok","Customer_ID":1,"Date":"22","ID":1,"Store_ID":1,"Type":"Done"}
    var NewOrder = {}
    NewOrder["Comment"] =  "Good"
    NewOrder["Customer_ID"] = 1
    NewOrder["Date"] = 1 
    NewOrder["ID"] = 1
    NewOrder["Store_ID"] = 1
    NewOrder["Type"] = "Do"

    firebase.database().child('Orders').setValue(NewOrder);

    res.json(NewOrder)
})



router.get('/:id', function (req, res) {

    var orderID = req.params.id;
    var func = req.params.func;
    var val = req.params.val;

    var OrderData;
    firebase.database().ref().child('Orders/' + orderID).on('value', function (snapshot) {
        OrderData = snapshot.val();
    })

    OrderData[func] = val;

    firebase.database().ref().child('Orders/' + orderID).update(OrderData)
    res.send("success")

})

module.exports = router