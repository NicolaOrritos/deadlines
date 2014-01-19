
var deadlines = require("./routes/deadlines");
var express = require("express");
var app = express();


app.configure(function()
{
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
});


app.get ("/deadlines/all",  deadlines.all);
app.post("/deadlines/save", deadlines.save);
app.del ("/deadlines/:id/del",  deadlines.del);


app.listen(3000);
console.log('Listening on port 3000');
