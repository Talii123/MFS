
var themer = (function(themesToColorsMap) {
    var COLOURS_PATH = "/colours.css",
        JQUERY_UI_PATH = "/jquery-ui-1.9.2.custom.css",
        $insertPoint = $("#appCss"),
        $coloursLink = $(".coloursCss"),
        $jqueryUILink = $(".jqueryUICss"), 

        createFeedbackButton = function (uvClientKey) {
            var uv = document.createElement('script'); 
            uv.type = 'text/javascript'; 
            uv.id = 'uvScript';
            uv.async = true;
            uv.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 
                'widget.uservoice.com/' + 
                uvClientKey;
                    
            var s = document.getElementsByTagName('script')[0]; 
            s.parentNode.insertBefore(uv, s);
            $("#uvScript").on("load", function() {

                //$(".menu.right").css("margin-right", "9em");        
                $(".menu.right").animate({
                    "margin-right" : "9em"
                }, 1200);        
            });
            
        },

        updateFeedbackLinkCss = function(colourCSS, aTheme) {
            var bodyRegex = /body\s+\{([^\}]*)\}/,
                bodyRules,
                rules,
                newBackgroundColour;
            
            try {
                newBackgroundColour = themesToColorsMap[aTheme];
                if (!newBackgroundColour) {
                    bodyRules = bodyRegex.exec(colourCSS)[1];
                    console.log("bodyRules", bodyRules);
                    rules = bodyRules.split(";");
                    console.log("rules: ", rules);
                    $.each(rules, function(index, value) {
                        var rule = value.split(":");
                        if (/background\-color/.test(rule[0])) {
                            newBackgroundColour = rule[1];
                            console.log("new background-color is: ", newBackgroundColour);
                            // it's actually better to continue looping through rules even after 
                            // background-color has been found in case user added multiple by mistake;
                            // the last one will take effect elsewhere as well as with the feedback link
                        }
                    }); 
                }

                $("#uvTab").css({
                    //"opacity"           :   0.75,
                    "background-color"  :   newBackgroundColour
                });   

            } catch (e) {
                console.error("Unable to change style for feedback link due to ", e);
            }          
        },


        setTheme = function(aTheme) {
            var isHosted = (document.location.protocol != "file:"), // themer can be run from a server or as part of a local demo
                themeURI = (isHosted ? "/css/" : "css/") + aTheme, 
                coloursURI = themeURI + COLOURS_PATH,
                jqueryUIURI = themeURI + JQUERY_UI_PATH;
                
            $(document).data("theme", aTheme);

            // wait for both stylesheets to be returned before applying them
            $.when($.get(coloursURI), $.get(jqueryUIURI)).then(function(response, status, jqXHR) {

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

                updateFeedbackLinkCss(arguments[0], aTheme);                     
            });
        }

    return {
        "setTheme"              :   setTheme,
        "createFeedbackButton"  :   createFeedbackButton
    };

})({
    "indie-green"   :   "#f533ff"
});


(function(mappings) {
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
    themer.createFeedbackButton(mappings[themeDir]);

})({
    /* this is for the situation where no theme-specific feedback configuration is provided */
    ""                :   "Ks2Ax046vOVTWNFQ1c54A.js",
    /* this is for the default theme, NOT the default to use if no theme-specific feedback configuration is provided */
    "default"         :   "f6Wugo7NpH9OXlj3ALd2w.js",
    "livestrong"        :   "Ks2Ax046vOVTWNFQ1c54A.js",
    "nike-livestrong"   :   "f6Wugo7NpH9OXlj3ALd2w.js",
    "vader2"            :   "BZckBlvLTT17zXLewJ1IwA.js",
    "indie-green"        :   "YyAkCK8pB7PthQxLfarQ.js"
});

