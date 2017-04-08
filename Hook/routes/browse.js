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

            OrderData.Distant = GetDistant(lat, long, tarlat, tarlong)

            result[ChildSnapshot.key] = OrderData;

           // console.log(Tarlat + "," + Tarlong )
        })

        res.json(result)
    })
})

  //  function GetDistant(Cenlat, Cenlong, Tarlat, Tarlong)

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