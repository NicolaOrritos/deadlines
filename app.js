
var deadlines = require("./routes/deadlines");
var express = require("express");
var app = express();


app.configure(function()
{
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
});


app.post("/deadlines/all", deadlines.all);
app.post("/deadlines/save", deadlines.save);
app.get("/deadlines/del", deadlines.del);


app.listen(3000);
console.log('Listening on port 3000');
