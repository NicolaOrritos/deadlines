
var deadlines = require("./routes/deadlines");
var express = require("express");
var app = express();


app.configure(function()
{
    app.use(express.static(__dirname + '/public'));
});


app.get("/save", deadlines.save);
app.get("/del", deadlines.del);
app.get("/", deadlines.index);


app.listen(3000);
console.log('Listening on port 3000');
