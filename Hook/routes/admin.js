var express = require('express')
var router = express.Router()
var firebase = require('firebase')

/* GET users listing. */
router.get('/', function (req, res) {
	res.send('respond with a resource')
})

router.get('/addAttb/:Tablename&:Attbname&:Attbval', function (req, res) {

    var tablename = req.params.Tablename;
    var attbname = req.params.Attbname;
    var attbval = req.params.Attbval;

    var Snapresult = {}
    Promise.all([

        firebase.database().ref().child(tablename).once('value')

    ]).then(function (Snap) {

        var Snapresult = Snap[0].val()
      //  console.log(Snapresult)
        if (Snapresult) {

            Snap[0].forEach(function (Snapshot) {

                Snapresult[Snapshot.key][attbname] = attbval


            })

            console.log(Snapresult)

            firebase.database().ref().child(tablename).set(Snapresult).then(function (Snap) {
                res.json(Snapresult)
            })

        }
        else
        {
            res.json(Snapresult)
        }




        })

})

router.get('/removeAttb/:Tablename&:Attbname', function (req, res) {

    var tablename = req.params.Tablename;
    var attbname = req.params.Attbname;

    var Snapresult = {}
    Promise.all([

        firebase.database().ref().child(tablename).once('value')

    ]).then(function (Snap) {

        var Snapresult = Snap[0].val()
        //  console.log(Snapresult)
        if (Snapresult) {

            Snap[0].forEach(function (Snapshot) {

                delete Snapresult[Snapshot.key][attbname]


            })

            console.log(Snapresult)

            firebase.database().ref().child(tablename).set(Snapresult).then(function (Snap) {
                res.json(Snapresult)
            })

        }
        else {
            res.json(Snapresult)
        }




    })

})

module.exports = router