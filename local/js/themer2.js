
var themer = (function() {
    var /*COLOURS_PATH = "/colours.css",
        JQUERY_UI_PATH = "/jquery-ui-1.8.23.custom.css",*/
        THEME_PATH = "/theme.css",
        $insertPoint = $("#appCss"),
        // $coloursLink = $(".coloursCss"),
        // $jqueryUILink = $(".jqueryUICss"), 
        $themeLink = $(".themeCss"),

        setTheme = function(aTheme) {
            var themeURI = "css/" + aTheme + THEME_PATH;//,
                /*coloursURI = themeURI + COLOURS_PATH,
                jqueryUIURI = themeURI + JQUERY_UI_PATH,*/
                
                
            $(document).data("theme", aTheme);

            /*$.get(coloursURI, function(response, status, jqXHR) {

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
            });*/

            $.get(themeURI, function() {
                var themeClass,
                    dotIndex = THEME_PATH.indexOf(".");

                // remove leading slash, delete the '.' and make the part after uppercase
                themeClass = THEME_PATH.substring(1, dotIndex) + THEME_PATH.substring(dotIndex+1).toUpperCase();

                if ($themeLink.length > 0) {
                    $themeLink.prop("href", themeURI);
                }
                else {
                    $("<link />").attr({
                        "type"  :   "text/css",
                        "rel"   :   "stylesheet",
                        "class" :   themeClass, 
                        "href"  :   themeURI
                    }).insertBefore($insertPoint); //.prependTo($("head"));
                    $themeLink = $("." + themeClass);
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

