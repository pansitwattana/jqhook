var express = require('express')
var router = express.Router()
var firebase = require('firebase')
var moment = require('moment')

var OrderStatus  = {
    Wait: 0,
    Done: 1,
    Cancel: 2,
}

router.get('/:order_id/wait', function (req, res) {

    var order = req.params.order_id

    Promise.all([
        firebase.database().ref("Orders/" + order).once("value")
    ]).then(function (Snap) {
        var OrderData = Snap[0].val()
        if (OrderData.Status == OrderStatus.Wait) {

            firebase.database().ref("Orders").once("child_changed", function (data) {

                GetQueue(res, order)

            });

        } else
        {
            GetQueue(res, order)
        }

     })


})

router.get('/get/:marketid/', function (req, res) {


    var marketid
    var path = firebase.database().ref()
    var result = {}

    marketid = parseInt(req.params.marketid)
    if (isNaN(marketid)) { marketid = -1}

    console.log(marketid)

    Promise.all([
        path.child('/Orders').once('value'),
        path.child('/Menus').once('value')
    ]).then(function (Snap) {

        var Orders = Snap[0].val()
        var Menus = Snap[1].val()

        console.log(Orders)
        // Orders

        
    try {


        Orders.forEach(function (OrderSnapshot, orderkey) {

            
            if (Orders[orderkey].Store_ID == marketid) {
                // Orders
               // console.log(Orders[orderkey].Store_ID + " = " + marketid)

                Orders[orderkey].MenuList.forEach(function (MenuListSnapshot, menukey) {
                    var menuid = MenuListSnapshot
                    var menu = Menus[menuid]

                    // console.log(menuid)
                    Orders[orderkey].MenuList[menukey] = menu.Name



                })

            } else
            {
                delete Orders[orderkey]
            }
                
                })

             

                // remove null
                Orders = Orders.filter(function (x) {
                    return (x !== (null || 'null' || ''));
                });

                console.log(Orders)
                result = Orders
                res.json(result)

       }
        catch (err)
    {
         
 

         for (var i in Orders)
         {
             console.log(i)
             result = Orders[i];
         }

       
            res.json(result)
        }
    
     

    })

})

function GetQueue(res, orderid)
{


    var OrderData
    var NewQueue = {}
    var queue = 0
    var status = 0

    var marketID

    // Find Order Data
   // try {

        Promise.all([
            firebase.database().ref().child('/Orders').once('value')
        ]).then(function (Snap) {

            OrderData = Snap[0].val()
            marketID = OrderData[orderid].Store_ID
            status = OrderData[orderid].Status

            OrderData.forEach(function (OrderSnapshot, orderindex) {

                var Snap_store_id = OrderData[orderindex].Store_ID
                var Snap_type = OrderData[orderindex].Status
                var Snap_id = OrderData[orderindex].ID
              

               // console.log(Snap_store_id + " " + Snap_type)

                if (Snap_store_id == marketID && Snap_type == OrderStatus.Wait) {
                    if( Snap_id <= orderid ) {
                        queue++;
                    }
                }





            })

            NewQueue["ID"] = parseInt(orderid)
            NewQueue["Queue"] = queue
            NewQueue["Time"] = 1
            NewQueue["Status"] = status

            console.log("OrderID: " + orderid + " MarketID: " + marketID + " Queue: " + queue + " Status: " + status)

            res.json(NewQueue)

            })
/*
        , function (snapshot) {
            OrderData = snapshot.val();
        })

        
        var orderID = OrderData.ID
        

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

     

    }
    catch (err) {
        console.log("Find Order Data Error : " + err)
    }   
*/



}

router.get('/:id/queue', function (req, res) {

    var orderID = req.params.id;
    GetQueue(res, orderID)
   


})

router.get('/:id/done', function (req, res) {

    var orderID = req.params.id;

    var OrderData

    Promise.all([

        firebase.database().ref().child('Orders/' + orderID).once('value', function (snapshot) {
            OrderData = snapshot.val();
        })
    ]).then(function (Snap) {

        OrderData.Status = OrderStatus.Done
        OrderData.StopTime = moment().format('H:m:s')
        OrderData.OrderTime = DiffTime(OrderData.StartTime, OrderData.StopTime)
        firebase.database().ref().child('Orders/' + orderID).update(OrderData)

        OrderData.response = "Success"

        res.send(OrderData)

    })

      
     
 

})

function DiffTime(StartTime, StopTime)
{
    // unit is Sec
    


    var StartTime_Arr = StartTime.split(":");
    var StartTime = 0.00
     StartTime = (StartTime_Arr[0] * 60) + (StartTime_Arr[1]) + (StartTime_Arr[2] / 60)
     var StopTime_Arr = StopTime.split(":");
     var StopTime = 0.00
     StopTime = (StopTime_Arr[0] * 60) + (StopTime_Arr[1]) + (StopTime_Arr[2] / 60)
    console.log(StopTime + " " + StartTime + " = " + ( StopTime - StartTime ))
    return (StopTime - StartTime)
}

router.get('/:id/cancel', function (req, res) {

    var orderID = req.params.id;

    var OrderData

    Promise.all([
    firebase.database().ref().child('Orders/' + orderID).once('value', function (snapshot) {
        OrderData = snapshot.val();
    })
    ]).then(function (Snap) {

        try {
            OrderData['Status'] = OrderStatus.Cancel;
            firebase.database().ref().child('Orders/' + orderID).update(OrderData)

            OrderData.response = "Success"
        }
        catch (err) {
            res.send("not found")

            OrderData.response = "Not Found"
        }

        res.send(OrderData)

    })


})

router.get('/add/test', function (req, res) {
     var neworder = { "Name": "Gai", "LastName": "Lowvapong", "Comment": "-", "Status": 0, "Store_ID": 1, "MenuList": [0, 1] }
     AddOrder(neworder,res)
})

router.post('/add', function (req, res) {

    var neworder = req.body
    AddOrder(neworder, res)

})

function AddOrder(neworder, res)
{
    console.log("Add Order")
    var NewQueue = {}
    var ordernumber = 0
    var checkSet = false

    firebase.database().ref().child('Orders').once('value', function (OrderSnapshot) {

        OrderSnapshot.forEach(function (ChildSnapshot) {

            // check if find new order number
            if (!checkSet) {
                ordernumber++
            }

            //console.log(ordernumber + "," + OrderSnapshot.val().length)

            if (ordernumber == OrderSnapshot.val().length) {

                checkSet = true;

                neworder.ID = ordernumber
                neworder.Date = moment().format('D/M/YYYY')
                neworder.StartTime = moment().format('H:m:s')
                neworder.StopTime = 0
                neworder.OrderTime = 0

                Promise.all([
                    firebase.database().ref().child('Orders/' + ordernumber).set(neworder)
                ]).then(function (Snap) {

                    console.log("Add Compete")
                    NewQueue = GetQueue(res, ordernumber)
                })



            }
        })


    })


}



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