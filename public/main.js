
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
        
        $(".deadline.new .save").click(function(event)
        {
            var name = $(".deadline.new form [name=name]").val();
            var date = $(".deadline.new form [name=date]").val();
            
            console.log("Creating new deadline named '%s' for date '%s'", name, date);
            
            $.post("/deadlines/save", {"name": name, "date": date}, function(data)
            {
                if (data)
                {
                    console.log("POST result: '%s'", JSON.stringify(data));
                    
                    if (data.status)
                    if (data.status == "OK")
                    if (data.id)
                    {
                        var id = data.id;
                        
                        // Display this deadline with the returned ID
                        
                        // [todo] - Distinguish between new and already-present deadlines
                        
                        var newDeadline = "<div class=\"deadline\">"
                                        + "     <a class=\"del\" href=\"#\">‒</a>"
                                        + "     <form>"
                                        + "         <input name=\"id\"   type=\"hidden\" value=\"" + id   + "\" />"
                                        + "         <input name=\"name\" type=\"text\"   value=\"" + name + "\" />"
                                        + "         <input name=\"date\" type=\"text\"   value=\"" + date + "\" />"
                                        + "     </form>"
                                        + "     <a class=\"save\" href=\"#\">+</a>"
                                        + "</div>";
                        
                        $("#deadlines").prepend(newDeadline);
                        
                        hideNewDeadline();
                    }
                }
            });
        });
    });
})();
