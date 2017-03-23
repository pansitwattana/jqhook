var express = require('express')
var router = express.Router()

var order = {
        1112: {
            username: "ball",
            time: 30,
            menu:
            [
                {
                    food: "ricewithegg",
                    price: 40
                },
                {
                    food: "steak",
                    price: 50
                }
            ]
        },
        1113: {
            username: "jj",
            time: 40,
            menu:
            [
                {
                    food: "salmon",
                    price: 200
                },
                {
                    food: "steak",
                    price: 50
                }
            ]
        }
}

/* GET users listing. */
router.get('/', function (req, res) {
	res.json(order)
})

module.exports = router