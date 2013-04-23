var errorMsg = "Sandbox is not defined.  Timeline module will not be loaded.";

if (!Sandbox) {
	console.error(errorMsg);
	throw {
		name: 		"NoSandboxError",
		message: 	errorMsg
	};
}

if (!Sandbox.modules) {
	Sandbox.modules = {};
}

Sandbox.modules.common = function (app) {

	var removeEmail = function removeEmail(event, ui) {
	        $(".email", this).remove();
	    },
	    getEmailHTML = function getEmailHTML() {
	        return "<div class='email'><a href='mailto:TallFry"+"@facebook.com'>TallFry"+"@facebook.com</a></div>";
	    };

    app.initThemer = function initThemer() {
        var currentTheme = $(document).data("theme"),
            $themeSelector = $("#themeSelector"),
            selectedIndex = $("option[value='"+currentTheme+"']", $themeSelector).index(),

        // handle case where the default selection is explicitly chosen via the URL
        selectedIndex = selectedIndex >= 0 ? selectedIndex : 0;
        $themeSelector
            .prop("selectedIndex", selectedIndex)
            .change(function(event) {
                themer.setTheme(this.options[this.selectedIndex].value);
            });
    };

    app.getEmailHTML = getEmailHTML;

    app.removeEmail = removeEmail;

    app.setupDialogs = function setupDialogs(defaults) {
        $(".dialog").dialog(defaults);

        $("#designedByDialog").bind("dialogbeforeclose", removeEmail);
        $("#designedByDialog").dialog({
            open:   function() {
                        $("#designedByDialog").append($(getEmailHTML()).prepend("email: "));
                    }
        });

        $(".menu").click(function($event) {
            var dialogToOpen = $event.target.id;
            $("#" + dialogToOpen + "Dialog").dialog("open");
        });
    };
    
    app.getResizer = function (tl){
    	var resizeTimerID = null;
    	
    	return function () {
	        console.log("onResize()");
	        if (resizeTimerID == null) {
	            resizeTimerID = window.setTimeout(function(){
	                resizeTimerID = null;
	                tl.layout();
	            }, 500);
	        }    		
    	}
    };    

   app.doPreFetch = function() {

      /*  
      $.ajax("/images/bubble-top-left.png");
        $.ajax("/images/bubble-top-right.png");
        $.ajax("/images/bubble-bottom-left.png");
        $.ajax("/images/bubble-bottom-right.png");
        $.ajax("/images/bubble-left.png");
        $.ajax("/images/bubble-right.png");
        $.ajax("/images/bubble-top.png");
        $.ajax("/images/bubble-bottom.png");
        $.ajax("/images/close-button.png");
        $.ajax("/images/bubble-arrow-point-right.png");
        $.ajax("/images/bubble-arrow-point-left.png");
        $.ajax("/images/bubble-arrow-point-up.png");
        $.ajax("/images/bubble-arrow-point-down.png");  
        */

        /*

            This worked better than the above - images were returned, but still NOT cached!! :(
                */

        //console.log("\n\n\n\ninserting images...\n\n\n");

        $("<div style='display:none'>" +
            "<img src='/images/bubble-top-left.png'/>" +
            "<img src='/images/bubble-top-right.png'/>" +
            "<img src='/images/bubble-bottom-left.png'/>" +
            "<img src='/images/bubble-bottom-right.png'/>" +
            "<img src='/images/bubble-left.png'/>" +
            "<img src='/images/bubble-right.png'/>" +
            "<img src='/images/bubble-top.png'/>" +
            "<img src='/images/bubble-bottom.png'/>" +
            "<img src='/images/close-button.png'/>" +
            "<img src='/images/bubble-arrow-point-right.png'/>" +
            "<img src='/images/bubble-arrow-point-left.png'/>" +
            "<img src='/images/bubble-arrow-point-up.png'/>" +
            "<img src='/images/bubble-arrow-point-down.png'/>" +                                                
          "</div>").appendTo("head");
   }; 
}