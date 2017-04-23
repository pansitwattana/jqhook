var express = require('express')
var router = express.Router()
var firebase = require('firebase')
var moment = require('moment');

var OrderStatus = {
    Wait: 0,
    Done: 1,
    Cancel: 2,
}

/* Add Store */

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

/* End Add Store */

/* Store Report */

router.get('/:storename/getincome/:day/:month/:year', function (req, res) {

    var Storename = req.params.storename;
    var Date = req.params.day + "/" + req.params.month + "/" + req.params.year;
    
    Getincome(Storename, Date , res)

})

router.get('/:storename/getincome/all', function (req, res) {

    var Storename = req.params.storename;
    var Date = "all";

    Getincome(Storename, Date, res)

})

function Getincome(Storename, Date, res)
{
       
    var Result = { "Income": 0 }
    Promise.all([
        firebase.database().ref().child('Stores/' + Storename).once('value'),
        firebase.database().ref().child('Menus/').once('value'),
        firebase.database().ref().child('Orders/').once('value')
    ]).then(function (Snap) {

        var StoreData = Snap[0].val()
        var Storeid = StoreData.ID

        var MenuDatas = Snap[1].val()
        var OrderDatas = Snap[2].val()


        var income = 0


        // find order in the store
        OrderDatas.forEach(function (OrderSnapshot, orderkey) {

            //console.log(Storeid + " " + OrderSnapshot.ID)
            if (Date == "all") {
                if (OrderSnapshot.Store_ID == Storeid) {
                    income += CalSumMenuListPrice(OrderSnapshot, MenuDatas)
                }
            } else { 
                
                
                if (OrderSnapshot.Store_ID == Storeid && OrderSnapshot.Date == Date ) {
                    income += CalSumMenuListPrice(OrderSnapshot, MenuDatas)
                }
            }

        })
        Result.Income = income

        console.log(Result)
        res.json(Result)
        })

}

// Cal all menu
function CalSumMenuListPrice(OrderSnapshot, MenuDatas ) {
    var SumMenuListincome = 0

    OrderSnapshot.MenuList.forEach(function (MenuListSnapshot, MenuListkey) {
        SumMenuListincome += MenuDatas[MenuListkey].Price
    })

    return SumMenuListincome
}



router.get('/:storename/getsummary/', function (req, res) {

    var Result = {}
    var Storename = req.params.storename;
    var Date = moment().format('D/M/YYYY');

    Promise.all([
        firebase.database().ref().child('Stores/' + Storename).once('value'),
        firebase.database().ref().child('Menus/').once('value'),
        firebase.database().ref().child('Orders/').once('value')
    ]).then(function (Snap) {

        var StoreData = Snap[0].val()
        var StoreID = StoreData.ID

        var MenusData = Snap[1].val()
        var OrdersData = Snap[2].val()

        var OrderReport = GetOrderReport(StoreID, MenusData, OrdersData, Date)
        var QueueReport = GetQueueReport(StoreID,OrdersData, Date)

        Result.OrderReport = OrderReport
        Result.QueueReport = QueueReport

        res.json(Result)
    })

})

function GetOrderReport(StoreID, MenusData, OrdersData, Date)
{
    var Result = { "Income": 0 }
    var MenuReport = {}
    var Sumincome = 0

    OrdersData.forEach(function (OrderSnapshot, orderkey) {

        if (OrderSnapshot.Store_ID == StoreID && OrderSnapshot.Date == Date) {
            Sumincome += CalSumMenuListPrice(OrderSnapshot, MenusData, MenuReport)
            MenuReport = GetMenuReport(OrderSnapshot, MenusData, MenuReport)
        }
    })

    Result.Income = Sumincome
    Result.MenuReport = MenuReport

    return Result

}

// Count and Sum Menulist To Report
function GetMenuReport(OrderSnapshot, MenuDatas, MenuReport) {


    OrderSnapshot.MenuList.forEach(function (MenuListSnapshot, MenuListkey) {

        // Key of Menu
        var MenuKey = MenuListSnapshot
        if (MenuReport[MenuKey] == null)
        {
            console.log("Null")
            MenuReport[MenuKey] = { "Count": 0, "Price"  : 0 , "Name"  : MenuDatas[MenuListkey].Name }

            console.log(MenuReport[MenuKey])

        }
        MenuReport[MenuKey].Count += 1
    })

    return MenuReport
}

function GetQueueReport(StoreID, OrdersData, Date)
{
    var Result = { "Queue_num": 0, "Queue_AvgTime": 0 }

    var Queue_num = 0
    var Queue_AllTime = 0.00
    var Queue_AvgTime = 0.00

    // Count Queue
    OrdersData.forEach(function (OrderSnapshot, MenuListkey) {



        //console.log(OrderSnapshot.Store_ID)
        if (OrderSnapshot.Store_ID == StoreID && OrderSnapshot.Date == Date)
        {
            Queue_num++
            Queue_AllTime += OrderSnapshot.OrderTime
        }

    })

    Queue_AvgTime = Queue_AllTime / Queue_num

    Result.Queue_num = Queue_num
    Result.Queue_AvgTime = Queue_AvgTime

    console.log(Result)

    return Result

}

module.exports = router