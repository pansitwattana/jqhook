var express = require('express')
var firebase = require('firebase')
var router = express.Router()

// var write = function writeUserData(userId, name, email, imageUrl) {
//     firebase.database().ref('users/' + userId).set({
//         username: name,
//         email: email,
//         profile_picture : imageUrl
//     });
// }




router.get('/:latlong', function (req, res) {
    var browse_input = req.params.latlong
    var browse_split = browse_input.split(",")
    var lat = browse_split[0]
    var long = browse_split[1]

    var result = {}

    console.log(lat+","+long)

    firebase.database().ref().child('Stores').on('value', function (StoresSnapshot) {
        StoresSnapshot.forEach(function (ChildSnapshot) {
            OrderData = ChildSnapshot.val();
            var tarlat = OrderData.Location.Lat
            var tarlong = OrderData.Location.Long

            OrderData.Location = GetDistant(lat, long, tarlat, tarlong)

            result[ChildSnapshot.key] = OrderData;

           // console.log(Tarlat + "," + Tarlong )
        })

        res.json(result)
    })
})

    function GetDistant(Cenlat, Cenlong, Tarlat, Tarlong)
    {
        
        var distant = Math.sqrt(Math.pow(Cenlat - Tarlat, 2) + Math.pow(Cenlong - Tarlong, 2))
        console.log(distant)
        return distant
    }

module.exports = router