
var themer = (function() {
    var COLOURS_PATH = "/colours.css",
        JQUERY_UI_PATH = "/jquery-ui-1.9.2.custom.css",
        $insertPoint = $("#appCss"),
        $coloursLink = $(".coloursCss"),
        $jqueryUILink = $(".jqueryUICss"), 

        setTheme = function(aTheme) {
            var isHosted = (document.location.protocol != "file:"), // themer can be run from a server or as part of a local demo
                themeURI = (isHosted ? "/css/" : "css/") + aTheme, 
                coloursURI = themeURI + COLOURS_PATH,
                jqueryUIURI = themeURI + JQUERY_UI_PATH;
                
            $(document).data("theme", aTheme);

            // wait for both stylesheets to be returned before applying them
            $.when($.get(coloursURI), $.get(jqueryUIURI)).then(function() {

                if ($coloursLink.length > 0) {
                    $coloursLink.prop("href", coloursURI);
                }
                else {
                    $("<link />").attr({
                        "type"  :   "text/css",
                        "rel"   :   "stylesheet",
                        "class" :   "coloursCss", 
                        "href"  :   coloursURI
                    }).insertAfter($insertPoint);
                    $coloursLink = $(".coloursCss");                     
                }    

                if ($jqueryUILink.length > 0) {
                    $jqueryUILink.prop("href", jqueryUIURI);
                }
                else {
                    $("<link />").attr({
                        "type"  :   "text/css",
                        "rel"   :   "stylesheet",
                        "class" :   "jqueryUICss", 
                        "href"  :   jqueryUIURI
                    }).insertBefore($insertPoint); //.prependTo($("head"));
                    $jqueryUILink = $(".jqueryUICss");
                }                  

            });
        }

    return {
        "setTheme"              :   setTheme
    };

})();


(function() {
    var query = location.search.substring(1),   // strip off leading '?'
        hashIndex = query.indexOf("#"),
        params,
        numParams,
        i,
        themeParam,
        defaultThemeDir = "default",
        themeDir = defaultThemeDir,
        themeURI,
        insertPoint;

    if (hashIndex > 0) {
        query = query.substring(1, hashIndex);
    }
    params = query.split("&");
    for (i = 0, numParams = params.length; i < numParams; ++i) {
        themeParam = params[i].split("=");
        if (themeParam[0] === "theme") {
            themeDir = themeParam[1];
            break;
        }
    }

    if (themeDir !== defaultThemeDir) {
        themer.setTheme(themeDir);    
    }
    
})();

