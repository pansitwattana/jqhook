var express = require('express')
var firebase = require('firebase')
var router = express.Router()
var moment = require('moment')

var OrderStatus = {
    Wait: 0,
    Done: 1,
    Cancel: 2,
}
router.get('/', function (req, res) {
    
    firebase.database().ref().child('Orders').on('value', function (OrderSnapshot) {
        OrdersData = OrderSnapshot.val()
        firebase.database().ref().child('Stores').on('value', function (snapshot) {
            var result = {}
            snapshot.forEach(function (childSnapshot) {

                var marketname = childSnapshot.key.toLowerCase();
   
                    var StoreData = childSnapshot.val()
                    StoreData.Status = GetStoreOpenorClose(StoreData.ID, StoreData)
                    StoreData.OrderReport = GetQueueReport(StoreData.ID, OrdersData, moment().format('D/M/YYYY'))  //
                    result[childSnapshot.key] = StoreData
                    //obj[childSnapshot.key] = childSnapshot.val()
                    //result.push(obj)
                
            })

            try { res.json(result) }
            catch (err)
            { res.json("Network Error") }

        })
    })
});

router.get('/:name', function (req, res) {
	var searchName = req.params.name

    firebase.database().ref().child('Orders').on('value', function (OrderSnapshot) {
        OrdersData = OrderSnapshot.val()
        firebase.database().ref().child('Stores').on('value', function (snapshot) {
            var result = {}
            snapshot.forEach(function (childSnapshot) {

                var marketname = childSnapshot.key.toLowerCase();
                if (marketname.includes(searchName.toLowerCase()) ) {
                    var StoreData = childSnapshot.val()
                    StoreData.Status = GetStoreOpenorClose(StoreData.ID, StoreData)
                    StoreData.OrderReport = GetQueueReport(StoreData.ID, OrdersData, moment().format('D/M/YYYY'))  //
                    result[childSnapshot.key] = StoreData
                    //obj[childSnapshot.key] = childSnapshot.val()
                    //result.push(obj)
                }
            })


            try { res.json(result) }
            catch (err)
            { res.json("Network Error") }


        })
    })

})

function GetQueueReport(StoreID, OrdersData, Date) {
    var Result = { "Queue_num": 0, "Queue_AvgTime": 0 }

    var Queue_num = 0
    var Queue_AllTime = 0.00
    var Queue_AvgTime = 0.00

    // Count Queue
    OrdersData.forEach(function (OrderSnapshot, MenuListkey) {



        //console.log(OrderSnapshot.Store_ID)
        if (OrderSnapshot.Store_ID == StoreID && OrderSnapshot.Date == Date && OrderSnapshot.Status == OrderStatus.Done) {
            Queue_num++
            Queue_AllTime += OrderSnapshot.OrderTime
        }

    })

    if (Queue_num != 0) { Queue_AvgTime = Queue_AllTime / Queue_num }


    Result.Queue_num = Queue_num
    Result.Queue_AvgTime = Queue_AvgTime

    console.log(Result)

    return Result

}

function GetStoreOpenorClose(StoreID, StoresData) {
    var Result = "Open"
    var Timenow = moment().format('H:m:s')

    var OpenTime = StoresData.Open + ":0"
    var CloseTime = StoresData.Close + ":0"

    var OpenTime_arr = OpenTime.split(":");
    var CloseTime_arr = OpenTime.split(":");
    var Timenow_arr = OpenTime.split(":");

    if ((Timenow_arr[0] >= OpenTime_arr[0] && Timenow_arr[1] >= OpenTime_arr[1]) && (Timenow_arr[0] <= CloseTime_arr[0] && Timenow_arr[1] <= CloseTime_arr[1]))
    { Result = "Open" }
    else
    { Result = "Close" }

    return Result
}




module.exports = router