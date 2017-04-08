var express = require('express')
var firebase = require('firebase')
var router = express.Router()

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
        firebase.database().ref().child('Order').once('value')
    ]).then(function (Snap) {

        StoresData = Snap[0].val()
        FeedbackData = Snap[1].val()
        MenusData = Snap[2].val()
        OrderData = Snap[3].val()

        // RecommandeData
        RecommendData = GetRecommend(StoresData)
        PopularData = GetPopular(StoresData)
        FastStoreData = GetPopular(StoresData)


        Result["Recommend"] = RecommendData
        Result["Popular"] = PopularData
        Result["Fast"] = FastStoreData

        console.log(Result)

        res.json(Result)

        })



})

function GetRecommend(StoresData)
{
    var Result = {}

    Result['CMU DormHor6 ข้าวมันไก่'] = StoresData['CMU DormHor6 ข้าวมันไก่']
    Result['Cafe Bear grill'] = StoresData['Cafe Bear grill']
    Result['Yogurt Kung โยเกิร์ตคุง'] = StoresData['Yogurt Kung โยเกิร์ตคุง']


    return Result

}

function GetPopular(StoresData) {

    var Result = {}
    var MaxofShow = 3
    var Found = 0


    for (var StoreKey in StoresData) {
        
        if (StoresData[StoreKey].Rate >= 4 && Found <= MaxofShow) {

            Result[StoreKey] = StoresData[StoreKey]
            Found++
            
        }

    }


    return Result

}

module.exports = router