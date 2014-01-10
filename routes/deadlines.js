
var Datastore = require('nedb');
var db = new Datastore({filename: "pulses.dat", autoload: true});


var OK = {"status": "OK"};
var NOT_OK = {"status": "NOT_OK", "error": "unknown"};


exports.save = function(req, res)
{
    var result = OK;
    
    if (req.body)
    {
        var name = req.body.name;
        var date = req.body.date;
        var id   = req.body.id;
        
        console.log("Deadline name and date: '%s' - '%s'", name, date);
        console.log("id is '%s'", id);
        
        if (id)
        {
            // Already present issue: UPDATE
        }
        else
        {
            // New present issue: CREATE
        }
    }
    else
    {
        result = NOT_OK;
        result.error = "empty request";
    }
    
    res.send(result);
};

exports.del = function(req, res)
{
    // TODO
    
    var result = NOT_OK;
    result.error = "not implemented";
    
    res.send(result);
};
