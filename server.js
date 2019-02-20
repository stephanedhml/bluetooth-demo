
//Install express server
const cors = require('cors'); //<-- required installing 'cors' (npm i cors --save)
const express = require('express');
const path = require('path');

const app = express();


app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "*");
   next();
});
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/bluetooth-demo'));
app.use(corscors({
  'allowedHeaders': '*',
  'exposedHeaders': '*',
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
})); //<-- That`s it, no more code needed!
app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname+'/dist/bluetooth-demo/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
