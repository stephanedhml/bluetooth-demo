
//Install express server
const cors = require('cors'); //<-- required installing 'cors' (npm i cors --save)
const express = require('express');
const path = require('path');
const app = express();

app.options('*', cors())

// var whitelist = ['https://bluetooth-demo-app.herokuapp.com', 'https://ec2-35-172-115-4.compute-1.amazonaws.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
//
// app.get('/*', cors(corsOptions), function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for a whitelisted domain.'})
// })

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/bluetooth-demo'));
app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname+'/dist/bluetooth-demo/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
