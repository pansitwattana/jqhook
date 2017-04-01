var express = require('express')
var router = express.Router()
var firebase = require('firebase')


router.get('/:order_id/wait', function (req, res) {

    var order = req.params.order_id
   
    firebase.database().ref("Orders/").once("child_changed", function (data) {
                console.log("data")  
                var queue =  GetQueue(order)         
                res.json(queue)
            });

})

router.get('/get/:marketid/', function (req, res) {


    var marketid
    var path = firebase.database().ref()
    var result = {}

    marketid = parseInt(req.params.marketid)
    if (isNaN(marketid)) { marketid = -1}

    console.log(marketid)

    Promise.all([
        path.child('/Orders').orderByChild("Store_ID").equalTo(marketid).once('value'),
        path.child('/Menus').once('value'),
        path.child('Users').once('value')
    ]).then(function (Snap) {

        var Orders = Snap[0].val()
        var Menus = Snap[1].val()
        var Users = Snap[2].val()

        //console.log(Orders['0']) Key

        // Orders
        try {
                Orders.forEach(function (OrderSnapshot, orderkey) {

                    var uid = Orders[orderkey].Customer_ID
                    var user = Users[uid]

                    Orders[orderkey].Customer_Name = user.Name + " " + user.Lastname
                    delete Orders[orderkey].Customer_ID

                    // Orders

                    Orders[orderkey].MenuList.forEach(function (MenuListSnapshot, menukey) {
                        var menuid = MenuListSnapshot
                        var menu = Menus[menuid]

                        // console.log(menuid)
                        Orders[orderkey].MenuList[menukey] = menu.Name
                    })
                })

                console.log(Orders)
                result = Orders
                res.json(result)
        }
        catch (err)
        {
            res.json(result)
        }

      

    })

})
/*
router.get('/get/:marketid/', function (req, res) {

    //chatsRef.orderByValue(‘user’).equalTo(‘user1’).once(‘value’, function (snap) {

    var marketid = parseInt(req.params.marketid)
    var result = {}

    var path = firebase.database().ref()

   // var OrderRef = path.child('Orders/' + userId)
    //var MenuRef = path.child('/' + userId)

    Promise.all([
    path.child('Orders').orderByChild("Store_ID").equalTo(marketid).once('value')
    ]).then(function (Snap) {

        console.log("Get Order Val")


        // Orders
        for (var i = 0; i < Snap[0].numChildren(); i++) {
            console.log(i)

            console.log("Order_forEach")
            var Order = Snap[0].val()[i]

            //get Customername

            path.child('Users/' + Order.Customer_ID).once('value', function (UserSnapshot) {
                console.log("find user")
                Order.Customer_Name = UserSnapshot.val().Name + " " + UserSnapshot.val().Lastname
                delete Order.Customer_ID

                for (var i = 0; i < Snap[0].numChildren(); i++) {
                    Order.MenuList.forEach(function (MenuListSnapshot, index) {
                        // Find Menuname of Menulist
                        path.child('Menus/' + MenuListSnapshot).once('value', function (MenuSnapshot) {
                            console.log("find menu")
                            Order.MenuList[index] = MenuSnapshot.val().Name
                            // Print menu name

                        })
                    })

                    console.log("Add Result")
                    result[Snap[0].key] = Order

                }

            })

        }
        console.log("Print")
        res.json(result)

    })
       

})

*/
    /*
    path.child('Orders').orderByChild("Store_ID").equalTo(marketid).once('value', function (OrderSnapshot) {


        // Orders
        OrderSnapshot.val().forEach(function (ChildSnapshot) 
        {
            var OrderRef = path.child('Orders/' + ChildSnapshot.key)

            result[OrderSnapshot.key] = OrderSnapshot.val()
        })

       
       
    })
    */



/*
router.get('/get/:marketname/', function (req,   res) {

    var marketName = req.params.marketname
    var marketID = -1
    
    var result = {}

    //Find MarketID
    firebase.database().ref().child('Stores').once('value', function (StoresSnapshot) {

        StoresSnapshot.forEach(function (ChildSnapshot) {
            if (ChildSnapshot.key == marketName) {
                var obj = ChildSnapshot.val()
                marketID = obj.ID

            }

        })

        console.log("stop find market")
    }).then(function () {

        console.log("then find order")

        // Find Order of Market
        firebase.database().ref().child('Orders').once('value', function (OrderSnapshot) {

            console.log("in find order")

            OrderSnapshot.forEach(function (ChildSnapshot) {

                if (ChildSnapshot.val().Store_ID == marketID) {

                    var Obj = ChildSnapshot.val();
                    //result[ChildSnapshot.key] = Obj;

                    // Find Custommer Name
                    try {
                        firebase.database().ref().child('Users/' + Obj.Customer_ID).on('value', function (UserSnapshot) {

                            console.log("find user")
                            Obj.Customer_Name = UserSnapshot.val().Name + " " + UserSnapshot.val().Lastname
                            Obj.MenuList.forEach(function (MenuListSnapshot, index) {

                                try {
                                    // Find Menuname of Menulist
                                    firebase.database().ref().child('Menus/' + MenuListSnapshot).on('value', function (MenuSnapshot) {
                                        console.log("find menu")
                                        Obj.MenuList[index] = MenuSnapshot.val().Name
                                        // Print menu name

                                        console.log(MenuSnapshot.val().Name)

                                        result[ChildSnapshot.key] = Obj;

                                    })
                                }
                                catch (err) {
                                    console.log("Find Menuname of Menulist Error : " + err)
                                }

                            })

                        }).then
                    }
                    catch (err) {
                        console.log("Find Custommer Name Error : " + err)
                    }


                }

                
            })

            console.log("end find order")

        }).then(function () {

            console.log("print")
            try {

                res.json(result)

            }
            catch (err) {
                res.send(" Can't send  (" + err + ")")
            }

            })
         
    })

   

})
*/


function GetQueue(orderID)
{
    var OrderData
    var NewQueue = {}

    // Find Order Data
    try {

        firebase.database().ref().child('Orders/' + orderID).once('value', function (snapshot) {
            OrderData = snapshot.val();
        })

        var marketID = OrderData.Store_ID
        var orderID = OrderData.ID
        var queue = 0;

        firebase.database().ref().child('Orders').once('value', function (OrderSnapshot) {
            OrderSnapshot.forEach(function (ChildSnapshot) {
                OrderData = ChildSnapshot.val();
                if (OrderData.Store_ID == marketID && OrderData.Type == "Undone") {
                    if (OrderData.ID <= orderID) {
                        queue++;
                    }
                }
            })

            console.log("OrderID: " + orderID + "MarketID: " + marketID + "Queue: " + queue)

        })

        NewQueue["ID"] = orderID
        NewQueue["Queue"] = queue
        NewQueue["time"] = 1

    }
    catch (err) {
        console.log("Find Order Data Error : " + err)
    }   

    return NewQueue

}

router.get('/:id/queue', function (req, res) {

    var orderID = req.params.id;

    var  NewQueue = GetQueue(orderID)

    res.json(NewQueue)


})

router.get('/:id/done', function (req, res) {

    var orderID = req.params.id;

    var OrderData
    firebase.database().ref().child('Orders/' + orderID).once('value', function (snapshot) {
        OrderData = snapshot.val();
    })


        try
        {   
            OrderData['Type'] = "Done";
            firebase.database().ref().child('Orders/' + orderID).update(OrderData)
          //  res.send("success")
        }
        catch(err)
        {
           // res.send("not found")
        }
     
    res.send(OrderData)

})

router.get('/:id/cancel', function (req, res) {

    var orderID = req.params.id;

    var OrderData
    firebase.database().ref().child('Orders/' + orderID).once('value', function (snapshot) {
        OrderData = snapshot.val();
    })


    try {
        OrderData['Type'] = "Cancel";
        firebase.database().ref().child('Orders/' + orderID).update(OrderData)
        res.send(OrderData)
    }
    catch (err) {
        res.send("not found")
    }

    res.send(OrderData)

})

router.post('/add', function (req, res) {

    var neworder = req.body
    // var neworder = { ID: 1 ,Comment: 'sok',Data: '22',Customer_ID: 1,Type: 'Undone',Store_ID: 1, MenuList: [0, 1]}
    //{"Comment":"ok","Customer_ID":1,"Date":"22","ID":1,"Store_ID":1,"Type":"Done"}

     /*
    NewOrder["Comment"] =  "Good"
    NewOrder["Customer_ID"] = 1
    NewOrder["Date"] = 1 
    NewOrder["ID"] = 1
    NewOrder["Store_ID"] = 1
    NewOrder["Type"] = "Do"
    */

    var ordernumber = 0
    var checkSet = false

    firebase.database().ref().child('Orders').once('value', function (OrderSnapshot) {

        var OrderData = {}
        var NewQueue = {}


        OrderSnapshot.forEach(function (ChildSnapshot) {

            // check if find new order number
            if (!checkSet)
            {
                ordernumber++               
            }

            //console.log(ordernumber + "," + OrderSnapshot.val().length)

            if (ordernumber == OrderSnapshot.val().length) {

                checkSet = true;

                neworder.ID = ordernumber
                
                firebase.database().ref().child('Orders/' + ordernumber).set(neworder)
                
                NewQueue = GetQueue(ordernumber)

                try {
                    res.json(NewQueue)                   
                }
                catch (err) {
                    res.send(" Can't add neworder (" + err + ")")
                }
              

            }                 
        })

        
    })
     
   
    
})

router.get('/:id', function (req, res) {

    var orderID = req.params.id;

    var OrderData;
    firebase.database().ref().child('Orders/' + orderID).once('value', function (snapshot) {
        OrderData = snapshot.val();
    })

    try
    {
        res.json(OrderData)
    }
    catch (err)
    {
        res.send(" Can't send Orderdata (" + err +")" )
    }
   

})

 


module.exports = router