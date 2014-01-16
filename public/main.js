
(function()
{
    function hideNewDeadline()
    {
        $(".deadline.new form").hide();
        $(".deadline.new .save").hide();
        $(".deadline.new .hide").hide();
        $(".deadline.new .add").show();
        
        $(".deadline.new form [type=text]").val("");
    }
    
    function newDeadlineMarkup(name, date, id)
    {
        var result  = "<div class=\"deadline\">"
                    + "     <a class=\"del\" href=\"#\">‒</a>"
                    + "     <form>"
                    + "         <input name=\"id\"   type=\"hidden\" value=\"" + id   + "\" />"
                    + "         <input name=\"name\" type=\"text\"   value=\"" + name + "\" />"
                    + "         <input name=\"date\" type=\"text\"   value=\"" + date + "\" />"
                    + "     </form>"
                    + "     <a class=\"save\" href=\"#\">+</a>"
                    + "</div>";
        
        return result;
    }
    
    function isDate(date)
    {
        var result = false;
        
        if ( date )
        if ( Object.prototype.toString.call(date) === "[object Date]" )
        if ( ! isNaN(date.getTime()) )
        {
            result = true;
        }
        
        return result;
    }
    
    function parseDate(date)
    {
        var result = undefined;
        
        if (date)
        {
            result = moment(date, ["DD/MM/YYYY", "MM/YYYY", "DD/MM", "YYYY", "DD-MM-YYYY", "MM-YYYY", "DD-MM"]);
            
            if (result.isValid())
            {
                result = result.toDate();
            }
            else
            {
                result = undefined;
            }
        }
        
        return result;
    }
    
    function loadExistingDeadlines(callback)
    {
        var result = new Array();
        
        $.get("/deadlines/all", function(data)
        {
            // [todo] - Implement the get-all feature
            
            console.log("Data returned by '/deadlines/all': %s", JSON.stringify(data));
            
            result = data;
            
            if (callback)
            {
                callback.call(this, result);
            }
        });
    }
    
    
    $(document).ready(function()
    {
        $(".deadline.new form").hide();
        $(".deadline.new .hide").hide();
        $(".deadline.new .save").hide();
        
        $(".deadline.new .add").click(function(event)
        {
            $(".deadline.new form").show();
            $(".deadline.new .save").show();
            $(".deadline.new .hide").show();
            $(".deadline.new .add").hide();
        });
        
        $(".deadline.new .hide").click(function(event)
        {
            hideNewDeadline();
        });
        
        $("#deadlines").on("save", ".deadline", function(event)
        {
            console.log("Received event 'save' on a deadline item");
            
            console.log("'%s'", $("input[name=name]", this)[0].value);
            
            var id   = undefined;
            
            if ($("input[name=id]", this).length > 0)
            {
                id = $("input[name=id]", this)[0].value;
            }
            
            var name = $("input[name=name]", this)[0].value;
            var date = parseDate($("input[name=date]", this)[0].value);
            
            // Was an actual date?
            if (date)
            {
                console.log("Received an actual date value: '%s'. Saving...", date);
                
                if (id)
                {
                    // Already present deadline
                    console.log("Updating already present deadline with name '%s' and date '%s'", name, date);
                    console.log(" id is '%s'", id);
                }
                else
                {
                    // New deadline
                    console.log("Creating new deadline named '%s' for date '%s'", name, date);
                }
                
                hideNewDeadline();
                
                $.post("/deadlines/save", {"id": id, "name": name, "date": date}, function(data)
                {
                    if (data)
                    {
                        console.log("POST result: '%s'", JSON.stringify(data));
                        
                        if (data.status)
                        if (data.status == "OK")
                        if (data.id)
                        {
                            var newId = data.id;
                            
                            // Display this deadline with the returned ID
                            
                            var newDeadline = newDeadlineMarkup(name, date, newId);
                            
                            if (!id)
                            {
                                $("#deadlines").prepend(newDeadline);
                            }
                        }
                    }
                });
            }
            else
            {
                // [todo] - Show a little error message next to the deadline form and reset the date field
                
                console.log("Didn't receive an actual date value: '%s'. Aborting...", date);
                console.log("Tried to parse '%s'", $("input[name=date]", this)[0].value);
            }
        });
        
        $("#deadlines").on("click", ".deadline .save", function(event)
        {
            $(this).trigger("save", event);
        });
        
        
        loadExistingDeadlines(function(deadlines)
        {
            for (var a=0; a<deadlines.length; a++)
            {
                if (deadlines[a])
                {
                    var newDeadline = newDeadlineMarkup(deadlines[a].name, deadlines[a].date, deadlines[a]._id);
                    
                    $("#deadlines").prepend(newDeadline);
                }
            }
        });
    });
})();
