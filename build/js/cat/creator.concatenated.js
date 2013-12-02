var noop = function() {;};

var console = {
	"log"		: 		noop,
	"error"		: 		noop,
	"trace"		: 		noop,
	"profile"	: 		noop,
	"warn"		: 		noop,
	"dir"		: 		noop
};

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

/**
 * @author Talii
 */
/*==================================================
 *  Cancer Event Source
 *==================================================
 *
 * @Todo
 * This class should inherit from Default Event Source and just override
 * event creation so that events can be inflated based on their type
 */
Timeline.CancerEventSource = function(eventIndex){
	var that = new Timeline.DefaultEventSource(eventIndex);
	// override default event source's data loading methods with our own
	that.loadJSON = Timeline.CancerEventSource.prototype.loadJSON;
	return that;
};

Timeline.CancerEventSource.prototype.getIconURLForEventType = function(event) {
    var eventType = event.type,
        iconURL;
    console.log("eventType: ", eventType);
    switch (eventType) {
        case "DIAGNOSIS" : 
            iconURL = "diagnosis_40_40.jpg";
            break;
        case "SURGERY" :
            iconURL = "surgery_40_40.jpg";
            break;
        case "CHEMO" :
            iconURL = "chemo_40_40.jpg";
            break;
        case "RADIATION" : 
            iconURL = "radiation_40_40.jpg";
            break;
        case "IMMUNO" :
            iconURL = "immuno_40_40.jpg";
            break;
        case "TEST" :
            var testType = (event.typeDetails != null) ? event.typeDetails.testType : "default";
            switch (testType) {
                case "CT_SCAN" :
                    iconURL = "ctscan_40_40.jpg";
                    break;
                case "MRI" :
                    iconURL = "mri_40_40.jpg";
                    break;
                case "ULTRASOUND" :
                    iconURL = "ultrasound_40_40.jpg";
                    break;
                default:
                    console.log("Unknown test type: ", testType);
                    break;
            }
            break;
        default:
            iconURL = "";
            break;
    } 
    console.log("iconURL: ", iconURL);
    return iconURL;   
}

Timeline.CancerEventSource.prototype.loadJSON = function(data, url){
    var base = this._getBaseURL(url),
        addedEvents = [];
    //var added = false;
	
	// my vars
	var eventType;
	var painterConfig;
	
    if (data && data.events) {
        var wikiURL = ("wikiURL" in data) ? data.wikiURL : null;
        var wikiSection = ("wikiSection" in data) ? data.wikiSection : null;
        
        var dateTimeFormat = ("dateTimeFormat" in data) ? data.dateTimeFormat : null;
        var parseDateTimeFunction = this._events.getUnit().getParser(dateTimeFormat);

        
        for (var i = 0; i < data.events.length; i++) {
            var event = data.events[i];
            // Fixing issue 33:
            // instant event: default (for JSON only) is false. Or use values from isDuration or durationEvent
            // isDuration was negated (see issue 33, so keep that interpretation
            var instant = event.isDuration || (event.durationEvent != null && !event.durationEvent);
 
 			// if event has a "type" and it's NOT overriding the default values for icon, color and textcolor that are
			// defined for its type, then copy these values from the configuration into the event object so that they
			// will become part of the new "Event" object created below
			// NOTE: even if event types are used, the 
 			/*eventType = event.getProperty("type");
			if (eventType) { // note: events (even cancer events) are NOT required to have an event type
				painterConfig = Timeline.CancerEventSource.painterConfigs[eventType];
				if (painterConfig) {
					if (!event.icon) event.icon = this._resolveRelativeURL(painterConfig["icon"], base);
					if (!event.color) event.color = painterConfig["color"];
					if (!event.textColor) event.textColor = painterConfig["textColor"];
				}
			}*/
            
            var oldIcon = this._resolveRelativeURL(event.icon, base);
            console.log("oldIcon: ", oldIcon);

            var newIcon = "/images/" + Timeline.CancerEventSource.prototype.getIconURLForEventType(event);
            console.log("newIcon: ", newIcon);

           // var evt = new Timeline.CancerEventSource.Event({
		   	var evt = new Timeline.DefaultEventSource.Event({
                id: ("id" in event) ? event.id : undefined,
                start: parseDateTimeFunction(event.start),
                end: parseDateTimeFunction(event.end),
                latestStart: parseDateTimeFunction(event.latestStart),
                earliestEnd: parseDateTimeFunction(event.earliestEnd),
                instant: instant,
                text: event.title,
                description: event.description,
                image: this._resolveRelativeURL(event.image, base),
                link: this._resolveRelativeURL(event.link, base),
                //icon: this._resolveRelativeURL(event.icon, base),
                icon: newIcon,
				//icon: this._resolveRelativeURL("dark-red-circle.png", base),
                color: event.color,
                textColor: event.textColor,
                hoverText: event.hoverText,
                classname: event.classname,
                tapeImage: event.tapeImage,
                tapeRepeat: event.tapeRepeat,
                caption: event.caption,
                eventID: event.eventID,
                trackNum: event.trackNum
            });
			

            evt._obj = event;
            evt.getProperty = function(name){
                return this._obj[name];
            };
            evt.setWikiInfo(wikiURL, wikiSection);
            
            this._events.add(evt);
            /*  original code in Timeline library
            added = true;
            */
            addedEvents.push(evt);
        }
    }
    
    /*  original code in Timeline library
    if (added) {
        this._fire("onAddMany", []);
    }*/

    if (addedEvents.length > 0) {
        console.log("firing the 'onAddMany' event with: ", addedEvents);      
        // we need to wrap all arguments to the "onAddMany" handler in an array so that function.apply() will work,
        // so wrap the "addedEvents" array in an array
        this._fire("onAddMany", [addedEvents]);
    }
};
  
// code based off of p104 in Stoyan Stefanov's "Javascript Patterns"

function Sandbox() {
		// turning arguments into an array
	var args = Array.prototype.slice.call(arguments),
		// the last argument is the callback
		callback = args.pop(),
		// modules can be passed as an array or as individual parameters
		modules = (args[0] && typeof args[0] === "string") ? args : args[0],
		i;

	// make sure the function is called as a constructor
	if (!(this instanceof Sandbox)) {
		return new Sandbox(modules, callback);
	}

	// now add modules to the core 'this' object
	// no modules or "*" both mean "use all modules"
	if (!modules || (modules[0] && modules[0] === '*')) {
		modules = [];
		for (i in Sandbox.modules) {
			if (Sandbox.modules.hasOwnProperty(i)) {
				modules.push(i);
			}
		}
	}


	// initialize the required modules
	for (i=0; i < modules.length; ++i) {
		try {
			Sandbox.modules[modules[i]](this);
		} catch (e) {
			console.log("modules[i]=", modules[i]);
			console.log(e);
		}
	}

	// call the callback
	callback(this);
}

// any prototype properties as needed
Sandbox.prototype = {
	name : "My Application",
	version : "1.0",
	getName : function() {
		return this.name;
	}
};

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

    // from jQuery website
    $.prefetchCachedScript = function(url, options) {
        // allow user to set any option except for dataType, cache, and url
            options = $.extend(options || {}, {
                dataType: "text",   // prevent script from running
                cache: true,
                url: url
            });
            // Use $.ajax() since it is more flexible than $.getScript
            // Return the jqXHR object so we can chain callbacks
            return jQuery.ajax(options);
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

    app.clipText = function(value, numKeep) {
        console.log("\n\n\n\n\nvalue: ", value, "\n\n\n\n\n");
        return (value.length > numKeep) ? value = value.substring(0, numKeep) + "..." : value;
    };

    app.createCounter = function createCounter() {
        var count = 0;

        return {
            "nextInt" : function () {
                return ++count;
            },
            "init" : function (aCount) {
                if (typeof aCount === 'number' && aCount > 0) {
                    count = aCount;
                }
            }
        }
    };

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

   app.doPreFetch = function(scriptURLs) {
        var numScripts,
            i,
            scriptURL;

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


        numScripts = scriptURLs.length;
        for (i=0; i < numScripts; ++i) {
            scriptURL = scriptURLs[i];
            console.log("going to try to prefetch url: ", scriptURL);
            $.prefetchCachedScript(scriptURL);
            console.log("request sent");
        }


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

Sandbox.modules.timeline_view = function (app) {
	var DEFAULT_TIMELINE_CONTAINER_ID = "#my-timeline",
		DEFAULT_EVENT_DATA_URL = "events.json",
		DEFAULT_EVENT_SOURCE = "",// = new Timeline.DefaultEventSource(),
		DEFAULT_START_PROJ = new Date(),
		DEFAULT_END_PROJ = DEFAULT_START_PROJ,

		hasOwn = Object.prototype.hasOwnProperty,
		isEnhanced = false,

		getDefaultTheme = function(themeOptions) {
			var theme = Timeline.ClassicTheme.create(),
				options = themeOptions || {};

		    theme.autoWidth = false; // Set the Timeline's "width" automatically.
		    theme.autoWidthMargin = 10;
		    theme.event.bubble.width = 220;
		    theme.event.bubble.height = 120;
		    
		    theme.ether.backgroundColors = ["#E6E6E6", "#F7F7F7"];
		    
		    theme.timeline_start = options["startProj"] || DEFAULT_START_PROJ;
		    theme.timeline_stop = options["endProj"] || DEFAULT_END_PROJ;
		    
		    // theme.event.track.height = "20";
		    // theme.event.tape.height = 10; // px
		    // theme.event.track.height = theme.event.tape.height + 6;
		    
		    // for compact painting
		    theme.event.instant.icon = "no-image-40.png";
		    theme.event.instant.iconWidth = 40;  // These are for the default stand-alone icon
		    theme.event.instant.iconHeight = 40;

		    return theme;
		},

		isAbsoluteURL = function(url) {
			return url && url.indexOf("://") > 0;
		},

		getDomain = function(url) {
			return url && url.substr(0, url.indexOf("/", url.indexOf("://") + 3));
		},

        /* //original
        Timeline.DefaultEventSource.prototype._getBaseURL = function(url) {
		    if (url.indexOf("://") < 0) {
		        var url2 = this._getBaseURL(document.location.href);
		        if (url.substr(0,1) == "/") {
		            url = url2.substr(0, url2.indexOf("/", url2.indexOf("://") + 3)) + url;
		        } else {
		            url = url2 + url;
		        }
		    }
		    
		    var i = url.lastIndexOf("/");
		    if (i < 0) {
		        return "";
		    } else {
		        return url.substr(0, i+1);
		    }
		};*/
		// this new implementation will be added to the DefaultEventSource prototype in the enhanceXXX() function;
		// the function is defined here so that it will be available to the entire timeline library
		getBaseURL = function(url) {
			if (!url) return;

		    if (!isAbsoluteURL(url)) {
		        var url2 = getBaseURL(document.location.href);
		        if (url.substr(0,1) == "/") {	// url is "/...", so we need to remove the path component
		            url = getDomain(url2) + url;
		        } else {	// url is "..." so just concatenate the two
		            url = url2 + url;
		        }
		    }
		    
		    var i = url.lastIndexOf("/");
		    if (i < 0) {
		        return "";
		    } else {
		        return url.substr(0, i+1);
		    }
		},

		/* //original
		Timeline.DefaultEventSource.prototype._resolveRelativeURL = function(url, base) {
		    if (url == null || url == "") {
		        return url;
		    } else if (url.indexOf("://") > 0) {
		        return url;
		    } else if (url.substr(0,1) == "/") {
		        return base.substr(0, base.indexOf("/", base.indexOf("://") + 3)) + url;
		    } else {
		        return base + url;
		    }
		};*/
		// this new implementation will be added to the DefaultEventSource prototype in the enhanceXXX() function;
		// the function is defined here so that it will be available to the entire timeline library
		resolveRelativeURL = function(url, base) {
		    if (url == null || url == "" || isAbsoluteURL(url)) {
		    	return url;
		    } else if (url.substr(0,1) == "/") {
		    	return getDomain(base) + url;
		    } else {
		    	return base + url;
		    }
		},

		findEvent = function(aTimeline, anEventID) {
			var event;
			aTimeline.applyToBands(function() {	// 'this' is a band object
				if (!event) {
					event = this.getEventSource().getEvent(anEventID);
					return;
				}
			});

			if (!event) {
				console.error("Unable to find an event for ID ", anEventID, " so cannot center timeline around event specified.");
				return;
			}

			return event;			
		}

		centerOnDate = function (aTimeline, aGregorianDateTime) {
			aTimeline.getBand(0).setCenterVisibleDate(SimileAjax.DateTime.parseGregorianDateTime(aGregorianDateTime));
			return false;
		},

		centerOnEvent = function (aTimeline, anEventID) {
			var event;
			// aTimeline.applyToBands(function() {	// 'this' is a band object
			// 	if (!event) {
			// 		event = this.getEventSource().getEvent(anEventID);
			// 		return;
			// 	}
			// });

			// if (!event) {
			// 	console.error("Unable to find an event for ID ", anEventID, " so cannot center timeline around event specified.");
			// 	return;
			// }
			event = findEvent(aTimeline, anEventID);
			aTimeline.applyToBands(function() {
				this.setCenterVisibleDate(event.getStart());
			}, true);
		},

		makeUpdater = function makeUpdater(aTimeline) {
            var timeline = aTimeline,
				hideEvents = {}, //[],
				//highlightEvents = {},
				highlightedEvent,
				
				highlightIndex = 0,

				filterMatcher = function(evt) {
					//var eventType = evt.getProperty("typeIndex");
					var eventType = +evt._obj.typeIndex;
					if (typeof eventType != "number") return true;
					
					return !hideEvents[eventType];
				},
				highlightMatcher = function(evt) {
					//return highlightEvents[evt.getID()];
					return (highlightedEvent === evt.getID()) ? highlightIndex++ : -1;
				},

				repaintEvents = function() {
					timeline.applyToBands(function () {
						this.getEventPainter().paint();
					});
				};

            timeline.applyToBands(function() {
            	var eventPainter = this.getEventPainter();

                eventPainter.setFilterMatcher(filterMatcher);
                eventPainter.setHighlightMatcher(highlightMatcher);
            });
			
			return {
				"show" : function(eventType) {
					hideEvents[eventType] = false;
					repaintEvents();
					//timeline.paint();
					//timeline.layout();
				},
				"hide" : function(eventType) {
					hideEvents[eventType] = true;							
					repaintEvents();
					//timeline.paint();
					//timeline.layout();
				},
				"highlight"	: function(eventID) {
					//highlightEvents[event.getID()] = highlightIndex++;
					highlightedEvent = eventID;
					repaintEvents();
					//timeline.paint();
				},
				"unhighlight" : function(eventID) {
					//delete highlightEvents[event.getID()];
					if (eventID === highlightedEvent) highlightedEvent = null;
					repaintEvents();					
					// timeline.paint();
				}
			};
		}, 

/*		makeTimelineController = function makeUpdater(aTimeline) {
            var timeline = aTimeline,
				hideEvents = {}, //[],
				//highlightEvents = {},
				highlightedEvent,
				
				highlightIndex = 0,

				filterMatcher = function(evt) {
					//var eventType = evt.getProperty("typeIndex");
					var eventType = +evt._obj.typeIndex;
					if (typeof eventType != "number") return true;
					
					return !hideEvents[eventType];
				},
				highlightMatcher = function(evt) {
					//return highlightEvents[evt.getID()];
					return (highlightedEvent === evt.getID()) ? highlightIndex++ : -1;
				},

				repaintEvents = function() {
					timeline.applyToBands(function () {
						this.getEventPainter().paint();
					});
				};

            timeline.applyToBands(function() {
            	var eventPainter = this.getEventPainter();

                eventPainter.setFilterMatcher(filterMatcher);
                eventPainter.setHighlightMatcher(highlightMatcher);
            });
			
			return {
				"show" : function(eventType) {
					hideEvents[eventType] = false;
					repaintEvents();
					//timeline.paint();
					//timeline.layout();
				},
				"hide" : function(eventType) {
					hideEvents[eventType] = true;							
					repaintEvents();
					//timeline.paint();
					//timeline.layout();
				},
				"highlight"	: function(eventID) {
					//highlightEvents[event.getID()] = highlightIndex++;
					highlightedEvent = eventID;
					repaintEvents();
					//timeline.paint();
				},
				"unhighlight" : function(eventID) {
					//delete highlightEvents[event.getID()];
					if (eventID === highlightedEvent) highlightedEvent = null;
					repaintEvents();					
					// timeline.paint();
				}
			};
		}, */

        enhanceTimelineLibrary = function () {
        	//var validDecorators = ["Timeline.SpanHighlightDecorator", "Timeline.PointHighlightDecorator"];

        	/*
				Timeline.CompactEventPainter.prototype._paintEventIcon = function(commonData, iconData, top, left, metrics, theme) {
				    var img = SimileAjax.Graphics.createTranslucentImage(iconData.url);
				    var iconDiv = this._timeline.getDocument().createElement("div");
				    iconDiv.className = 'timeline-event-icon' + ("className" in iconData ? (" " + iconData.className) : "");
				    iconDiv.style.left = left + "px";
				    iconDiv.style.top = top + "px";
				    iconDiv.appendChild(img);
				    
				    if ("tooltip" in commonData && typeof commonData.tooltip == "string") {
				        iconDiv.title = commonData.tooltip;
				    }
				    
				    this._eventLayer.appendChild(iconDiv);
				    
				    return {
				        left:   left,
				        top:    top,
				        width:  metrics.iconWidth,
				        height: metrics.iconHeight,
				        elmt:   iconDiv
				    };
				};
        	*/

        	Timeline.EventUtils = $.extend(Timeline.EventUtils, (function() {
        		var counter = app.createCounter();
        		return {
        			// overwrite existing definition for this method
					"getNewEventID" : function () {
                    	// almost impossible for two clients to be trying to add an event to the same timeline at the same time
                   		var eventID = "e" + counter.nextInt()+ "_" + new Date().getTime();
						console.log("assigning eventID: ", eventID);
						return eventID;
					},
					// add this method so that we can set the count based on existing events
					"counterInit"	: function (aCount) {
						console.log("initializing counter to: ", aCount);
						counter.init(aCount);
					}
        		};
        	})());

			Timeline.CompactEventPainter.prototype._paintEventIcon = function(commonData, iconData, top, left, metrics, theme) {
			    //var img = SimileAjax.Graphics.createTranslucentImage(iconData.url);
			    var iconDiv = this._timeline.getDocument().createElement("div"),
			    	url,
			    	spriteClass,
			    	beginIndex,
			    	endIndex;
			    iconDiv.className = 'timeline-event-icon' + ("className" in iconData ? (" " + iconData.className) : "");
			    iconDiv.style.left = left + "px";
			    iconDiv.style.top = top + "px";
			    //iconDiv.appendChild(img);

			    //console.log("\n\n\n\n");
			    url = iconData.url;
			    //console.log("url: ", url);
			    beginIndex = url.lastIndexOf("/");
			    endIndex = url.lastIndexOf(".");
			    //console.log("beginIndex: ", beginIndex, ", endIndex: ", endIndex);
			    spriteClass = url.substring(beginIndex+1, endIndex);
			    console.log("spriteClass: ", spriteClass)
			    //console.log("\n\n\n\n");
			    iconDiv.className += " sprite-" + spriteClass;

			    
			    if ("tooltip" in commonData && typeof commonData.tooltip == "string") {
			        iconDiv.title = commonData.tooltip;
			    }
			    
			    this._eventLayer.appendChild(iconDiv);
			    
			    return {
			        left:   left,
			        top:    top,
			        width:  metrics.iconWidth,
			        height: metrics.iconHeight,
			        elmt:   iconDiv
			    };
			};



			Timeline.DefaultEventSource.prototype._getBaseURL = getBaseURL;
			Timeline.DefaultEventSource.prototype._resolveRelativeURL = resolveRelativeURL;

			Timeline.DefaultEventSource.Event.prototype.fillDescription = function(element) {
				element.innerHTML = (this._description || "").replace(/\\n/g, "<br/>");
			}

			// library way of doing this is to just assign the last colour but I wanted to experiment with some variety
			Timeline.OriginalEventPainter.prototype._getHighlightColor = function(highlightIndex, theme) {
			    var highlightColors = theme.event.highlightColors;    
			    // assert highlightIndex >= 0
			    return highlightColors[highlightIndex % (highlightColors.length - 1)];
			};

		

			Timeline._Band.prototype.addDecorator = function (aDecorator) {
				if (!aDecorator /*|| !validDecorators[typeof aDecorator]*/) {
					console.error("Attempted to add invalid decorator.");
					return;
				}

			    this._decorators.push(aDecorator);
			    aDecorator.initialize(this, this._timeline);
			}			


            // replaced use of "eval" in original with JSON.parse(); eval is evil and less secure            
            // NOTE: JSON.parse is very strict!!!  JSON can't have comments, extra commas at the end of an array or object
            Timeline._Impl.prototype.loadJSON = function(url, f) {
			    var tl = this;	// need to maintain reference to "this" for later as the callbacks will be called
			    				// asynchronously, in a different context where "this" will mean something else
			    
			    var successHandler = function(data, textStatus, jqXHR) {
			    	try {
			    		f(data, url);
			    	} finally {
			    		tl.hideLoadingMessage();
			    	}
			    };

			    var errorHandler = function(jqXHR, textStatus, errorThrown) {
			    	console.error("Failed to load json data from ", url, "\n", textStatus);
			    	tl.hideLoadingMessage();
			    }
			    
			    this.showLoadingMessage();
			    	//SimileAjax.XmlHttp.get(url, fError, fDone); 

		    	$.ajax({
					url: 		url,
					dataType: 	'json',
					//data: 		data,
					success: 	successHandler,
					error: 		errorHandler
				});


			};

            // augment Timelines so that there is a simple method for applying a function to each band
            Timeline._Impl.prototype.applyToBands = function (method, isSynchedBandSkipped) {
                var numBands = this.getBandCount(),
                    band,
                    bandInfos,
                    syncWith,
                    i,
                    isSkipped = {};

                if (typeof method !== 'function') {
                	console.error("Method not supplied or is not a function, so there is nothing to apply to the bands.");
                	return;
                }

                if (isSynchedBandSkipped) {
                	bandInfos = this._bandInfos;
                	for (i = 0; i < numBands; ++i) {
                		syncWith = bandInfos[i].syncWith;
                		if (typeof syncWith === 'number') {
                			isSkipped[i] = true;
                		}
                	}
                }
                
                for (i = 0; i < numBands; ++i) {
                	if (!isSkipped[i]) {
                    	console.log("Applying method to band: ", i);
                        method.apply(this.getBand(i));
                    }
                    else {
                    	console.log("Skipping applying method to band", i, " cuz it's synched with another band; don't need to apply to EVERY band.");
                    	console.trace();
                    }
                }                	                
            }        
        }, 

        createEventInfoUpdater = function(containersSelector) {
            var eventInfoTemplates = [
                    "#diagnosisDetailsTemplate",
                    "#surgeryDetailsTemplate",
                    "#chemoDetailsTemplate", 
                    "#radiationDetailsTemplate",
                    "#immunoDetailsTemplate",
                    "#testDetailsTemplate"
                    
                ],
                eventTypeContentContainers = $(containersSelector).get(),
                addEvents = function(events) {
                    var i, 
                        numEvents;

                    console.log("addEvents called!");

                    if (!events) {
                        console.error("addEvents called, but with invalid events argument: ", events);
                        return;
                    }

                    for (i = 0, numEvents = events.length; i < numEvents; ++i) {
                        addEvent(events[i]);
                    }
                    console.log("done adding events.");                        
                },
                addEvent = function(event) {
                    var eventTypeIndex,
                        eventTypeTemplate;

                    console.log("adding event: ", event);

                    eventTypeIndex = event.getProperty("typeIndex");// - 1;
                    //$("#dummyTemplate").tmpl(event).appendTo($(".eventTypeContent").eq(event.getProperty("typeIndex")-1));
                    eventTypeTemplate = eventInfoTemplates[eventTypeIndex] || "#notImplementedTemplate";
                    console.log("applying template: ", eventTypeTemplate, " to event: ", event, " and appending it to container: ",  eventTypeContentContainers[eventTypeIndex]);
                    // this works but I'm trying to optimize
                    //$(eventTypeTemplate).tmpl(event).appendTo($(".eventTypeContent").eq(eventTypeIndex).find("ul"));
                    
                    // optimized?
                    $(eventTypeTemplate).tmpl($.extend(event, {
                    	"getDebugJSON" 	: 	function(anObj) {                    			
                    		return (anObj !== undefined) ? JSON.stringify(anObj) : JSON.stringify(this);
                    	},
                    	"getProperty"	: 	function(aPropertyName) {
                    		var details = this._obj.typeDetails,
                    			prop = details && details[aPropertyName];
                    		if (aPropertyName === "result") {
                    			prop = this.formatResult(prop);
                    		}
                    		else {
	                    		if (typeof prop === "boolean") {
	                    			prop = prop ? "YES" : "NO";
	                    		}
	                    		else if (prop === "true") {
	                    			prop = "YES";
	                    		}
	                    		else if (prop === "false") {
	                    			prop = "NO";
	                    		}                    			
                    		}


                    		return prop;
                    	},
                    	"hasProperty"	: 	function(aPropertyName) {
                    		var details = this._obj.typeDetails;
                    		return details && hasOwn.call(details, aPropertyName);
                    	},
                    	"formatResult" 	: 	function(aResult) {
                    		// TODO: all of these are taken from text embedded in templates;
                    		// that text should be externalized
                    		switch(aResult) {
                    			case "CR" : 
                    				aResult = "Remission - no sign of cancer after the treatment";
                    				break;
                    			case "PR1" : 
                    				aResult = "Some spots got smaller, others stayed the same";
                    				break;
                    			case "PR2" : 
                    				aResult = "Some spots got smaller, but others got bigger";
                    				break;
                    			case "SD" : 
                    				aResult = "All spots stayed the same or got worse";
                    				break;
                    			case "PD" : 
                    				aResult = "No Change";
                    				break;   
                    			case "DK" : 
                    				aResult = "Not sure";
                    				break; 
                    			case "ALL" :
                    				aResult = "All of the cancer was removed.";
                    				break;
                    			case "SOME" :
                    				aResult = "Some of the cancer was removed.";
                    				break;
                    			case "NONE" :
                    				aResult = "None of the cancer was removed.";
                    				break;                    				                    				
                    			default: 
                    				console.warn("unknown 'result': ", aResult);
                    		}
                    		return aResult;
                    	}
                    })).appendTo(eventTypeContentContainers[eventTypeIndex]);

                    //$(eventTypeTemplate).tmpl(event, {"getPatientDescription" : function() {return this.data.getProperty("pDescription").replace(/\n/g, "<br/>")}}).appendTo(eventTypeContentContainers[eventTypeIndex]);

                    //$("#dummyTemplate").tmpl(event).appendTo($(".eventTypeContent").filter("."+event.getProperty("type")));
                    //$("#chemoDetailsTemplate2").tmpl(event).appendTo(eventTypeContentContainers[eventTypeIndex]);
                };

            console.log("\n\n\n eventTypeContentContainers: ", eventTypeContentContainers, "\n\n\n");
            console.dir(eventTypeContentContainers);

            return {
                "addEvent"      :       addEvent,
                "addEvents"     :       addEvents,
                "onAddOne"      :       addEvents,  // for some reason, eventSource was written to retutn the single event as an array :(
                "onAddMany"     :       addEvents
            };
        },

        updateEventTypeVis = function(aRadioButton){
            var eventTypeIndex = $(".eventTypeContent").index($(aRadioButton).parents(".eventTypeContent"));
            if (aRadioButton && aRadioButton.value == "show") {
                //Timeline.Cancer.updater.show(aCheckbox.id); // should probably set ID to be {something}_i instead of i
                updater.show(eventTypeIndex);
            }
            else {
                //Timeline.Cancer.updater.hide(aCheckbox.id);
                updater.hide(eventTypeIndex);
            }
        }

        // TODO: Tal, make this pretty!
        makeVisibilityUpdater = function(tlUpdater) {
	        return function updateEventTypeVis(aRadioButton){
	            var eventTypeIndex = $(".eventTypeContent").index($(aRadioButton).parents(".eventTypeContent"));
	            if (aRadioButton && aRadioButton.value == "show") {
	                //Timeline.Cancer.updater.show(aCheckbox.id); // should probably set ID to be {something}_i instead of i
	                tlUpdater.show(eventTypeIndex);
	            }
	            else {
	                //Timeline.Cancer.updater.hide(aCheckbox.id);
	                tlUpdater.hide(eventTypeIndex);
	            }
	        }
	    };


	//enhanceTimelineLibrary();

	app.createTimeline = function (timelineConfig) {
		var config = timelineConfig || {},
			tl,
			updater,
			// optional, but needs to be defined before bandInfos
			eventSource = config["eventSource"] || DEFAULT_EVENT_SOURCE,
            startProj = config["startProj"] || DEFAULT_START_PROJ,
            endProj = config["endProj"] || DEFAULT_END_PROJ,
            theme = config["theme"] || getDefaultTheme({	// Timeline Impl Object uses the theme's startProj and endProj as it's own
            	"startProj"	: 	startProj,
            	"endProj"	: 	endProj
            }),

	        // required!
	        bandInfos = config["bandInfos"],
	        timelineContainerID = config["timelineContainerID"] || DEFAULT_TIMELINE_CONTAINER_ID,
	        eventDataURL = config["eventDataURL"] || DEFAULT_EVENT_DATA_URL;
	    
	    if (!isEnhanced) {
	    	//app.enhanceTimelineLibrary();
	    	enhanceTimelineLibrary();
	    	isEnhanced = true;
	    }
	    
	    // apply my theme to bandinfos?
	    bandInfos[0].theme = bandInfos[1].theme = theme;

	    tl = Timeline.create($(timelineContainerID)[0], bandInfos);	 

	    // moved to timeline-edit module
	    //tl.augmentListeners();

	    /*tl.loadJSON(eventDataURL, function(data, url){
	    	// this only works when delivered from a server; when using a file URI, the path to the project gets cleared out
	    	// need a more robust solution
	        //eventSource.loadJSON(data, "/images/");
	        eventSource.loadJSON(data, url);
	    });

	    tl.layout();*/

	    return tl;  
	}

	//app.enhanceTimelineLibrary = enhanceTimelineLibrary;
	app.getDefaultTheme = getDefaultTheme;
	app.isAbsoluteURL = isAbsoluteURL;
	app.getDomain = getDomain;
	app.centerOnDate = centerOnDate;
	app.centerOnEvent = centerOnEvent;
	app.makeUpdater = makeUpdater;
	app.createEventInfoUpdater = createEventInfoUpdater;
	//app.makeTimelineController = makeTimelineController;
	app.makeVisibilityUpdater = makeVisibilityUpdater;
	app.updateEventTypeVis = updateEventTypeVis;
}

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

Sandbox.modules.chapter_viewer = function (app) {
    var HIGHLIGHTED_INDEX_BASE_CLASSNAME = "chapter-index-",
        //app.HIGHLIGHTED_INDEX_BASE_CLASSNAME = HIGHLIGHTED_INDEX_BASE_CLASSNAME;  
        
        ChaptersUtil = (function() {
            var counter = app.createCounter();
            return {
                "getNewChapterID" : function () {
                    // almost impossible for two clients to be trying to add a chapter to the same timeline at the same time
                    var chapterID = "c" + counter.nextInt()+ "_" + new Date().getTime();
                    console.log("assigning chapterID: ", chapterID);
                    return chapterID;
                },
                "counterInit"   : function (aCount) {
                    console.log("initializing counter to: ", aCount);
                    counter.init(aCount);
                }
            };  
        })(),        

        renderChapters = function renderChapters(chapters, anOffset) {
            // should not need try block?
            console.log("\n\n\nchapters: ", chapters, "\n\n\n");
            try {
                // TODO: rename these templates to renderXXX instead of addXXX (it's confusing the way it is now)
                $("#addChapterTabTemplate").tmpl({"chapters" : chapters, "offset" : anOffset, "clip" : app.clipText}).appendTo("#patientNotesNav");
                $("#addChapterTextTemplate").tmpl({"chapters" : chapters, "offset" : anOffset}).appendTo("#patientNotes ul");

            } catch (e) {
                console.error(e);
            }
        },

        makeChapterHighlighter = function(ownerNode) {
            return function chapterHighlighter($event) {
                var HIGHLIGHTED_CHAPTER_DATUM_NAME = "highlightedChapter",
                    chapterIndex,
                    $highlightedChapter;

                $highlightedChapter = ownerNode.data(HIGHLIGHTED_CHAPTER_DATUM_NAME) || {};
                console.log("$highlightedChapter = ", $highlightedChapter);

                chapterIndex = $($event.target).data("chapterIndex");
                console.log("chapterIndex = ", chapterIndex);

                if ($highlightedChapter.length > 0) {
                    $highlightedChapter.addClass("hidden");                
                }
                $highlightedChapter = $(".ui-state-highlight."+HIGHLIGHTED_INDEX_BASE_CLASSNAME + chapterIndex);
                $highlightedChapter.removeClass("hidden");//.show();
                ownerNode.data(HIGHLIGHTED_CHAPTER_DATUM_NAME, $highlightedChapter);
            }
        },

        addHighlightSpan = function(band, chapter, highlightIndexClass) {
            if (band) {
                band.addDecorator(new Timeline.SpanHighlightDecorator({
                        startDate   :   chapter.start,
                        endDate     :   chapter.end,
                        cssClass    :   "ui-state-highlight hidden "+highlightIndexClass, 
                        opacity     :   30
                }));                     
            }
        },

        createChapterButton = function(chapter, chapterIndex) {
            var centerDate = new Date(
                (new Date(chapter.start).getTime() + 
                new Date(chapter.end).getTime()) / 2),
                
                
                $labelNode = $(this.nextSibling);

            console.log("centerDate = ", centerDate);

            // since page is pre-rendered, need to remove the span that is added by calls to $().button()
            // before we can call it later to set up these buttons
            //$labelNode.text($labelNode.find("span").text());
            
            $(this).data("centerDate", centerDate)
                .data("chapterIndex", chapterIndex)
                .data("chapterID", chapter.id)
                .button();     // it's already been pre-rendered as a button
                //.click();
        },

        makeAddChaptersFunc = function makeAddChaptersFunc($ownerNode) {
            return function addChapters(data, aTimeline, anOffset, skipRendering) {
                var band = aTimeline ? aTimeline.getBand(0) : null,
                    chapters = data.chapters,
                    anOffset = anOffset || 0;

                if (!skipRendering) {
                    renderChapters(chapters, anOffset);                    
                }

                $("#patientNotesNav input:radio").slice(anOffset).each(function(index, value) {
                    var chapter = chapters[index],
                        chapterIndex = index + anOffset,
                        highlightIndexClass = HIGHLIGHTED_INDEX_BASE_CLASSNAME + chapterIndex;

                    createChapterButton.call(this, chapter, chapterIndex);
                    addHighlightSpan(band, chapter, highlightIndexClass);
                });//.first().click();
                

                if (aTimeline) {
                    aTimeline.paint();                
                }

                /*
                // since JSON is already preloaded, we know that this will always happen
                $("body").off("click", disableUI);
                disableUI = function(){};            */

                enableChapterNav($ownerNode, aTimeline);

                console.log("done loading chapters");
            };
        },

        enableChapterNav = function($ownerNode, aTimeline) {
            var highlightChapter = makeChapterHighlighter($ownerNode),
                selectChapter = function() {
                    var centerDate,
                        $this;

                    $this = $(this);
                    centerDate = $(this).data("centerDate");
                    console.log("centering on date...", centerDate);
                    // scroll timeline
                    app.centerOnDate(aTimeline, centerDate);
                    // show text
                    $("#patientNotes .chapter").hide();
                    $("#"+this.id+"_text").show();
                },
                onClickHandler = function($event) {
                    console.log("inside onClickHandler, this: ", this);
                    selectChapter.call(this, $event);
                    highlightChapter.call(this, $event);                    
                };

            $ownerNode.on("click", "input:radio", onClickHandler/*app.makeChapterHighlighter($patientNotesNav)*/)
                .find("input:radio").first().click();
            //  don't need this if a chapter is selected by default, as the selection handler will take care of this
            //$("#patientNotes p").hide();      	
        },

        makeChaptersUpdater = function makeChaptersUpdater($ownerNode) {        
            return {
                "addChapters"  :   makeAddChaptersFunc($ownerNode)
            };
        };

    $.extend(app, {
        "ChaptersUtil"              :           ChaptersUtil,
        /*"HIGHLIGHTED_INDEX_BASE_CLASSNAME" :    HIGHLIGHTED_INDEX_BASE_CLASSNAME,
        //"makeChapterHighlighter"    :           makeChapterHighlighter,
        "addChapters"              :           addChapters,  // moved to chaptersUpdater
        "enableChapterNav"          :           enableChapterNav,*/
        "renderChapters"            :           renderChapters,
        "makeChaptersUpdater"       :           makeChaptersUpdater
    });
}

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

Sandbox.modules.timeline_edit = function (app) {
	var /*DEFAULT_TIMELINE_CONTAINER_ID = "#my-timeline",
		DEFAULT_EVENT_DATA_URL = "events.json",
		DEFAULT_EVENT_SOURCE = new Timeline.DefaultEventSource(),
		DEFAULT_START_PROJ = new Date(),
		DEFAULT_END_PROJ = DEFAULT_START_PROJ,*/

		isEnhanced = false,
		hasOwn = Object.prototype.hasOwnProperty,

		// note: this is a different (and complementary) function to the 'enhanceTimelineLibrary' function
		// in the timeline_view module
        enhanceTimelineLibrary = function () {

        	if (isEnhanced) {
        		console.log("exiting 'enhanceTimelineLibrary' without doing anything; 'enhanceTimelineLibrary' has already been called in this module.");
        		return;
        	}

            // enhance Simile library
            SimileAjax.EventIndex.prototype.remove = function (evt) {
                this._events.remove(evt);
                delete this._idToEvent[evt.getID()];
                this._indexed = false;
            };

            Timeline.DefaultEventSource.prototype.convertToTimelineEvent = function (event, url, data) {
	            var timelineEvent,
	            	instant,
	                parseDateTimeFunction,
	                url = url || "events.json",
	                data = data || {},

	                base = this._getBaseURL(url),

			        /*wikiURL = ("wikiURL" in data) ? data.wikiURL : null;
			        wikiSection = ("wikiSection" in data) ? data.wikiSection : null;*/
			    
			        dateTimeFormat = ("dateTimeFormat" in data) ? data.dateTimeFormat : "Gregorian",
			        parseDateTimeFunction = this._events.getUnit().getParser(dateTimeFormat);


				instant = event.isDuration || (event.durationEvent != null && !event.durationEvent);

	            timelineEvent = new Timeline.DefaultEventSource.Event({
	                          id: ("id" in event) ? event.id : undefined,
	                       start: parseDateTimeFunction(event.start),
	                         end: parseDateTimeFunction(event.end),
	                 latestStart: parseDateTimeFunction(event.latestStart),
	                 earliestEnd: parseDateTimeFunction(event.earliestEnd),
	                     instant: instant,
	                        text: event.title,
	                 description: event.description,
	                       image: this._resolveRelativeURL(event.image, base),
	                        link: this._resolveRelativeURL(event.link , base),
	                        icon: this._resolveRelativeURL(event.icon , base),
	                       color: event.color,                                      
	                   textColor: event.textColor,
	                   hoverText: event.hoverText,
	                   classname: event.classname,
	                   tapeImage: event.tapeImage,
	                  tapeRepeat: event.tapeRepeat,
	                     caption: event.caption,
	                     eventID: event.eventID,
	                    trackNum: event.trackNum
	            });
	            timelineEvent._obj = event;
	            timelineEvent.getProperty = function(name) {
	                return this._obj[name];
	            };
	            /*timelineEvent.setWikiInfo(wikiURL, wikiSection); */

	            return timelineEvent;           	
            }

            Timeline.DefaultEventSource.prototype.deleteEvent = function (evtID) {
                var evt = this._events.getEvent(evtID);
                this._events.remove(evt);   // calls remove() on EventIndex, which inherits a remove() method from SimileAjax.EventIndex.prototype
                this._fire("onDelete", [evt]);
            };

            Timeline.DefaultEventSource.prototype.updateEvent = function (updatedEventSpec) {
                var updatedEvent,
                	existingEvent,
                	existingEventID,
                	onUpdateChangeObj;

                /*var existingEventID = updatedEvent.id,
                    existingEvent = this._events.getEvent(existingEventID); ,
                    

                updatedEvent.start = parseDateTimeFunction(updatedEvent.start);
                updatedEvent.end = parseDateTimeFunction(updatedEvent.end);
                */

                /*var existingEventID = updatedEvent.getID(),
                    existingEvent = this._events.getEvent(existingEventID);*/

				parseDateTimeFunction = this._events.getUnit().getParser("Gregorian"/*dateTimeFormat*/);

                // updatedEvent is not an actual event object, it's a pojo w key event properties so make it into an event the same way that it happens in eventSource.loadJSON()
                updatedEvent = //new Timeline.DefaultEventSource.Event(updatedEventSpec);
                	this.convertToTimelineEvent(updatedEventSpec);
                updatedEvent._obj = updatedEventSpec;
                updatedEvent.getProperty = function (propertyName) {
                	return this._obj[propertyName];
                }
                console.log("updatedEvent is now: ", updatedEvent);

				existingEventID = updatedEvent.getID();
                existingEvent = this._events.getEvent(existingEventID);
                if (!existingEvent) {
                    console.error("Unable to find an existing event with ID: ", existingEventID);
                    return;
                }

                /*$.each(updatedEvent, function (index, value) {
                    console.log("index: ", index, ", value: ", value);
                    if (hasOwn.apply(updatedEvent, [index])) {
                        existingEvent["_" + index] = value;
                        existingEvent._obj[index] = value;
                    } else {
                        console.log("ignoring it.");
                    }
                });*/

				this._events.remove(existingEvent);
				this._events.add(updatedEvent);

				onUpdateChangeObj = {
                	"before"	: 	existingEvent,
                	"after"		: 	updatedEvent
                };

                console.log("onUpdateChangeObj.. ");
                console.dir(onUpdateChangeObj);
                this._fire("onUpdate", [onUpdateChangeObj]);


                /*console.log("Existing event is now: ", existingEvent);
                console.log("after lookup it's now: ", this._events.getEvent(existingEventID));*/
            };


            Timeline._Impl.prototype.augmentListeners = (function () {
            	var onDeleteHandler = function() {
		                console.log("onDelete called on band: ", this.band);
		                this.band._onDelete();
		            },
		            onUpdateHandler = function() {
		                console.log("onUpdate called on band: ", this.band);
		                this.band._onUpdate();
		            };

            	return function () {
		        	this.applyToBands(function() {
			            var eventListener;  // the per-band listener object; each band has a separate listener registered with the eventSource			                

			            // augment each band's listener object with the ability to react to
			            // delete and edit events
			            if (this._eventListener) {
							eventListener = this._eventListener;
			            } else { // probably should never happen
			                eventListener = {};
			                this._eventSource.addListener(eventListener);
			            }

			            eventListener.band = this;
			            eventListener.onDelete = onDeleteHandler;
			            eventListener.onUpdate = onUpdateHandler;
			        });            		
            	}
        	})();

            Timeline._Band.prototype._onDelete = function() {
                this._paintEvents();
            };  

            Timeline._Band.prototype._onUpdate = function() {
                this._paintEvents();
            };   


            isEnhanced = true;           
        };


	enhanceTimelineLibrary();

}

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

Sandbox.modules.chapter_editor = function (app) {
    var HIGHLIGHTED_INDEX_BASE_CLASSNAME = app.HIGHLIGHTED_INDEX_BASE_CLASSNAME; //"chapter-index-";



    app.addChapters = function addChapters(data, aTimeline, anOffset) {
        var band = aTimeline ? aTimeline.getBand(0) : null,
            chapters = data.chapters,
            anOffset = anOffset || 0;

        /*$("#patientNotesTemplate").tmpl(data).appendTo("#patientNotesContainer"); 

        $.each(data.chapters, function() {
            band.addDecorator(new Timeline.SpanHighlightDecorator({
                startDate   :   this.start,
                endDate     :   this.end,
                cssClass    :   "ui-state-highlight", 
                opacity     :   30
            }));
        });
        tl.paint();*/


        //  This has been moved to chapters-viewer
        // should not need try block?
        // try {
        //     $("#addChapterTabTemplate").tmpl({"chapters" : chapters, "offset" : anOffset}).appendTo("#patientNotesNav");
        //     $("#addChapterTextTemplate").tmpl({"chapters" : chapters, "offset" : anOffset}).appendTo("#patientNotes ul");

        // } catch (e) {
        //     console.error(e);
        // }
        app.renderChapters(chapters, anOffset);

        $("#patientNotesNav input:radio").slice(anOffset).each(function(index, value) {
            var chapter = chapters[index],
                centerDate = new Date(
                    (new Date(chapter.start).getTime() + 
                     new Date(chapter.end).getTime()) / 2),
                chapterIndex = index + anOffset,
                highlightIndexClass = HIGHLIGHTED_INDEX_BASE_CLASSNAME + chapterIndex,
                $labelNode = $(this.nextSibling);

            console.log("centerDate = ", centerDate);

            // since page is pre-rendered, need to remove the span that is added by calls to $().button()
            // before we can call it later to set up these buttons
            //$labelNode.text($labelNode.find("span").text());
            

            $(this).data("centerDate", centerDate)
                .data("chapterIndex", chapterIndex)
                .button()     // it's already been pre-rendered as a button
                .click(function(event) {
                    var centerDate,
                        $this;

                    $this = $(this);
                    centerDate = $(this).data("centerDate");
                    console.log("centering on date...", centerDate);
                    app.centerOnDate(aTimeline, centerDate);

                    $("#patientNotes .chapter").hide();
                    $("#"+this.id+"_text").show();
                });

            if (band) {
                band.addDecorator(new Timeline.SpanHighlightDecorator({
                    startDate   :   chapter.start,
                    endDate     :   chapter.end,
                    cssClass    :   "ui-state-highlight hidden "+highlightIndexClass, 
                    opacity     :   30
                }));                     
            }         

        });//.first().click();

        if (aTimeline) {
            aTimeline.paint();                
        }

        /*
        // since JSON is already preloaded, we know that this will always happen
        $("body").off("click", disableUI);
        disableUI = function(){};            */



        console.log("done loading chapters");
    }

}
Sandbox.modules.dao = function (app) {

	var dummyDAO = (function() {

			var createDummyFunction = function (dummyFunctionName) {
					return function() {
						console.log(dummyFunctionName, "(", arguments, ")");
					};
				},
				testDummyDAO = function() {
					for (method in dummyDAO) {
						if (dummyDAO.hasOwnProperty(method)) {
							dummyDAO[method]();
						}
					}
				},
				createDummyObj = function(dummyMethodNames) {
				var dummyObj = {};

				$.each(dummyMethodNames, function(index, dummyMethodName) {
					dummyObj[dummyMethodName] = createDummyFunction(dummyMethodName);
				});

				dummyObj.testDummyDAO = testDummyDAO;

				return dummyObj; 
			}

			return createDummyObj(["updateEvent", "addEvent", "deleteEvent", "loadEvent"]);

		})(),

		dataloader = {
			"loadData" 	: 	(function() { 
				var dataBindingsMap = {
					"events"		: 		"#eventsToLoad",
					"chapters"		: 		"#chaptersToLoad",
					"doctors"		: 		"#doctorAutocompleteData",
					"hospitals"		: 		"#hospitalAutocompleteData",
					"locations"		: 		"#locationAutocompleteData",
					"chemos" 	 	: 		"#chemoAutocompleteData"
				};

				return function(dataName) {
					var $dataNode = $(dataBindingsMap[dataName]),
						data;

					if ($dataNode.length > 0) {
						data = JSON.parse($dataNode.text());
						//$dataNode.remove();
					} 
					if (!data) {
						console.log("No data loaded for: ", dataName);
					}

					return data;
				};
			})()
		},

		expandEvents = function(events) {
			var i,
				numEvents,
				event;

			/*console.log("expanding Events...");
			if (!events || events.length <= 0) return;

			numEvents = events.length;
			for (i=0; i < numEvents; ++i) {
				event = events[i];
				if (!event.end) {
					console.log("event does not have an end, so fixing it now.  Event title: ", event.title);
					event.end = event.start;
					event.instant = true;
				}
			}
			console.log("done expanding.");*/

			return events;
		},

		parseEvents = function(events) {
			var i,
				numEvents,
				evt,
				details,
				sites;

			numEvents = events && events.length;
			for (i=0; i < numEvents; ++i) {
				evt = events[i];
				if (evt.type === "DIAGNOSIS") {
					details = evt.typeDetails;
					if (details) {
						sites = details.diseaseSites;
						if (sites) {
							details.diseaseSites = sites.split(":");
						}
					}
				}
			}
			return events;
		},		

		dao = (function() {
			var events = parseEvents(expandEvents(dataloader.loadData("events"))),
				chapters = dataloader.loadData("chapters"),
				doctors = dataloader.loadData("doctors"),
				hospitals = dataloader.loadData("hospitals"),
				locations = dataloader.loadData("locations"),
				chemos = dataloader.loadData("chemos"),
		        HELP_CHAPTER_JSON = [
	                {
	                    "title"     	:   "Help",
	                    "start"     	:   "January 4, 2013",
	                    "end"       	:   "January 17, 2013",
	                    "typeIndex"		: 	-1,
	                    "type"			: 	"CHAPTER",
	                    "typeDetails" 	: 	{		                    	
	                    		"text"      :   "This is where 'chapters' of your story show up.  Click the 'Add Chapter' button to start telling your story."
	                    }
	                }
	            ],				
				log = function(textStatus, jqXHR) {
					console.log("textStatus = ", textStatus);
					if (jqXHR) {
						console.dir("jqXHR = ", jqXHR);						
					}
				},
				successFunc = function (data, textStatus, jqXHR) {
					console.log("Successfully posted event to server.");
					log(textStatus);
					console.log("data = ", data);
				},
				genericErrorFunc = function(jqXHR, textStatus, errorThrown) {
					console.log("Error: '", errorThrown, "'; request failed.");
					log(textStatus, jqXHR);
				},
				deleteResource = function(resoureToDeleteURL, onSuccess, onFail) {
					onSuccess = onSuccess || successFunc;
					onFail = onFail || genericErrorFunc;
					$.ajax(resoureToDeleteURL, {
						type		: 	"POST",
						headers		: 	{
							"x-post-override"	: 	"DELETE"
						},
						success 	: 	onSuccess,
						error 		: 	onFail
					});
				},

				/* copied from createEventInfoUpdater function in timeline-view-module.js */
                addEvents = function(events) {
                    var i, 
                        numEvents;

                    console.log("addEvents called!");

                    if (!events) {
                        console.error("addEvents called, but with invalid events argument: ", events);
                        return;
                    }

                    for (i = 0, numEvents = events.length; i < numEvents; ++i) {
                        addEvent(events[i]);
                    }
                    console.log("done adding events.");                        
                },				
				addEvent = function (timelineLibEvent) {
					var eventToAdd,
						eventDetails,
						diseaseSites;
					console.log("dao is adding the event: ", timelineLibEvent);
					eventToAdd = timelineLibEvent._obj;
					eventToAdd.id = timelineLibEvent.getID();

					// TODO: clean up this ugly one-off reformatting code
					eventDetails = eventToAdd.typeDetails;
					if (eventToAdd.type === "DIAGNOSIS" && eventDetails) {
						diseaseSites = eventDetails.diseaseSites;
						if (diseaseSites) {
							eventDetails.diseaseSites = diseaseSites.join(":");
						}						
					} 

					console.log("sending reformatted event: ", eventToAdd , "... ");
					$.ajax("/myStory/events/", {
						type		: 	"POST",
						//mimeType 	: 	"application/json",
						contentType : 	"application/json",
						data 		: 	JSON.stringify(eventToAdd),
						dataType	: 	"json", 
						success 	: 	successFunc,
						error 		: 	genericErrorFunc
					});

					console.log("request sent.");
				},

				deleteEvent = function(eventID) {
					console.log("dao is deleting eventID: ", eventID);									
					deleteResource("/myStory/events/"+eventID);
					console.log("request sent.");
				},

				addChapter = function(chapterEvent) {
					console.log("dao is adding chapter: ", chapterEvent);

					$.ajax("/myStory/events/", {
						type		: 	"POST",
						//mimeType 	: 	"application/json",
						contentType : 	"application/json",
						data 		: 	JSON.stringify(chapterEvent),
						dataType	: 	"json", 
						success 	: 	successFunc,
						error 		: 	genericErrorFunc
					});

					console.log("request sent.");
				},

				deleteChapter = function(chapterID) {
					console.log("dao is deleting chapterID: ", chapterID);									
					deleteResource("/myStory/chapters/"+chapterID);
					console.log("request sent.");
				},

				initAutoCompletes = function() {
					console.log("setting up autocomplete for doctor fields.");
					$(".doctor").autocomplete({
						source 	: 	doctors
					});
					console.log("setting up autocomplete for hospital fields.");
					$(".hospital").autocomplete({
						source 	: 	hospitals
					});						
					console.log("setting up autocomplete for location fields.");
					$(".location").autocomplete({
						source 	: 	locations
					});	
					console.log("setting up autocomplete for chemo fields.");
					$(".chemoProtocol").autocomplete({
						source 	: 	chemos
					});						
				};

			console.log("events loaded: ", events);
			console.log("chapters loaded: ", chapters);
			if (chapters.length <= 0) {
				chapters = HELP_CHAPTER_JSON;
			}
			console.log("since no chapters were loaded, I set it to HELP_CHAPTER_JSON; chapters = ", chapters);

			console.log("doctors loaded: ", doctors);
			console.log("hospitals loaded: ", hospitals);
			console.log("locations loaded: ", locations);
			console.log("chemos loaded: ", chemos);

			return {
				//"addEvent"	: 		addEvent
                "addEvent"      :   	addEvent,
                "addEvents"     :   	addEvents,
                "onAddOne"      :       addEvents,  // for some reason, eventSource was written to retutn the single event as an array :(
                "onAddMany"     :       addEvents,
                "deleteEvent"	: 		deleteEvent,
                "addChapter"	: 		addChapter,
                "deleteChapter" : 		deleteChapter,
                "getEvents"		: 		function() {
                							return {
   												"dateTimeFormat"	: 	"Gregorian",
                								"events" 			: 	events
                							};
                						},
                "getChapters"	: 		function() {
                							return {
                								"chapters" 	: 	chapters
                							};
                						},
                "initAutoCompletes"	: 	initAutoCompletes,
                "deleteMyAccount"	: 	function() {
                							if (confirm("Are you sure you want to delete your account?\nWe cannot undo this later.")) {
                								deleteResource("/myAccount", function onSuccess() {
                									alert("Your account has been deleted.  You will now be forwarded to the demo page.");
                									location.href="/demo";
                								}, function onFail() {
                									alert("I'm sorry, but I was unable to delete your account at this time.");
                									genericErrorFunc();
                								});
                							}
                						}
			};
		})(),

		isHosted = (document.location.protocol != "file:"),
		activeDAO = dao; //isHosted ? dao : dummyDAO;

	//dummyDAO.testDummyDAO();



	app.getDAO = function() {
		return activeDAO;
	}

}
Sandbox(["common", "timeline_view", "timeline_edit", "chapter_viewer",/* "chapter_editor",*/ "dao"], function (app) {

    var CANONICAL_DATE_FORMAT = "longDate",
        ERROR_WRAPPER_EL = "li",
        ChaptersUtil = app.ChaptersUtil,
        DEFAULT_VALIDATION_CONFIG = {
            debug   :   true,   // always keep this (even in production) 
            // make this point to nothing on purpose; don't want default labels,
            //      but we do want other default behaviours 
            errorLabelContainer: "#theAbyss .hidden", //ERROR_LABEL_CONTAINER_SELECTOR,
            wrapper: ERROR_WRAPPER_EL,
            focusInvalid: false,
            highlight: function(element, errorClass, validClass) {
                console.log("highlight called");
                $(element).addClass(errorClass).removeClass(validClass);
                $(element.form).find("label[for=" + element.id + "]")
                    .addClass(errorClass);
                console.log("done highlighting");
            },
            unhighlight: function(element, errorClass, validClass) {
                console.log("unhighlight called");
                $(element).removeClass(errorClass).addClass(validClass);
                $(element.form).find("label[for=" + element.id + "]")
                    .removeClass(errorClass);
                console.log("done unhighlighting");
            }
        }, 
        makeShowErrors = function(errorHelper) {
            return function(errorMap, errorList) {
                var fieldToRemove,
                    invalidFields;

                //$(".msgBox").html("Oops!  There are a couple of <a class='errorsDialogLink'>errors</a>");
                
                if (errorList.length === 0) {
                    // this was an eager validation of a single input field, which is now valid
                    fieldToRemove = this.successList[0].name;
                    console.log("going to remove ", fieldToRemove, " from errors");
                    errorHelper.clearError(fieldToRemove);
                }
                else {
                    // should probably not be accessing internals of the validator but..
                    invalidFields = this.invalid;

                    if (errorList.length > 1) {
                        // entire form validated
                        errorHelper.setErrors(errorMap);
                    }
                    else {  // errorList.length === 1
                        // eager validation of a single field has failed or validation of an entire
                        // form with exactly one error
                        // DO NOT call errorHelper.setErrors({}) as that will replace all errors
                        $.each(errorMap, function(errorField, msg) {
                            errorHelper.setError(errorField, msg);
                        });
                    }
                }       

                // this mutates the errorMap in strange ways; do your own processing before calling it.
                this.defaultShowErrors();                          
            }
        },
                    
        tl,
        updater,
        //user = app.user,
        dao = app.getDAO(),
        chaptersUpdater,        

        eventSource = //new Timeline.DefaultEventSource();
            new Timeline.CancerEventSource(),
        eventDataURL = "json/demo_events_images_prefixes.json",
        chapterDataURL = "json/demo_chapters.json",
        					//"json/demo_chapters_longer.json",


        buildTimeline = function () {

            var startProj = SimileAjax.DateTime.parseGregorianDateTime("Sep 1 1898 00:08:00 GMT-0600"),
                endProj = SimileAjax.DateTime.parseGregorianDateTime("Nov 27 2112 00:00:00 GMT-0600"),
                theme = app.getDefaultTheme(startProj, endProj),

                compactEventPainter = Timeline.CompactEventPainter,
				compactEventPainterParams = {
                    iconLabelGap: 5,
                    labelRightMargin: 20,
                    
                    iconWidth: 40, // These are for per-event custom icons
                    iconHeight: 40,
                     
                    stackConcurrentPreciseInstantEvents: {
                        limit: 5,
                        moreMessageTemplate: "%0 More Events",
                        icon: "no-image-40.png", // default icon in stacks
                        iconWidth: 40,
                        iconHeight: 40
                    }
                },

                bandInfos = [Timeline.createBandInfo({
                    eventSource: eventSource,
                    eventPainter: compactEventPainter,
                    eventPainterParams: compactEventPainterParams,
                    //layout            :   "original",
                    date            :   "Nov 28 2006 00:00:00 GMT-0600",
                    width           :   "85%",
                    intervalUnit    :   Timeline.DateTime.MONTH,
                    intervalPixels  :   100,
                    theme           :   theme
                }), Timeline.createBandInfo({
                    eventSource     :   eventSource,
                    layout          :   "overview",
                    //eventPainter: compactEventPainter,
                    //eventPainterParams: compactEventPainterParams,                                    
                    date            :   "Nov 28 2006 00:00:00 GMT-0600",
                    width           :   "15%",
                    intervalUnit    :   Timeline.DateTime.YEAR,
                    intervalPixels  :   200,
                    theme           :   theme
                })];

                bandInfos[1].syncWith = 0;
                bandInfos[1].highlight = true;
                
                bandInfos[1].decorators = [new Timeline.SpanHighlightDecorator({
                    startDate: startProj,
                    endDate: endProj,
                    inFront: false,
                    color: "#FFC080",
                    opacity: 30,
                    /*startLabel: "Begin",
                    endLabel:   "End",*/
                    theme: theme
                })];  

           
                tl = app.createTimeline({
	                "bandInfos"     :   bandInfos,
	                "eventSource"   :   eventSource,
	                "startProj"		: 	startProj,
	                "endProj"		: 	endProj,
	                // temporarily, so that we can see images even without launching page via server
	                // switch back to tal_events.json if we properly support base image urls
	                // for file protocol
	                "eventDataURL" 	: 	eventDataURL
	            }); 	

				updater = app.makeUpdater(tl);            
        },

        // depends on dateFormat.js from http://blog.stevenlevithan.com/archives/date-time-format
        normalizeDateString = (function(theCanonicalDateStringFormat) {
            return function(aDateString) {
                return aDateString && dateFormat(aDateString, theCanonicalDateStringFormat)
            };
        })(CANONICAL_DATE_FORMAT),

        formatDateString = function(aDateString, aFormat) {
            return aDateString && aFormat && dateFormat(aDateString, aFormat);
        },

        formToEvent = function(aForm) {
            var eventBaseProperties = {
                    "start"         :       null,
                    "end"           :       null,
                    "title"         :       null,
                    "description"   :       null,
                    "pDescription"  :       null,
                    "icon"          :       null,
                    "type"          :       null,
                    "typeIndex"     :       null
                },
                event = {},
                typeDetails;

            typeDetails = formToJSON(aForm);

            // move common event properties from the typeDetails (which initially has all
            // of the event data) into the new top-level event object;
            for (key in typeDetails) {
                if (typeDetails[key] === "UNKNOWN") {
                    delete typeDetails[key];
                }
                else if (key in eventBaseProperties) {
                    // move property from the typeDetails object to the base event object
                    event[key] = typeDetails[key];
                    delete typeDetails[key];
                }
            }
            // if there are any properties still in the typeDetails object then they are 
            // type-specific properties for the event, so set a typeDetails property on the
            // event object
            if (!$.isEmptyObject(typeDetails)) {
                event.typeDetails = typeDetails;
            }

            return event;
        },

        formToJSON = function(aForm) {
            var obj = {},
                $allFields,
                $singleValueFields,
                $multiValueFields,
                nameValuePairs,
                nameAndValue,
                value,
                i;

            if (aForm) {
                /* this should have already happened, since form validation should happen before
                 * the form is converted to an event specifier

                 * $.Watermark.HideAll();
                 */

                //$allFields = $("input[type='text'], input[type='hidden'], select, textarea", aForm);
                /*$singleValueFields = $("input[type='text'], input[type='hidden'], select, textarea", aForm);
                $singleValueFields.each(function() {
                    obj[this.name] = this.value;
                });

                $multiValueFields = $("input[type='checkbox']", aForm);
                $multiValueFields.each(function() {
                    if (!this.checked) {
                        obj[this.name] = "NO";
                    }
                    else {
                        obj[this.name] = this.value;
                    }                  
                });*/

                
                try {
                    nameValuePairs = $(aForm).serializeArray();
                    console.log("serializeArrray: ", JSON.stringify(nameValuePairs));
                    for (i=0; i < nameValuePairs.length; ++i) {
                        nameAndValue = nameValuePairs[i];
                        name = nameAndValue.name;
                        value = nameAndValue.value;
                        if (value) {
                            console.log("adding property named: '", name, "' with value: '", value, "'");
                            if (obj[name]) {
                                /* we don't support array values on the server yet,
                                but we support them here; they get converted downstream */
                                if (!$.isArray(obj[name])) {
                                    // convert single value to array containing it
                                    obj[name] = [obj[name]];    
                                }
                                obj[name].push(value);
                            }
                            else {
                                obj[name] = value;
                            }                             
                        }
                       
                    }
                } catch (e) {
                    console.error("can't serializeArray.");
                }                

                /*$("input[type='text'], input[type='hidden'], select, textarea", aForm)/*.not("[type='button']")*//*.each(function() {
                    obj[this.name] = this.value;
                });
                $("input[type='checkbox']", aForm).each(function() {
                    obj[this.name] = this.checked ? "YES" : "NO";
                })*/
                // what about radio buttons

                /*
                 * In theory, this could happen here, since the form shas already been validated,
                 * and the form data extracted; however, we don't want to reset the form until
                 * the event is actually added; if for some reason there was a bug that prevented
                 * the event from being added, and there was a way to recover from that bug, we
                 * don't want to wipeout the user's data from the form just yet
                 *
                 * $.Watermark.ShowAll();
                 */

                // all events have a start!
                obj.start = normalizeDateString(obj.start);
                if (typeof obj.end === "string") {
                    obj.end = $.trim(obj.end);
                    if (obj.end.length > 0) {
                        obj.end = normalizeDateString(obj.end);
                    }
                    else {
                        delete obj.end;
                    }
                }
            }
            return obj;
        },

        fillEditDiv = function(anEvent) {
            $("#editEventDiv").find("input, select, textarea").not("[type='button']").each(function() {
                this.value = anEvent.getProperty(this.name) || "";  // need to set to "" in case where property isn't found so that we clear out any leftover value from previously edited event
            });
        },       

        addEvent = function(/* $clickEvent */ formObj) {
            var eventsJSON = {
                    "dateTimeFormat": "Gregorian"
                },
                //formObj,
                eventDataObj,
                eventID;

            /*// prevent default before doing anything that might fail
            clickEvent.preventDefault();*/

            //eventID = eventIDGenerator.makeID();
            //formObj = $clickEvent.target.form;
            eventDataObj = formToEvent(formObj);
            /*eventDataObj["eventID"] = eventID;
            eventDataObj["id"] = eventID;*/
            console.log("eventData", eventDataObj);
            eventsJSON["events"] = [eventDataObj];
            console.log("eventsJSON", eventsJSON);
            eventSource.loadJSON(eventsJSON, eventDataURL);
            tl.getBand(0).setCenterVisibleDate(SimileAjax.DateTime.parseGregorianDateTime(eventDataObj["start"]));
            
            /* saving data on the server is the responsibility of the DAO; we are not going to 
             * wait for an ack that the data is saved before allowing the user to enter/modify
             * more data, so reset the input form now, and trust the DAO to save the data
             */
            formObj.reset();
            $.Watermark.ShowAll();

            //dao.addEvent(eventDataObj);
            //dao.addEvent(eventSource.getEvent(eventID));            
        },

        updateEvent = function(clickEvent) {
            var formDataObj,
                editForm,
                updatedEvent;

            /*// prevent default before doing anything that might fail
            clickEvent.preventDefault();*/

            editForm = $("#editEventForm");
            formDataObj = formToEvent(editForm);
            /*formDataObj.text = formDataObj.title;
            if (!formDataObj.end) formDataObj.end = formDataObj.start;*/
            console.log("eventData", formDataObj);
            /*updatedEvent = new Timeline.DefaultEventSource.Event(formDataObj);
            console.log("updatedEvent: ", updatedEvent);
            eventSource.updateEvent(updatedEvent);*/
            eventSource.updateEvent(formDataObj);
            toggleAddEdit("add");
        },

        deleteEvent = function($eventObj) {
            var eventNode,
                eventID;

            // TODO: make this a dialog not a popup!!!
            if (confirm("Are you sure you want to delete this event?")) {
                $eventNode = $($eventObj.target).parents(".event");
                eventID = $eventNode[0].id;
                console.log("deleteing event with ID: ", eventID);
                eventSource.deleteEvent(eventID);

                $eventNode.remove();
                
                dao.deleteEvent(eventID);
            } 
        },

        makeErrorHelper = function (anErrorsContainerSelector, aWrapper) {
            var INVALID_DIALOG_TITLE = "Just a couple of things for you to correct",
                VALID_DIALOG_TITLE = "Looking good!",
                currentErrors = {},
                errorsContainerSelector = anErrorsContainerSelector,
                mode = "valid",

                getErrorHTML = function(anErrorField, aMsg) {
                   return "<" + aWrapper + " name='" + anErrorField + "'>" + aMsg /* + " "  + anErrorField + ERROR_WRAPPER_END_TAG*/ +"<\/" + aWrapper +">";
                },
                getErrorNode = function(anErrorField) {
                    return $(errorsContainerSelector + " " + aWrapper + "[name='"+anErrorField+"']");
                },
                toggleIfNeeded = function() {
                    if (mode === "valid" && !$.isEmptyObject(currentErrors)) {
                        mode = "invalid";

                        $(errorsContainerSelector).parent()
                            .find(".invalid").show().end()
                            .find(".valid").hide().end()
                            .parent().find(".ui-dialog-title").text(INVALID_DIALOG_TITLE);
                    }
                    else if (mode ==="invalid" && $.isEmptyObject(currentErrors)) {
                        mode = "valid";

                        $(errorsContainerSelector).parent()
                            .find(".valid").show().end()
                            .find(".invalid").hide().end()
                            .parent().find(".ui-dialog-title").text(VALID_DIALOG_TITLE);
                    }
                }; 

            $(anErrorsContainerSelector).parent().parent().find(".ui-dialog-title").text(VALID_DIALOG_TITLE);

            return {
                setError :  function (errorField, msg) {
                    var $node = getErrorNode(errorField),
                        errorHTML;

                    currentErrors[errorField] = msg;
                    if ($node.length > 0) {
                        $node.html(msg);
                    }
                    else {
                        $(errorsContainerSelector).prepend(getErrorHTML(errorField, msg));
                    }
                    toggleIfNeeded();
                },
                setErrors : function (anErrorMap) {
                    var htmlStrs = [];
                    $.extend(currentErrors, anErrorMap);
                    $.each(currentErrors, function (field, msg) {
                        htmlStrs.push(getErrorHTML(field, msg));
                    });
                    $(errorsContainerSelector).html(htmlStrs.join(""));

                    toggleIfNeeded();
                },
                clearError : function(errorField) {
                    delete currentErrors[errorField];
                    getErrorNode(errorField).remove();

                    toggleIfNeeded();
                },
            };

        },

        chapterEditor = (function makeChapterEditor(anErrorHelper) {
            var CHAPTER_NAV_SELECTOR = "#patientNotesNav",
                CHAPTER_TXT_CONTAINER_SELECTOR = "#patientNotesContainer",
                //CHECKED_RADIO_BTN_SELECTOR = "input[type='radio']:checked",
                ALL_CHAPTER_BUTTONS_SELECTOR = CHAPTER_NAV_SELECTOR + " input[type='radio']",
                TAB_TITLE_ID = "newChapterTabTitle",               
                $MODIFY_CHAPTERS_CONTROLS_DIV,
                theChapterEditor = this,
                CHAPTER_ERROR_LABEL_CONTAINER_SELECTOR = "#errorsDialog .errors";

            getChapterButtons = function() {
                return $(ALL_CHAPTER_BUTTONS_SELECTOR);
            },

            getCurrentChapterBtn = function () { 
                //return $(CHAPTER_NAV_SELECTOR).find(CHECKED_RADIO_BTN_SELECTOR);
                return getChapterButtons().filter(":checked");
            },

            getCurrentChapterID = function () {
                var $currentBtn = getCurrentChapterBtn();
                return $currentBtn.length > 0 ? currentBtn.prop("id") : "";
            },

            getChapterCount = function () {
                return getChapterButtons().length;
            }

            getChapterTextIDFromButtonID = function (aButtonID) {
                return "#"+aButtonID+"_text";
            },

            getNextButton = function($thisButton) {
                return $thisButton.next().next();
            },
            getPrevButton = function($thisButton) {
                return $thisButton.prev().prev();
            },            

            deleteChapter = function($eventObj) {
                var $patientNotesNav = $(CHAPTER_NAV_SELECTOR),
                    $patientNotesContainer = $(CHAPTER_TXT_CONTAINER_SELECTOR),
                    $chapterTextDiv,
                    $chapterSelectorButton,
                    currentChapterID,
                    //eventID,
                    $buttonToSelect;

                $eventObj.preventDefault();

                $chapterSelectorButton = getCurrentChapterBtn();
                if ($chapterSelectorButton.length <= 0) {
                    console.error("User is trying to delete a chapter, but none is selected.");
                    return;
                }
                currentChapterID = $chapterSelectorButton.prop("id");
                if (currentChapterID.length <= 0) {
                    console.error("User is trying to delete a chapter, but none is selected.");
                    return;
                }

                console.log("\n\n\n\n currentChapterID: ", currentChapterID);
                var chapterID = $chapterSelectorButton.data("chapterID");
                console.log("$chapterSelectorButton.data(\"chapterID\"): ", $chapterSelectorButton.data("chapterID"), "\n\n\n\n ");

                // TODO: make this a dialog not a popup!!!
                if (confirm("Are you sure you want to delete this chapter?")) {

                    $chapterTextDiv = $(getChapterTextIDFromButtonID(currentChapterID), $patientNotesContainer);

                    $buttonToSelect = getNextButton($chapterSelectorButton);
                    if ($buttonToSelect.length <= 0) {
                        $buttonToSelect = getPrevButton($chapterSelectorButton);
                    }

                    $chapterSelectorButton
                        .hide()
                        .button("destroy")
                        .next().remove()
                        .end().remove();

                    $chapterTextDiv.remove();

                    if ($buttonToSelect.length > 0) {
                        //$buttonToSelect.find("span").click();
                        $buttonToSelect.click();
                    }
                    else {
                        $(".deleteEventTrigger", $MODIFY_CHAPTERS_CONTROLS_DIV).hide();
                    }

                    
                    dao.deleteChapter(chapterID);
                } 
            },  

            createChapter = function(formObj) {
                var chaptersJSON = {},
                    chapterDataObj,
                    eventID,
                    currentChapters = getChapterButtons(),
                    numChapters = (currentChapters && currentChapters.length) || 0;

                /*// prevent default before doing anything that might fail
                clickEvent.preventDefault();*/

                //eventID = eventIDGenerator.makeID();
                //formObj = $clickEvent.target.form;
                chapterDataObj = formToEvent(formObj);
                //chapterDataObj.id = "chapter-index-" + numChapters;
                chapterDataObj.id = ChaptersUtil.getNewChapterID();
                // need this for now; should try to standardize on just one name for this field;
                //chapterDataObj.text = chapterDataObj.description;

                /*chapterDataObj["eventID"] = eventID;
                chapterDataObj["id"] = eventID;*/
                console.log("chapter data: ", chapterDataObj);
                chaptersJSON["chapters"] = [chapterDataObj];
                console.log("chaptersJSON", chaptersJSON);

                // TODO: figure out  - does chaptersJSON need to be an array?  Isn't it only one chapter?
                //app.addChapters(chaptersJSON, tl, numChapters);
                chaptersUpdater.addChapters(chaptersJSON, tl, numChapters);
                
                /* saving data on the server is the responsibility of the DAO; we are not going to 
                 * wait for an ack that the data is saved before allowing the user to enter/modify
                 * more data, so reset the input form now, and trust the DAO to save the data
                 */
                formObj.reset();
                $("#newChapterTabTitle").val(null);
                $.Watermark.ShowAll();

                // there is now at least one chapter so show the 'delete chapter' button
                // (it may have been hidden if there were zero chapters at some point)
                if ($(".addEventFormLink", $MODIFY_CHAPTERS_CONTROLS_DIV).not(":hidden").length > 0) {
                    // but only if the add chapter button is showing!
                    $(".deleteEventTrigger", $MODIFY_CHAPTERS_CONTROLS_DIV).show();    
                }

                getChapterButtons().last().click();

                
                dao.addChapter(chapterDataObj);                
            },  

            enableAddingChapters = function() {
                var CHAPTER_ERRORS_CONTAINER_SELECTOR = "#patientNotesContainer .msgBox",   
                    validationConfig = $.extend(
                        {}, 
                        DEFAULT_VALIDATION_CONFIG, 
                        {
                            errorContainer: CHAPTER_ERRORS_CONTAINER_SELECTOR,
                            messages: {
                                "title"         :   "Every chapter has to have a title",
                                "start"         :   "Every chapter has to have a beginning.. (start date)",
                                "end"           :   "Every chapter has to have an end. (end date) ",
                                "description"   :   "Every chapter needs to tell a story!  (description)"
                            },
                            showErrors      :   makeShowErrors(makeErrorHelper(CHAPTER_ERROR_LABEL_CONTAINER_SELECTOR, ERROR_WRAPPER_EL))
                        }
                    ),

                    $patientNotesContainer = $(CHAPTER_TXT_CONTAINER_SELECTOR),

                    createAddChapterForm = function() {
                        //$("#addEventFormControlsTemplate").tmpl({eventType: ["Chapter", "Chapter"]}).appendTo("#patientNotesHeader");
                        $("#modifyChaptersControlsTemplate").tmpl().appendTo("#patientNotesHeader");
                        $MODIFY_CHAPTERS_CONTROLS_DIV = $(".modifyChaptersControls");

                        $("#addEventFormTemplate").tmpl({eventType: ["Chapter", "Chapter", "CHAPTER"]}).appendTo("#patientNotes");
                        //$("#addChapterFormTemplate").tmpl().appendTo("#patientNotes");
                        // extra template needed for the chapters GUI only
                        $("#addNewChapterTabTemplate").tmpl({tabTitleID : TAB_TITLE_ID})
                            .css("display", "none")
                            .prependTo("#patientNotesNav");
                    },
                    addValidator = function() {
                        var $this = $(this);
                        //$(CHAPTER_ERRORS_CONTAINER_SELECTOR).html("Oops!  There are a couple of <a class='errorsDialogLink'>errors</a>");

                        validationConfig.submitHandler = function(validatedFormObj) {
                            theChapterEditor.createChapter(validatedFormObj);
                        }
                        $this.validate(validationConfig);
                    },
                    showAddChapterForm = function($event) {
                        var $addEventForm;

                        $event.preventDefault();

                        $addEventForm = $( ".addEventForm", $patientNotesContainer);
                        $addEventForm.prev().slideUp();

                        $addEventForm.slideDown();
                        
                        $(".addEventFormLink, .deleteEventTrigger", $MODIFY_CHAPTERS_CONTROLS_DIV).hide();
                        $(".cancelButton", $MODIFY_CHAPTERS_CONTROLS_DIV).show();

                        $("#l_"+TAB_TITLE_ID).show();
                    },
                    hideAddChapterForm = function($event) {
                        var $this = $(this),
                            $addEventForm;

                        $addEventForm = $( ".addEventForm", $patientNotesContainer);
                        $addEventForm.prev().slideDown();
                        $addEventForm.slideUp();

                        $(CHAPTER_ERRORS_CONTAINER_SELECTOR).hide();
                        $(".cancelButton", $MODIFY_CHAPTERS_CONTROLS_DIV).hide();
                        $(".addEventFormLink, .deleteEventTrigger", $MODIFY_CHAPTERS_CONTROLS_DIV).show();                    

                        $("#l_"+TAB_TITLE_ID).hide();
                    };
                        
                createAddChapterForm();
                $("form").each(addValidator);
                $("#patientNotesContainer").on("click", "a.errorsDialogLink", function($event) {
                    $event.preventDefault();

                    $("#errorsDialog").dialog("open");
                });

                $modifyChaptersControls = $(".modifyChaptersControls");
                $(".addEventFormLink", $modifyChaptersControls).button().click(showAddChapterForm);
                $(".cancelButton", $modifyChaptersControls).button().click(hideAddChapterForm);
                $(".deleteEventTrigger", $modifyChaptersControls).button().click(deleteChapter);
            }

            return {
                "deleteChapter"     :   deleteChapter,
                "createChapter"     :   createChapter,
                "init"              :   enableAddingChapters
            };
        })(/*errorHelper*/),


        cancelEditEvent = function(clickEvent) {

            /*// prevent default before doing anything that might fail
            clickEvent.preventDefault();*/
            toggleAddEdit("add");
        },



        enableAddingEvents = function() {    
            var eventValidationConfig = $.extend(
                    {},
                    DEFAULT_VALIDATION_CONFIG,
                    {
                        submitHandler   :   addEvent,
                        /*errorContainer:  {filled in when setting up validators, based on eventType } */
                        messages: {
                            "title"  :   "Every medical event has to have a title",
                            "start"  :   "Every medical event has to have a beginning.. (start date)",
                            "description" : "This medical event needs to include a description!  (description)"
                        }
                    }
                ),
                formTmplConfig = {
                    suffix: "_top" 
                    //intoDOM: appendToFunc,
                },
                eventTypes = [
                    ["Diagnosis", "Diagnosis", "DIAGNOSIS"],
                    ["Surgery", "Surgery", "SURGERY"],
                    ["Chemo", "Chemotherapy", "CHEMO"],
                    ["Radiation", "Radiation", "RADIATION"],
                    ["Immuno", "Cell Therapy", "IMMUNO"],
                    ["Test", "Test", "TEST"]
                ],
                locations = [
                    "#eventInfoTabs-diagnosis > .eventTypeVisibilityToggle",
                    "#eventInfoTabs-surgery > .eventTypeVisibilityToggle",
                    "#eventInfoTabs-chemotherapy > .eventTypeVisibilityToggle",
                    "#eventInfoTabs-radiation > .eventTypeVisibilityToggle",
                    "#eventInfoTabs-immunotherapy > .eventTypeVisibilityToggle",
                    "#eventInfoTabs-test > .eventTypeVisibilityToggle"
                ],

                createAddEventForm = function(index, eventTypeKeyAndStr) {
                    var $location = $(locations[index]),
                        $tab = $location.parent(),
                        validationConfig,
                        eventTypeKey = eventTypeKeyAndStr[0],
                        errorsContainerSelector = ".eventTypeContent." + eventTypeKey + " .msgBox",
                        errorsDialogSelector = "#errorsDialog"+eventTypeKey,
                        errorMsgsContainerSelector = errorsDialogSelector + " .errors";
                    
                    formTmplConfig.eventType = eventTypeKeyAndStr;

                    $("#addEventFormControlsTemplate").tmpl(formTmplConfig).appendTo($location);
                    $("#addEventFormTemplate").tmpl(formTmplConfig).appendTo($location);
                    //$("#addEventFormControlsTemplate").tmpl(formTmplConfig).insertAfter($location);
                    //$("#addEventFormTemplate").tmpl(formTmplConfig).insertAfter($location);

                    validationConfig = $.extend(
                        {
                            errorContainer  :   errorsContainerSelector,
                            showErrors      :   makeShowErrors(makeErrorHelper(errorMsgsContainerSelector, ERROR_WRAPPER_EL))
                        },
                        eventValidationConfig/*,
                        anEventTypeValidationConfig*/
                    );

                    $("#errorsDialogTemplate").tmpl(formTmplConfig).appendTo($tab);
                    $location.find("form").validate(validationConfig);

                    // should really be just one function at the tabs container level..
                    $tab.on("click", "a.errorsDialogLink", function($event) {
                        $event.preventDefault();

                        //$(".dialog", $tab).dialog("open");
                        $(errorsDialogSelector).dialog("open");
                    });                    
                },

                showAddEventForm = function($event) {
                    var $this = $(this),
                        $container = $this.closest(".eventTypeContent");

                    $event.preventDefault();

                    //$( ".addEventForm", $this.parent().parent() ).slideDown();
                    $container.find(".addEventForm").slideDown();
                    $this.hide();
                    $container.find(".cancelButton").show();
                    //$this.hide().next().show();
                },

                hideAddEventForm = function() {
                    var $this = $(this),
                        $container = $this.closest(".eventTypeContent");

                    //$(".addEventForm", $this.parent().parent() ).slideUp();
                    //$this.hide().closest(".eventTypeVisibilityToggle").find(".addEventFormLink").show();
                    $container.find(".addEventForm").slideUp();
                    $this.hide();
                    $container.find(".addEventFormLink").show();

                    //$this.hide().prev().show();
                };

            // Modify the DOM - add forms and buttons needed for adding medical events and chapters
            $.each(eventTypes, createAddEventForm);


            // validate ALL forms
            // NOTE: this cannot happen before all the templating is done and the forms are
            // inserted into the DOM
            //$("form").each(addValidator);

            // setup behaviours for newly added links and buttons used to add events

            /* these should be set once, at the tabs container level */

            // button/link for showing an add event/chapter form
            $(".addEventFormLink").not(".Chapter")
                .button()
                .click(showAddEventForm);
            

            // button for cancelling the add event process and hiding the form
            $(".cancelButton").not(".Chapter")
                .button()
                .click(hideAddEventForm);
        },        

        setupEventInputValidation = function() {
            $.validator.setDefaults(DEFAULT_VALIDATION_CONFIG);
            /*$.validator.addMethod("dateRange", 
                function dateRangeValidator( value, element, param ) {
                    
                    return this.optional(element) || 
                }, 
                [message]
            );*/

            $.validator.addMethod("name", 
                function nameValidator( value, element, param) {
                    // simple charatcter class from "Javascript the Good Parts" + the '.' chracter for inputs including things like "Dr."
                    return this.optional(element) || /[A-Za-z\u00C0-\u1FFF\u2800-\uFFFD\.]*/.test(value);
                },
                "Please enter a name.  (e.g. 'Dr. John Smith III')"
            );

            $.validator.addClassRules("maxLength-10", {
                maxlength   :   10
            });           
        },

        setupWatermarks = function() {
            $("input[name='title']")
                .not(".Chapter").Watermark("Please enter a name for this event")
            .end()
                .filter(".Chapter").Watermark("Please enter a title for this chapter");
            $("input[type='text'][name!='title'][name!='start'][name!='end'][id!='newChapterTabTitle']").Watermark("(optional)");

            $("#newChapterTabTitle").Watermark("Tab Title");
        },

        initDatePickers = function(defaults) {
            var fixDatePickerStupidity = function () {
                /* remove the zIndex value set by the OTB showDatePicker function because it's stupid;
                 * the OTB functinon relies on a function called zIndex, which is used by other
                 * code so I don't want to change it.  
                 * that zIndex function will look for a z-index on the specified element (in this case,
                 * the form input), and move up the DOM tree until it finds one. 
                 * The reason why it fails here is because the inputs on the form are statically 
                 * positioned, and the z-index function ignores those elements cuz z-index doesn't make
                 * sense for those elements.  That's fine, but then the input div shouldn't be setting
                 * it's z-index based on those guys.
                 */                
                $("#ui-datepicker-div").css("zIndex", "");
            };

            $.datepicker.setDefaults(defaults);

            $("input[name='start'], input[name='end']").each(function() {
                $(this)
                    .after('<span class="datePicker" style="float: right;"></span>')
                    .datepicker()
                    .on("click focus", fixDatePickerStupidity)
                    .next().on("click focus", fixDatePickerStupidity);
            });
        },

        makeTitlesSelectEventsInTL = function($event) {
            var targetEventID;

            $event.preventDefault();

            targetEventID = this.href || "";
            if (targetEventID.indexOf("/") >= 0) {
                targetEventID = targetEventID.substring(targetEventID.lastIndexOf("/") + 1);
            }
            app.centerOnEvent(tl, targetEventID);
            updater.highlight(targetEventID); 
        },

        makeControlsToggle = function controlsToggle(containerClass, controlsClass, displayVal) {
            return function($UIevent) {                
                var $element = $($UIevent.target);

                if (!$element.hasClass(containerClass)) {
                    $element = $element.parents("."+containerClass)[0];
                }

                $("."+controlsClass, $element).css("display", displayVal);
            }
        },

        /*showChapterControls = makeControlsToggle("chapter", "chapterControls", "inline-block"),
        hideChapterControls = makeControlsToggle("chapter", "chapterControls", "none"),*/
        showEventControls = makeControlsToggle("event", "eventControls", "inline-block"),
        hideEventControls = makeControlsToggle("event", "eventControls", "none");


    $(function() {
        //var saveHelper = createSaveHelper("#header");
            // set above
            //dao = app.getDAO();

        //dao.attachSaveHelper("#header");

        /*saveHelper.setState("saving");
        setTimeout(function() {
            alert("switching from saving to saved.");
            saveHelper.setState("all-saved");
        }, 5000);*/

        // DEPENDANCY: themer.js
        app.initThemer();
        // END DEPENDANCY: themer.js
        
        // DEPENDENCY: jQueryUI.js
        $(".tabs").tabs();

        // END DEPENDENCY jQueryUI.js


        // DEPENDENCY: timeline js
        
        // this should probably be merged with augmentListeners()
        eventSource.addListener(app.createEventInfoUpdater(".eventTypeContent ul"));

        buildTimeline();
        // set up tl for delete and edit events
        tl.augmentListeners();


        $.when(dao.getEvents()).then(function(data) {
            var numEvents;
            console.log("events data loaded: ", data);
            //buildTimeline();
            $(window).resize(app.getResizer(tl));

            eventSource.loadJSON(data, "/");
            tl.layout();         

            try {
                numEvents = data.events.length;
            } catch (e) {
                console.warn("attempting to access data.events.length caused exception; setting numChapters to 0");
                numEvents = 0;
            }
            Timeline.EventUtils.counterInit(numEvents);
            //eventsLoaded.resolve();  
            
            /*app.loadChapters(chaptersJSON, tl);
            app.enableChapterNav($("#patientNotesNav"));*/

            // only add DAO as a listener after initial events have been loaded
            eventSource.addListener(dao);        
        });

        $.when(dao.getChapters()).then(function(data) {
            var numChapters;

            console.log("chapters data loaded: ", data);

           /* app.loadChapters(data, tl);
            app.enableChapterNav($("#patientNotesNav"));*/
            //chaptersUpdater = app.makeChaptersUpdater($("#patientNotesNav"));
            chaptersUpdater = app.makeChaptersUpdater($("#patientNotesNav")),
            chaptersUpdater.addChapters(data, tl);

            try {
                numChapters = data.chapters.length;
            } catch (e) {
                console.warn("attempting to access data.chapters.length caused exception; setting numChapters to 0");
                numChapters = 0;
            }
            ChaptersUtil.counterInit(numChapters);

            //chaptersLoaded.resolve();
        });


        $("#eventInfoBox")
            .on("click", ".eventTitle a", makeTitlesSelectEventsInTL)
            .on("mouseenter", ".event", showEventControls)
            .on("mouseleave", ".event", hideEventControls)
            .on("click", ".eventTypeContent .deleteEventTrigger", deleteEvent);
        // endableDeletingEvents() ? :)
        //$("#eventInfoBox").on("click", ".eventTypeContent .deleteEventTrigger", deleteEvent);

        $("#patientNotes")
            /*.on("mouseenter", ".chapter", showChapterControls)
            .on("mouseleave", ".chapter", hideChapterControls)*/
            .on("click", ".deleteEventTrigger", deleteChapter);

        setupEventInputValidation();
        enableAddingEvents();
        //$("#updateEvent").click(updateEvent);
        //$("#cancelEditEvent").click(cancelEditEvent); 

        $(window).resize(app.getResizer(tl));
        
        // END DEPENDENCY Timeline.js


        // DEPENDENCY: Timeline.js, JSON files
        var updateVisFunc = app.makeVisibilityUpdater(app.makeUpdater(tl));
        /*$("#eventInfoTabs").on("click", "input:radio", function() {
            updateVisFunc.call(this);
        }).find("input:radio").button();*/
        $(".eventTypeContent input:radio").button();
        $(".eventTypeVisibilityToggle").on("click", "input:radio[name$='Toggle']", function() {
            //app.updateEventTypeVis(this);
            //updateVisFunc.call(this);

            // this needs to be an arg here, not the context
            updateVisFunc(this);
        }); 
       

        tl.layout();

        enableAddingChapters();
/*        app.addChapters(chaptersJSON, tl);
        app.enableChapterNav($("#patientNotesNav"));*/


        app.setupDialogs({
            autoOpen: false,
            width: 550,
            resizable: false
            /* horribly ugly right now

            buttons: {
                Ok: function() {
                    $( this ).dialog( "close" );
                }
            }
            */
        });        

        dao.initAutoCompletes();

        //setupWatermarks();
        initDatePickers({
            altField    :   $(this).prevAll(".date")[0],
            altFormat   :   "MM d, yy",
            showOn      :   "both",
            buttonImage :   "/images/calendar.gif",
            buttonImageOnly     :   true,
            changeMonth :   true,
            changeYear  :   true  
        });

        // make sure watermarks are not confused for user input during validation
        // by removing them;
        // the watermarks will be restored after successful validation; (maybe this should
        //   be changed so that it's restored in other situations as well)
        $(".addEvent").click(function beforeValidate() {
            $.Watermark.HideAll();
        }); 

        // maybe this will rid the calendar bug once and for all?
        $("#ui-datepicker-div").css("zIndex", "");

        /*(function (box) {
            var nextFormPart = function($UIevent) {
                var thisFormPart = $(this).parents(".formPart").first(),
                    nextFormPart = thisFormPart.next(".formPart");
                
                thisFormPart.hide("slide");
                nextFormPart.show("drop");
            },
            prevFormPart = function($UIevent) {
                var thisFormPart = $(this).parents(".formPart").first(),
                    prevFormPart = thisFormPart.prev(".formPart");
                
                prevFormPart.show("drop");
                thisFormPart.hide("slide");                
            };

            box.on("click", ".nextFormPartButton", nextFormPart)
                .on("click", ".prevFormPartButton", prevFormPart)
                .find(".formPart").not(":first").hide();

        })($(".slidingBox"));*/
    
        //$(".deleteEventTrigger").button();

        $("form.Chapter #newEventTitle").on("keyup", function() {
            var numKeep = 12;
            $("#newChapterTabTitle").val(app.clipText(this.value, numKeep));
        });

        /*
         * should not need to cache on this page
        // this file is included in both Canvas and MyStory, so load creator in case you hit canvas first
        app.doPreFetch(["/js/all-creator-beta.js", "/js/all-demo-beta.js", "/js/all-play-beta.js", "js/all-viewer-beta.js"]);
        */



        $("#deleteAccountButton").on("click", dao.deleteMyAccount);
    });
});

/*window.Sandbox = function() {
	alert("Sandbox has completed it's work and can no longer be used.")
};*/
(function() {
	//console.log("unlocking UI if it's locked...");
	if (window.isUIDisabled) {
		console.log("UI is disabled.");
		$("body").off("click", disableUI);	
		console.log("UI is now enabled.");
	}
	else {
		console.log("UI is not disabled.");
	}
})();
