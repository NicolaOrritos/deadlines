
(function()
{
    // Default locale:
    var locale = "it-IT";
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    
    function hideNewDeadline()
    {
        $(".deadline.new form").hide();
        $(".deadline.new .save").hide();
        $(".deadline.new .hide").hide();
        $(".deadline.new .more").hide();
        $(".deadline.new .less").hide();
        $(".deadline.new .add").show();
        
        $(".deadline.new form [type=text]").val("");
        $(".deadline.new form textarea").val("");
    }
    
    function newDeadlineMarkup(id, name, date, notes)
    {
        var result  = "<div class=\"deadline\">"
                    + "     <a class=\"del\" href=\"#\"><img src=\"images/del.png\"></img></a>"
                    + "     <form>"
                    + "         <input    name=\"id\"    type=\"hidden\" value=\"" + id    + "\" />"
                    + "         <input    name=\"name\"  type=\"text\"   value=\"" + name  + "\" />"
                    + "         <input    name=\"date\"  type=\"text\"   value=\"" + date  + "\" />"
                    + "         <textarea name=\"notes\">" + notes + "</textarea>"
                    + "     </form>"
                    + "     <a class=\"more\" href=\"#\"><img src=\"images/more.png\"></img></a>"
                    + "     <a class=\"less\" href=\"#\"><img src=\"images/less.png\"></img></a>"
                    + "     <a class=\"save\" href=\"#\"><img src=\"images/save.png\"></img></a>"
                    + "</div>";
        
        console.log("Resulting markup: %s", result);
        
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
            result = Date.future(date);
            
            if (result.isValid())
            {
                console.log("Parsed successfully: '%s'", result);
                
                // Convert to Unix time:
                result = result.getTime();
            }
            else
            {
                console.log("Could not parse '%s'", date);
                
                result = undefined;
            }
        }
        
        return result;
    }
    
    function formatDate(date)
    {
        var result = "";
        
        if (date)
        {
            var int = parseInt(date);
            
            if (!isNaN(int))
            {
                var obj = new Date(int);
                
                result = obj.toLocaleString(locale);
            }
        }
        
        return result;
    }
    
    function order(data, reverse)
    {
        var ordered = undefined;
        
        if (Array.isArray(data))
        {
            data.sort(function(a, b)
            {
                var result = 0;
                
                if (a)
                if (b)
                if (a.date)
                if (b.date)
                {
                    var aDate = parseInt(a.date);
                    var bDate = parseInt(b.date);
                    
                    result = aDate - bDate;
                }
                
                if (reverse)
                {
                    result = result * -1;
                }
                
                return result;
            });
            
            ordered = data;
        }
        else
        {
            ordered = new Array();
        }
        
        return ordered;
    }
    
    function showSpinner()
    {
        $(".spinner").addClass("spinner-animated");
    }
    
    function hideSpinner()
    {
        $(".spinner").removeClass("spinner-animated");
    }
    
    function loadExistingDeadlines(callback)
    {
        showSpinner();
        
        $.get("/deadlines/all", function(data)
        {
            console.log("Data returned by '/deadlines/all': %s", JSON.stringify(data));
            
            // We reverse the order because a "prepend" strategy is used when adding deadlines markup to the page
            var result = order(data, true);
            
            console.log("Data ordered: %s", JSON.stringify(result));
            
            if (callback && data)
            {
                callback.call(this, result);
            }
            else
            {
                hideSpinner();
            }
        });
    }
    
    function reload(deadlines)
    {
        if (deadlines)
        {
            $("#deadlines .deadline").each( function(count, deadline)
            {
                if (!deadline.classList.contains("new"))
                {
                    $(deadline).remove();
                }
            });
        }
        
        for (var a=0; a<deadlines.length; a++)
        {
            if (deadlines[a])
            {
                var newDeadline = newDeadlineMarkup(deadlines[a]._id, deadlines[a].name, formatDate(deadlines[a].date), deadlines[a].notes);
                
                $("#deadlines").prepend(newDeadline);
            }
        }
        
        $(".deadline .less").hide();
        $(".deadline textarea[name=notes]").hide();
        
        hideSpinner();
    }
    
    function detectLocale()
    {
        // [todo] - Detect locale
        
        locale = "it-IT";
    }
    
    function highlightCurrentMonth()
    {
        var currMonth = months[(new Date()).getMonth()];
        
        console.log("Current month: %s", currMonth);
        
        $("#months #" + currMonth).addClass("selected");
    }
    
    
    $(document).ready(function()
    {
        detectLocale();
        hideNewDeadline();
        
        $(".deadline.new .add").click(function(event)
        {
            $(".deadline.new form").show();
            $(".deadline.new .save").show();
            $(".deadline.new .hide").show();
            $(".deadline.new .more").show();
            $(".deadline.new .less").hide();
            $(".deadline.new .add").hide();
            $(".deadline.new textarea[name=notes]").hide();
        });
        
        $(".deadline.new .hide").click(function(event)
        {
            hideNewDeadline();
        });
        
        $("#deadlines").on("more", ".deadline", function(event)
        {
            $("textarea[name=notes]", this).show();
            $(".more", this).hide();
            $(".less", this).show();
        });
        
        $("#deadlines").on("less", ".deadline", function(event)
        {
            $("textarea[name=notes]", this).hide();
            $(".more", this).show();
            $(".less", this).hide();
        });
        
        $("#deadlines").on("save", ".deadline", function(event)
        {
            console.log("Received event 'save' on a deadline item");
            
            var id   = undefined;
            var val  = $("input[name=id]", this);
            
            if (val.length > 0)
            {
                id = val[0].value;
            }
            
            var name  = $("input[name=name]", this)[0].value;
            var date  = parseDate($("input[name=date]", this)[0].value);
            var notes = $("textarea[name=notes]", this)[0].value;
            
            // Was an actual date?
            if (date)
            {
                console.log("Received an actual date value: '%s'. Saving...", date);
                
                if (id)
                {
                    // Already present deadline
                    console.log("Updating already present deadline with name '%s' and date '%s'", name, date);
                    console.log(" id is '%s'", id);
                    console.log(" notes are '%s'", notes);
                }
                else
                {
                    // New deadline
                    console.log("Creating new deadline named '%s' for date '%s' and notes '%s'", name, date, notes);
                }
                
                hideNewDeadline();
                
                
                $.post("/deadlines/save", {"id": id, "name": name, "date": date, "notes": notes}, function(data)
                {
                    if (data)
                    {
                        console.log("POST result: '%s'", JSON.stringify(data));
                        
                        if (data.status)
                        if (data.status == "OK")
                        if (data.id)
                        {
                            loadExistingDeadlines(reload);
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
        
        $("#deadlines").on("del", ".deadline", function(event)
        {
            console.log("Received event 'del' on a deadline item");
            
            var id   = undefined;
            var val  = $("input[name=id]", this);
            
            if (val.length > 0)
            {
                id = val[0].value;
            }
            
            console.log("id: '%s'", id);
            
            if (id)
            {
                $.ajax("/deadlines/" + id + "/del", {"type": "DELETE"}).success(function(data, result)
                {
                    console.log("data: '%s'", JSON.stringify(data));
                    console.log("result: '%s'", result);
                    
                    if (result == "success")
                    {
                        console.log("Deleted %s deadlines", result);
                        
                        loadExistingDeadlines(reload);
                    }
                    else
                    {
                        console.log("Error while deleting '%s': '%s'", id, err);
                    }
                    
                }).error(function(err)
                {
                    console.log("Error while deleting '%s': '%s'", id, err);
                });
            }
        });
        
        
        $("#deadlines").on("click", ".deadline .save", function(event)
        {
            $(this).trigger("save", event);
        });
        
        $("#deadlines").on("click", ".deadline .del", function(event)
        {
            $(this).trigger("del", event);
        });
        
        $("#deadlines").on("click", ".deadline .more", function(event)
        {
            $(this).trigger("more", event);
        });
        
        $("#deadlines").on("click", ".deadline .less", function(event)
        {
            $(this).trigger("less", event);
        });
        
        
        function keypressHandler(event)
        {
            var key = event.which || event.keyCode;
            
            console.log("Key pressed: %s", key);
            
            switch (key)
            {
                // RETURN
                case 13:
                {
                    console.log("Submitted form");
                    
                    $(this).trigger("save", event);
                }
                break;
                
                default:
                break;
            }
        }
        
        $("#deadlines").on("keypress", ".deadline form input", keypressHandler);
        
        
        loadExistingDeadlines(reload);
        
        $("#months").addClass("expanded");
        
        highlightCurrentMonth();
    });
})();
