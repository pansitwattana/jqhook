var express = require('express')
var firebase = require('firebase')
var router = express.Router()
var moment = require('moment')

// var write = function writeUserData(userId, name, email, imageUrl) {
//     firebase.database().ref('users/' + userId).set({
//         username: name,
//         email: email,
//         profile_picture : imageUrl
//     });
// }
var OrderStatus = {
    Wait: 0,
    Done: 1,
    Cancel: 2,
}

router.get('/category/:catagoryname', function (req, res) {
    var CategoryName = req.params.categoryname

    firebase.database().ref().child('Orders').on('value', function (OrderSnapshot) {
        var OrdersData = OrderSnapshot.val()

        firebase.database().ref().child('Stores').on('value', function (snapshot) {

            var result = {}
            snapshot.forEach(function (childSnapshot) {

                var StoresData = childSnapshot.val()


                if (CategoryName == StoresData.Category) {
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

router.get('/:latlong', function (req, res) {

    var browse_input = req.params.latlong
    var browse_split = browse_input.split(",")
    var lat = browse_split[0]
    var long = browse_split[1]

    var result = {}
    var OrdersData = {}

    console.log(lat+","+long)

    firebase.database().ref().child('Orders').on('value', function (OrderSnapshot) {
        OrdersData = OrderSnapshot.val()
        firebase.database().ref().child('Stores').on('value', function (StoresSnapshot) {

            StoresSnapshot.forEach(function (ChildSnapshot) {
                StoreData = ChildSnapshot.val();
                var tarlat = StoreData.Location.Lat
                var tarlong = StoreData.Location.Long

                StoreData.Distant = GetDistant(lat, long, tarlat, tarlong)
                StoreData.Status = GetStoreOpenorClose(StoreData.ID, StoreData)
                StoreData.OrderReport = GetQueueReport(StoreData.ID, OrdersData, moment().format('D/M/YYYY'))   //
                if (StoreData.Distant <= 10)
                { result[ChildSnapshot.key] = StoreData; }

               // console.log(Tarlat + "," + Tarlong )
            })

            try { res.json(result) }
            catch (err)
            { res.json("Network Error") }
        })
    })
})


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

    if (Queue_num != 0) { Queue_AvgTime = Queue_AllTime / Queue_num  }
 
    
    Result.Queue_num = Queue_num
    Result.Queue_AvgTime = Queue_AvgTime

    console.log(Result)

    return Result

}

function GetDistant(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

   
    return earthRadiusKm * c;
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

module.exports = router