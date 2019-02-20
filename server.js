
//Install express server
const cors = require('cors'); //<-- required installing 'cors' (npm i cors --save)
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/bluetooth-demo'));
app.use(cors()); //<-- That`s it, no more code needed!
app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   next();
});

app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname+'/dist/bluetooth-demo/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
