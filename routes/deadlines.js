
var Datastore = require('nedb');
var db = new Datastore({filename: "deadlines.dat", autoload: true});


var OK = {"status": "OK", "id": 0};
var NOT_OK = {"status": "NOT_OK", "error": "unknown"};


exports.save = function(req, res)
{
    var result = OK;
    
    if (req.body)
    {
        var name = req.body.name;
        var date = req.body.date;
        var id   = req.body.id;
        
        var doc = {"id": id, "name": name, "date": date};
        
        console.log("Deadline name and date: '%s' - '%s'", name, date);
        console.log("id is '%s'", id);
        
        if (id)
        {
            // Already present deadline: UPDATE
            db.update({_id: id}, doc, {}, function(err, numReplaced)
            {
                if (numReplaced > 0)
                {
                    result.id = id;
                }
                else
                {
                    result = NOT_OK;
                    
                    if (err)
                    {
                        result.error = err;
                    }
                }
                
                console.log("Sending result: '%s'", JSON.stringify(result));
                
                res.send(result);
            });
        }
        else
        {
            // New deadline: CREATE
            db.insert(doc, function(err, newDoc)
            {
                if (newDoc)
                {
                    result.id = newDoc._id;
                }
                else
                {
                    result = NOT_OK;
                    
                    if (err)
                    {
                        result.error = err;
                    }
                }
                
                console.log("Sending result: '%s'", JSON.stringify(result));
                    
                res.send(result);
            });
        }
    }
    else
    {
        result = NOT_OK;
        result.error = "empty request";
        
        console.log("Sending result: '%s'", JSON.stringify(result));
        
        res.send(result);
    }
};

exports.del = function(req, res)
{
    var result = NOT_OK;
    result.error = "not implemented";
    
    
    // TODO
    
    
    console.log("Sending result: '%s'", JSON.stringify(result));
    
    res.send(result);
};
