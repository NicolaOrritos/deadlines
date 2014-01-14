
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
            var date = $("input[name=date]", this)[0].value;
            
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
                        
                        var newDeadline = "<div class=\"deadline\">"
                                        + "     <a class=\"del\" href=\"#\">‒</a>"
                                        + "     <form>"
                                        + "         <input name=\"id\"   type=\"hidden\" value=\"" + newId + "\" />"
                                        + "         <input name=\"name\" type=\"text\"   value=\"" + name  + "\" />"
                                        + "         <input name=\"date\" type=\"text\"   value=\"" + date  + "\" />"
                                        + "     </form>"
                                        + "     <a class=\"save\" href=\"#\">+</a>"
                                        + "</div>";
                        
                        if (!id)
                        {
                            $("#deadlines").prepend(newDeadline);
                        }
                    }
                }
            });
        });
        
        $("#deadlines").on("click", ".deadline .save", function(event)
        {
            $(this).trigger("save", event);
        });
    });
})();
