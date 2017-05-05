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

// recommand
// poppula
// FastStore

    var Result = {}

    var RecommendData = {}
    var PopularData = {}
    var FastStoreData = {}

    var StoresData
    var FeedbackData
    var MenusData
    var OrderData

    Promise.all([
        firebase.database().ref().child('Stores').once('value'),
        firebase.database().ref().child('Feedback').once('value'),
        firebase.database().ref().child('Menus').once('value'),
        firebase.database().ref().child('Orders').once('value')
    ]).then(function (Snap) {

        StoresData = Snap[0].val()
        FeedbackData = Snap[1].val()
        MenusData = Snap[2].val()
        OrderData = Snap[3].val()

        // RecommandeData
        RecommendData = GetRecommend(StoresData, OrderData)
        PopularData = GetPopular(StoresData, OrderData)
        FastStoreData = GetPopular(StoresData, OrderData)


        Result["Recommend"] = RecommendData
        Result["Popular"] = PopularData
        Result["Fast"] = FastStoreData

        console.log(Result)

        try { res.json(Result) }
        catch (err)
        { res.json("Network Error") }
        res.json(Result)

        })



})

function GetRecommend(StoresData, OrdersData)
{
    var Result = {}
    var Date = moment().format('D/M/YYYY')

    Result['CMU DormHor6 ข้าวมันไก่'] = StoresData['CMU DormHor6 ข้าวมันไก่']
    Result['CMU DormHor6 ข้าวมันไก่'].OrderReport = GetQueueReport(Result['CMU DormHor6 ข้าวมันไก่'].Store_ID, OrdersData, Date)
    Result['CMU DormHor6 ข้าวมันไก่'].Status = GetStoreOpenorClose(Result['CMU DormHor6 ข้าวมันไก่'].Store_ID, Result['CMU DormHor6 ข้าวมันไก่'])

    Result['Cafe Bear grill'] = StoresData['Cafe Bear grill']
    Result['Cafe Bear grill'].OrderReport = GetQueueReport(Result['Cafe Bear grill'].Store_ID, OrdersData, Date)
    Result['Cafe Bear grill'].Status = GetStoreOpenorClose(Result['Cafe Bear grill'].Store_ID, Result['Cafe Bear grill'])

    Result['Yogurt Kung โยเกิร์ตคุง'] = StoresData['Yogurt Kung โยเกิร์ตคุง']
    Result['Yogurt Kung โยเกิร์ตคุง'].OrderReport = GetQueueReport(Result['Yogurt Kung โยเกิร์ตคุง'].Store_ID, OrdersData, Date)
    Result['Yogurt Kung โยเกิร์ตคุง'].Status = GetStoreOpenorClose(Result['Yogurt Kung โยเกิร์ตคุง'].Store_ID, Result['Yogurt Kung โยเกิร์ตคุง'])

    return Result

}

function GetPopular(StoresData, OrdersData) {

    var Result = {}
    var MaxofShow = 6
    var Found = 1

    var Date = moment().format('D/M/YYYY')


    for (var StoreKey in StoresData) {
        
        if (StoresData[StoreKey].Rate >= 4 && Found <= MaxofShow) {

            Result[StoreKey] = StoresData[StoreKey]

            Result[StoreKey].OrderReport = GetQueueReport(Result[StoreKey].ID, OrdersData, Date)
            Result[StoreKey].Status = GetStoreOpenorClose(Result[StoreKey].ID, Result[StoreKey])
            Found++
            
        }

    }


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