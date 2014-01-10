
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
            
            $.post("/deadlines/save", {"name": name, "date": date});
            
            
            // If POST succeeds add to the UI a new deadline:
            var newDeadline = "<div class=\"deadline\">"
                            + "     <a class=\"del\" href=\"#\">‒</a>"
                            + "     <form>"
                            + "         <input name=\"name\" type=\"text\" placeholder=\"" + name + "\" />"
                            + "         <input name=\"date\" type=\"text\" placeholder=\"" + date + "\" />"
                            + "     </form>"
                            + "     <a class=\"save\" href=\"#\">+</a>"
                            + "</div>";
            
            $("#deadlines").prepend(newDeadline);
            
            hideNewDeadline();
        });
    });
})();
