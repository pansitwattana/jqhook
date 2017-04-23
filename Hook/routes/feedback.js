var express = require('express')
var router = express.Router()
var firebase = require('firebase')
var moment = require('moment')

/* GET users listing. */
var FeedbackStatus = {
    UsertoMarket: 0,
    MarkettoUser: 1

}

router.get('/get/:marketid', function (req, res) {

    var marketID = req.params.marketid
    var result = []

    //Find MarketID
    firebase.database().ref().child('Feedbacks').once('value', function (FeedbacksSnapshot) {

       
        FeedbacksSnapshot.forEach(function (ChildSnapshot,Feedbackindex) {

            var FeedbackData = ChildSnapshot.val()
            //console.log(FeedbackData.Receiver + " " + marketID)
            if (FeedbackData.Type == FeedbackStatus.UsertoMarket && FeedbackData.Receiver == marketID)
            { result.push(FeedbackData) }
        })

       
        console.log(result)
        res.json(result)
    })

})

router.get('/add/test', function (req, res) {

    var Feedbackdata = {
        "Detail": "อาหารอร่อยมาก",
        "Rate": 4,
        "Receiver": 4,
        "Sender": "HSjRqk2ClfbaKpQSGzpUgiI1gV52",
        "Subject": "TestAdd",
        "Type": 0
    }

    Add(Feedbackdata, res)
})

router.post('/add', function (req, res) {

    var Feedbackdata = req.body

    Add(Feedbackdata, res)
})

function Add(Feedbackdata, res) {

    var result = { "response": "Error can't add new feedback" }

    console.log("Add Feedback")
    var NewFeedbackID = 0

    firebase.database().ref().child('Feedbacks').once('value', function (FeedbackSnapshot) {

        var SumRate = 0
        var NumberRate = 1

        var NewFeedbackMarketID = Feedbackdata.Receiver
        SumRate += Feedbackdata.Rate
         // Find New ID
        FeedbackSnapshot.forEach(function (ChildSnapshot) {        

            var FeedbackSnapshotVal = ChildSnapshot.val()

            // Find New ID
            NewFeedbackID++;

            //calcurate Sum New Rate of market
            if (FeedbackSnapshotVal.Type == FeedbackStatus.UsertoMarket && FeedbackSnapshotVal.Receiver == NewFeedbackMarketID)
            {
                SumRate += FeedbackSnapshotVal.Rate
                NumberRate++
            }

        })


        Feedbackdata.Date = moment().format('D/M/YYYY')
        Feedbackdata.ID = NewFeedbackID

        if (Feedbackdata.Type == FeedbackStatus.UsertoMarket) {
            //calcurate Avg rate of market
            var AvgRate = SumRate / NumberRate
            if (NumberRate == 0) { AvgRate = 0 }
            console.log(SumRate + " / " + NumberRate + " =  " + AvgRate + " ID " + NewFeedbackMarketID)
            SaveNewfeedUsertoMarket(AvgRate, NewFeedbackMarketID, NewFeedbackID, Feedbackdata, res)
        }
        else
        {
            SaveNewfeedMarkettoUser(NewFeedbackID, Feedbackdata, res)

        }

      
    })
}

function SaveNewfeedUsertoMarket(Avgrate, FeedbackMarketID, NewFeedbackID, Feedbackdata, res) {

       var Storedata = {}
       var Storename = "ABC"
       var CheckFound = false
        firebase.database().ref().child('Stores').once('value', function (StoreSnapshot) {

            StoreSnapshot.forEach(function (ChildSnapshot) {

                if (CheckFound == false) {
                    Storedata = {}
                    Storedata = ChildSnapshot.val()

                    if (Storedata.ID == FeedbackMarketID) {

                        Storedata.Rate = Avgrate
                        Storename = Storedata.Name
                        console.log(Storename)
                        //  console.log(ChildSnapshot.key)
                        console.log(Storedata)
                        CheckFound = true

                    }
                }
       

             

            })
            console.log('Stores/' + Storename)
            Promise.all([
                firebase.database().ref().child('Stores/' + Storename).set(Storedata),
                firebase.database().ref().child('Feedbacks/' + NewFeedbackID).set(Feedbackdata)
            ]).then(function (Snap) {

                console.log("Add Compete")
                res.json(Feedbackdata)
            })

        })

    


     
}

function SaveNewfeedMarkettoUser(NewFeedbackID, Feedbackdata,res) {

    Promise.all([
        firebase.database().ref().child('Feedbacks/' + NewFeedbackID).set(Feedbackdata)
    ]).then(function (Snap) {

        console.log("Add Compete")
        res.json(Feedbackdata)
        })

}

module.exports = router