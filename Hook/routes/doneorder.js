var express = require('express')
var router = express.Router()
var firebase = require('firebase')

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('Hook Error Please Enter Order ID  ');
})


router.get('/:id', function (req, res) {
    var orderID = req.params.id;

    firebase.database().ref().child('Orders/' + orderID).set({
        Type: "Done"
    });

    
  
})

module.exports = router;