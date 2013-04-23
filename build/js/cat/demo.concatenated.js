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

Sandbox("common", "timeline_view", "chapter_viewer", function (app) {

    var tl,
        updater,

        eventSource = //new Timeline.DefaultEventSource();
            new Timeline.CancerEventSource(),
        eventDataURL = "json/demo_events_images_prefixes.json",
        chapterDataURL = "json/demo_chapters.json",
        					//"json/demo_chapters_longer.json",

        eventsJSON = {
           "dateTimeFormat" :   "Gregorian",
           "extension"  :   {
                "namespace" :   "My_Cancer_Story"
           },
           "events": [
            {
                "start"             :       "Fri Sep 8 2006 10:00:00 ",
                "end"               :       "Fri Sep 8 2006 11:00:00 ",
                "eventID"           :       "001",
                "id"                :       "001a",
                "title"             :       "Abdominal Ultrasound",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "ULTRASOUND"
                },
                "description"       :       "Up to 3 masses detected in and around the liver.",
                "pDescription"      :       "An ultrasound was performed to try to figure out what was wrong with me.  The technician was very concerned after he performed it and told me to go see my GP immediately.  My GP wrote me a note to have me admitted urgently into the hospital ER.  On the drive down to the hospital I looked at the report from my ultrasound.  The report said that there were up to 3 masses in and around my liver.",
                "details"           :       {
                    "typeDescription"       :       "test"  
                }
            }, {
                "id"                :       "e1",
                "start"             :       "Fri Sep 8 2006 23:00:00",
                "title"             :       "CT scan",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "CT_SCAN"
                },
                "description"       :       "CT scan demonstrated 8cm tumor infiltrating the common bile duct.  Further testing needed to determine tumor type.  \\n\\nPossible diagnosis: \\n\\nCholangiocarcinoma \\nHepatocellular Carcinoma \\nFibrolamellar Hepatocellular Carcinoma \\nFocal Nodular Hyperplasia",
                "pDescription"      :       "After a few hours in the ER, they took me upstairs to do a CT scan.  Afterwards they told me that there was an 8cm tumor blocking the bile duct - a tube that connects to the liver.  They were not sure if it was a liver tumor that grew into the bile duct or a bile duct tumor that grew into the liver."
            }, {
                "id"                :       "e2",
                "start"             :       "Mon Sep 11 2006 10:00:00",
                "title"             :       "CT scan",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "CT_SCAN"
                }
            }, {
                "id"                :       "e3",
                "start"             :       "Tue Sep 12 2006 10:00:00",
                "title"             :       "Ultrasound",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "ULTRASOUND"
                }
            }, {
                "id"                :       "e4",
                "start"             :       "Tue Sep 11 2006 11:00:00",
                "title"             :       "MRI",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "MRI"
                }
            }, {
                "id"                :       "e5",
                "start"             :       "Thu Sep 14 2006 15:00:00",
                "title"             :       "Stent + Percutaneous Drain implanted",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "ULTRASOUND"
                }
            }, {
                "id"                :       "e6",
                "start"             :       "Thu Sep 14 2006 15:00:00",
                "title"             :       "Fine Needle Biopsy",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "ULTRASOUND"
                }
            }, {
                "id"                :       "e7",
                "start"             :       "September 15, 2006",
                "end"               :       "September 15, 2006",
                "title"             :       "First Diagnosis",
                "durationEvent"     :       false,
                "description"       :       "After all the tests were completed, I was diganosed with Fibrolamellar Hepatocellular Carcinoma.  I had an 8cm tumor in my liver, blocking the bile duct.",
                "typeIndex"         :       0,
                "type"              :       "DIAGNOSIS",
                "typeDetails"       :       {
                    "age"                       :       25,
                    "stage"                     :       "II ?",
                    "metastatic"                :       "no",
                    "diseaseSites"              :       ["liver"],
                    "lymphNodes"                :       "no",
                    "macroVascularInvasion"     :       "no",
                    "microVascularInvastion"    :       "yes"                    
                }
            }, {
                "id"                :       "e8",
                "start"             :       "Wed Nov 29 2006 00:08:00",
                "end"               :       "Nov 29 2006 00:16:00",
                "title"             :       "Liver Resection",
                "durationEvent"     :       false,
                "description"       :       "En bloc resection of the liver. 60% of the liver removed as well as the gall bladder, the entire biliary tree and a 10cm x 9cm x 8cm tumor.  Percutaneous drain and stent also removed.",
                "pDescription"      :       "My surgical oncologist, Dr. Newton, performed an 8 hour surgery.  She removed 60% of my liver, and also took out my gall bladder and all of the tubing connecting the liver and gall bladder to the other organs.  She then surgically attached the leftover liver to my intestines.  She also cut out a piece of my diaphragm because the liver tumor was abutting it.  Finally, she took out the tube that they put in my abdomen earlier to bypass the blocked bile duct and allow the bile to drain.\\n\\nFinally, she removed three lymph nodes, which were all negative (no cancer in them).\\n\\nShe told me that she got all of the cancer out and that hopefully it didn't have a chance to spread before the surgery.",
                "typeIndex"         :       1, 
                "type"              :       "SURGERY",
                "typeDetails"       :       {
                    "surgeon"                   :       "Dr. Melissa Newton",
                    "resident"                  :       ["Dr. Shamir", "Dr. Betzal"],
                    "hospital"                  :       "A Metro Hospital",
                    "location"                  :       "Toronto, ON, Canada",
                    "recoveryTimeHospital"      :       "7 days",
                    "recoveryTimeHome"          :       "about 3 months"                    
                }
            }, {
                "id"                :       "e9",
                "start"             :       "Sep 17 2007",
                "title"             :       "Recurrence",
                "description"       :       "There were two large tumors, one in my chest and one in my diaphragm.  There were also enlarged lymph nodes throughout my abdomen.",
                "typeIndex"         :       0,
                "type"              :       "DIAGNOSIS",
                "typeDetails"       :       {
                    "age"                       :       26,
                    "stage"                     :       "IV",
                    "metastatic"                :       "yes",
                    "diseaseSites"              :       ["diaphragm", "chest", "lymph nodes"],
                    "lymphNodes"                :       "yes",
                    "vascularInvasion"          :       "no",
                    "microVascularInvastion"    :       "unknown"
                }
            }, {
                "id"                :       "e10",
                "start"             :       "Oct 20 2007 00:00:00",
                "end"               :       "Oct 30 2007 00:00:00",
                "title"             :       "Nexavar (Sorafenib)",
                "durationEvent"     :       true,
                "description"       :       "Nexavar pills BID.",   
                "pDescription"      :       "I tried Nexavar for 10 days but had really bad side effects.\\n\\n  For a week I had terrible stomach cramps.  When that finally went away, I got a full body rash, my feet were so swollen I could barely get my shoes on and it hurt like hell to stand up.  Worst of all, my red blood cell counts were way off and I had to see a hematologist to make sure I wasn't in any danger from the chemo.\\n\\nIt took 2 weeks of prednisone for me to recover.  The medical oncologist wanted to try again at 1/8 the original dose, but I wanted to try a different treatment.",        
                "typeIndex"         :       2,
                "type"              :       "CHEMO",
                "typeDetails"       :       {
                    "result"                    :       "Progressive Disease",
                    "isRecommended"             :       "NO",
                    "oncologist"                :       "-- censored --",
                    "duration"                  :       "10 days",
                    "sideEffects"               :       ["Full Body Rash", "Extreme Swelling of the Feet", "Pain When Standing", "Elevated Red Blood Cell Counts", "Green Growths on My Fingers", "Hair Loss", "Fatigue"]
                }
            }, {
                "id"                :       "e11",
                "start"             :       "Dec 15 2007 00:08:00",
                "end"               :       "Dec 15 2007 00:16:00",
                "title"             :       "Diaphragm & Lymph Nodes Resection",
                "durationEvent"     :       false,
                "typeIndex"         :       1,
                "type"              :       "SURGERY",
                "description"       :       "Resection of enlarged lymph node from diaphragm.  Disection of diaphragm to access thoracic mass, completely excised.  Diaphragm repair.",
                "pDescription"      :       "Dr. Tremblay performed an 8 and a 1/2 hour surgery.  He removed an enlarged lymph node from my diaphragm, then cut a hole in my diaphragm so that he could get into my chest cavity where the other tumor was.  He then removed a mass from my chest.  \\n\\n He used the same incision site as last time so there is no new scar.  He also used a glue to close up the wound instead of staples, so the scar was much thinner.",
                "typeDetails"       :       {
                    "surgeon"                   :       "Dr. Tremblay",
                    "hospital"                  :       "M.D. Anderson Cancer Center",
                    "location"                  :       "Houston, TX, USA",
                    "recoveryTimeHospital"      :       "7 days",
                    "recoveryTimeHome"          :       "2 weeks"                    
                }
            },  {
                "id"                :       "e12",
                "start"             :       "Jan 28 2008 00:00:00",
                "end"               :       "Dec 08 2008 00:00:00",
                "title"             :       "5FU and Interferon Alpha",
                "durationEvent"     :       true,
                "description"       :       "3 week cycles of continuous 5FU infusion (2525mg/week) with subcutaneous injections of 8 million units of Interferon Alpha 3x weekly.",
                "pDescription"      :       "Cycles would last 3 weeks, with one week off between them.\\n\\nThe 5FU was administered with a bottle around the size of a baby bottle full of 5FU, which would slowly infuse into the body over the course of the week. At the end of each week, the empty bottle was replaced with a full one. Three bottles over three weeks would constitute one round.\\n\\nThe Interferon Alpha is administered with injections into fatty tissue - either in the belly or the thigh.",
                "typeIndex"         :       2,
                "type"              :       "CHEMO",
                "typeDetails"       :       {
                    "result"            :       "Partial Response",
                    "isRecommended"     :       "YES",
                    "duration"          :       "9 months",
                    "oncologist"        :       "-- censored --",
                    "sideEffects"       :       ["Extreme Fatigue", "Mouth Sores", "Thrush", "Muscle Aches", "Headaches", "Difficulty Thinking/Focusing", "Elevated Heart Rate (at the beginning of rounds 1 and 2 only)"]                    
                }
            },  {
                "id"                :       "e13",
                "start"             :       "Dec 09 2008 00:00:00",
                "end"               :       "Feb 28 2009 00:00:00",
                "title"             :       "Unmatched Donor Lymphocyte Infusions",
                "durationEvent"     :       true,
                "description"       :       "Injected with T-cells and Natural Killer cells from various unmatched donors.  Small non-chemotherapeutic doses of Avastin and Erbitux were administered to enhance the donated cells' ability to target the tumors.",
                "pDescription"      :       "Injected with T-cells and Natural Killer cells from various unmatched donors.  Small non-chemotherapeutic doses of Avastin and Erbitux were administered to enhance the donated cells' ability to target the tumors.",
                "typeIndex"         :       4,
                "type"              :       "IMMUNO",
                "typeDetails"       :       {
                    "result"            :       "Stable Disease",
                    "duration"          :       "3 months"                      
                }
            },  {
                "id"                :       "e14",
                "start"             :       "Apr 09 2009 00:00:00",
                "end"               :       "June 28 2009 00:00:00",
                "title"             :       "Three different cancer cell vaccines administered.",
                "durationEvent"     :       true,
                "description"       :       "Three different cancer 'vaccines' were prepared and administered. White blood cells were taken from my brother, who is an 80% match for me.\\n\\n Vaccine #1: My brother's T-cells and Natural Killer cells were mixed with my frozen tumor in a lab and then infused into me, along with IL2, Avastin and Erbitux.  \\nVaccine #2: My brother's dendritic cells were exposed to my frozen tumor and then infused into me along with IL2, Avastin and Erbitux.  \\nVaccine #3: My own T-cells were extracted and mixed with my brother's dendritic cells and my frozen tumor in the lab, and then infused into my body.",
                "pDescription"      :       "Three different cancer 'vaccines' were prepared and administered. White blood cells were taken from my brother, who is an 80% match for me.\\n\\n Vaccine #1: My brother's T-cells and Natural Killer cells were mixed with my frozen tumor in a lab and then infused into me, along with IL2, Avastin and Erbitux.  \\nVaccine #2: My brother's dendritic cells were exposed to my frozen tumor and then infused into me along with IL2, Avastin and Erbitux.  \\nVaccine #3: My own T-cells were extracted and mixed with my brother's dendritic cells and my frozen tumor in the lab, and then infused into my body.",
                "typeIndex"         :       4,
                "type"              :       "IMMUNO",
                "typeDetails"       :       {
                    "result"            :       "Stable Disease",
                    "duration"          :       "3 months"              
                }
            },  {
                "id"                :       "e15",
                "start"             :       "Jun 28 2009 00:00:00",
                "end"               :       "Oct 29 2009 00:00:00",
                "title"             :       "Second Remission?!?  Impossible cure?",
                "durationEvent"     :       true,
                "description"       :       "Only sign of cancer was a couple of enlarged lymph nodes that initially shrunk and then remained stable during chemotherapy and cell therapy.  We thought and hoped the immunotherapy might have been curative"
            }, {
                "id"                :       "e16",
                "start"             :       "Oct 29 2009",
                "title"             :       "Lymph Nodes Growing Again",
                "description"       :       "The lymph nodes in front of my heart were significantly larger than on the previous scan.  As well, the abdominal lymph nodes were also larger.",
                "typeIndex"         :       0,
                "type"              :       "DIAGNOSIS",
                "typeDetails"       :       {
                    "age"                       :       28,
                    "stage"                     :       "IV ?",
                    "metastatic"                :       "yes",
                    "diseaseSites"              :       ["lymph nodes in front of the heart", "lymph nodes in the abdomen"],
                    "lymphNodes"                :       "yes",
                    "vascularInvasion"          :       "no",
                    "microVascularInvastion"    :       "no"                    
                }
            }, {
                "id"                :       "e17",
                "start"             :       "Dec 17 2009 00:08:00",
                "end"               :       "Dec 17 2009 00:16:30",
                "title"             :       "Lymph Nodes Resection",
                "durationEvent"     :       false,
                "description"       :       "This surgery required two surgeons.  First, one surgeon removed the lymph nodes from in front of my heart.  Then, Dr. Tremblay came in to do the abdominal surgery.  Because Dr. Tremblay knew from the previous surgery about the scarring around my pancreas, he planned a different route to reach the suspicious lymph nodes and was able to remove them all.  Before closing me up, he did an ultrasound directly on my liver, which showed no sign of disease.",
                "pDescription"      :       "This surgery required two surgeons.  First, one surgeon removed the lymph nodes from in front of my heart.  Then, Dr. Tremblay came in to do the abdominal surgery.  Because Dr. Tremblay knew from the previous surgery about the scarring around my pancreas, he planned a different route to reach the suspicious lymph nodes and was able to remove them all.  Before closing me up, he did an ultrasound directly on my liver, which showed no sign of disease.",
                "typeIndex"         :       1,
                "type"              :       "SURGERY",
                "typeDetails"       :       {
                    "surgeon"               :       "Dr. Tremblay",
                    "hospital"              :       "M.D. Anderson Cancer Center",
                    "location"              :       "Houston, TX, USA",
                    "recoveryTimeHospital"  :       "7 days",
                    "recoveryTimeHome"      :       "2 and a half weeks"                    
                }
            },  {
                "id"                :       "e18",
                "start"             :       "Feb 1 2010 00:00:00",
                "end"               :       "May 31 2010 00:00:00",
                "title"             :       "Xeloda and Interferon Alpha",
                "durationEvent"     :       true,
                "description"       :       "Xeloda (oral 5FU) for 2 weeks at a time with subcutaneous injections of Interferon Alpha thrice weekly.",
                "pDescription"      :       "Xeloda (Capecitabine) is a very similar drug to 5FU, except it is delivered in a pill form, while 5FU is given intravenously.  Xeloda actually gets turned into 5FU by the human body.\\n\\nI did this chemo as a precaution.  There was no evidence of disease, but because I recently had cancer growing in my body, we were concerned that there could still be cancerous cells hiding in my blood, lymph, or some other tissues.\\n\\nWe figured that since the 5FU & Interferon worked so well in the past, I should do some additional chemo now.\\n\\nI opted for Xeloda this time because of quality of life issues - it's much more convenient to take Xeloda pills than to have a bottle of 5FU attached to your PICC line at all times.  Although we heard some people say that 5FU works better than Xeloda in this disease, we figured that since this was just preventative chemo anyway, my quality of life should count for more.  If I had active disease, I probably would have gone with 5FU not Xeloda.",
                "typeIndex"         :       2,
                "type"              :       "CHEMO",
                "typeDetails"       :       {
                    "result"            :       "unknown",
                    "duration"          :       "3 months",
                    "oncologist"        :       "-- censored --",
                    "sideEffects"       :       ["Swollen Hands and Feet", "Hot Feeling in Hands and Feet", "Elevated Heart Rate (only in the beginning)"]                    
                }
            }]
        },
        chaptersJSON = {
            "chapters" : [
                {
                    "title"     :   "Diagnosis",
                    "start"     :   "September 4, 2006",
                    "end"       :   "September 17, 2006",
                    "text"      :   "I was diagnosed in September 2006 at the age of 25. I was very lucky. The tumor blocked my bile duct which made me more yellow than Bart Simpson, so we caught it early. "    
                }, {
                    "title"     :   "1st Round",
                    "start"     :   "September 31, 2006",
                    "end"       :   "February 21, 2007",
                    "text"      :   "Two painful procedures and an 8hr surgery later and the doctors told me to get on with my life."
                }, {
                    "title"     :   "Metastasis",
                    "start"     :   "September 17, 2007",
                    "end"       :   "November 27, 2007",
                    "text"      :   "In September 2007, it came back. They spotted two tumors - one in the chest and one in my diaphragm. I also had enlarged lymph nodes. The only thing my doctors wanted to try was Sorafenib (\"Nexavar\"). After 10 days, I had to stop - it was killing me faster than the cancer was. My doctors wanted to give up, but my family didn't, so we found other doctors."
                }, {
                    "title"     :   "2nd Round",
                    "start"     :   "December 5, 2007",
                    "end"       :   "June 28, 2009",
                    "text"      :   "Eventually I had a surgery to remove the tumors. They couldn't safely remove the lymph nodes so they gave me some radiation during the surgery. After that, I did 9 rounds of chemotherapy - 5FU and Interferon Alpha. The lymph nodes shrunk somewhat after the first 3 rounds and stayed stable after that. I then went and tried some cell therapy (like Sarah) and the nodes continued to be stable."
                }, {
                    "title"     :   "3rd Round" ,
                    "start"     :   "October 9, 2009",
                    "end"       :   "May 31, 2010",
                    "text"      :   "In October 2009, the lymph nodes started growing again. I had surgery for a 3rd time, and this time, they got it all. I did 3 more rounds of chemo as a precaution, and now I have no evidence of disease."
                } 
            ]
        },

        buildTimeline = function () {

            var startProj = SimileAjax.DateTime.parseGregorianDateTime("Sep 1 2006 00:08:00 GMT-0600"),
                endProj = SimileAjax.DateTime.parseGregorianDateTime("Nov 27 2012 00:00:00 GMT-0600"),
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

                bandInfos = [Timeline.createHotZoneBandInfo({
                     zones: [
                         {   start:    "Sep 01 2006 00:00:00 GMT-0500",
                             end:      "Oct 01 2006 00:00:00 GMT-0500",
                             magnify:  5,
                             unit:     Timeline.DateTime.WEEK
                         },
                         {   start:    "Sep 07 2006 00:00:00 GMT-0500",
                             end:      "Sep 14 2006 00:00:00 GMT-0500",
                             magnify:  7,
                             unit:     Timeline.DateTime.DAY
                         }/*,
                         {   start:    "Aug 02 2006 06:00:00 GMT-0500",
                             end:      "Aug 02 2006 12:00:00 GMT-0500",
                             magnify:  5,
                             unit:     Timeline.DateTime.HOUR
                         }*/
                     ],
                     timeZone:       -5,                    
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

				bandInfos[0].eventPainter.addOnSelectListener(function onSelect(anEventId) {
					var event = eventSource.getEvent(anEventId);
					//alert("Event with ID: '"+anEventId+"' selected!");
													   
					//alert("Event description: "+event.getProperty("description"));
					$("#doctorNotes > textarea").html(event.getProperty("description") || "");
					$("#patientNotes > textarea").html(event.getProperty("pDescription") || "");
				});

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

				updater = makeUpdater(tl);            
        },   


		makeUpdater = function makeUpdater(aTimeline) {
            var timeline = aTimeline,
				hideEvents = {}, //[],
				//highlightEvents = {},
				highlightedEvent,
				
				highlightIndex = 0,

				filterMatcher = function(evt) {
					var eventType = evt.getProperty("typeIndex");
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


       updateEventTypeVis = function updateEventTypeVis(aRadioButton){
            var eventTypeIndex = $(".eventTypeContent").index($(aRadioButton).parents(".eventTypeContent"));
            if (aRadioButton && aRadioButton.value == "show") {
                //Timeline.Cancer.updater.show(aCheckbox.id); // should probably set ID to be {something}_i instead of i
                updater.show(eventTypeIndex);
            }
            else {
                //Timeline.Cancer.updater.hide(aCheckbox.id);
                updater.hide(eventTypeIndex);
            }
        },

	    resizeTimerID = null,
	    onResize = function (){
            console.log("onResize()");
	        if (resizeTimerID == null) {
	            resizeTimerID = window.setTimeout(function(){
	                resizeTimerID = null;
	                tl.layout();
	            }, 500);
	        }
	    };         


    $(function() {
        var currentTheme = $(document).data("theme"),
            $themeSelector = $("#themeSelector"),
            selectedIndex = $("option[value='"+currentTheme+"']", $themeSelector).index(),
            getEmailHTML =  function () {
                return "<div class='email'><a href='mailto:TallFry"+"@facebook.com'>TallFry"+"@facebook.com</a></div>";
            },
            removeEmail = function (event, ui) {
                $(".email", this).remove();
            };



        // DEPENDANCY: themer.js
        // handle case where the default selection is explicitly chosen via the URL
        selectedIndex = selectedIndex >= 0 ? selectedIndex : 0;
        $themeSelector
            .prop("selectedIndex", selectedIndex)
            .change(function(event) {
                themer.setTheme(this.options[this.selectedIndex].value);
            });
        // END DEPENDANCY: themer.js
        
        // DEPENDENCY: jQueryUI.js

        $(".tabs").tabs();

        var dialogConfig = 
        $(".dialog").dialog({
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

        // END DEPENDENCY jQueryUI.js


        // DEPENDENCY: timeline js
        buildTimeline();

        $("#eventInfoBox").on("click", "a.eventTitle", function($event) {
            var targetEventID;

            $event.preventDefault();

            targetEventID = this.href || "";
            if (targetEventID.indexOf("/") >= 0) {
                targetEventID = targetEventID.substring(targetEventID.lastIndexOf("/") + 1);
            }
            app.centerOnEvent(tl, targetEventID);
            updater.highlight(targetEventID); 
        });

        $(window).resize(onResize);
        
        // END DEPENDENCY Timeline.js


        // DEPENDENCY: Timeline.js, JSON files
        $("#eventInfoTabs input:radio").button().click(function() {
            updateEventTypeVis(this);
        });          

        console.log("loading events...");
        /*tl.loadJSON(eventDataURL, function(data, url){
            // this only works when delivered from a server; when using a file URI, the path to the project gets cleared out
            // need a more robust solution
            //eventSource.loadJSON(data, "/images/");
            console.log("done loading events.  Now adding events into Timeline.");
            eventSource.loadJSON(data, url);
            console.log("done adding events to Timeline.");
        });*/
    
        tl.showLoadingMessage();
        console.log("done loading events.  Now adding events into Timeline.");
        eventSource.loadJSON(eventsJSON, eventDataURL);
        console.log("done adding events to Timeline.");
        tl.hideLoadingMessage();

        tl.layout();

        console.log("loading chapters...");
        //$.getJSON(chapterDataURL, function(data) {
        //tl.loadJSON(chapterDataURL, function(data, url) {
        (function(data) {
            var band = tl.getBand(0),
                chapters = data.chapters,
                                        // dummy object to simplify code later
                $highlightedChapter = {"addClass" : function(){}};

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

            $("#patientNotesNav input:radio").each(function(index, value) {
                var chapter = chapters[index],
                    centerDate = new Date(
                        (new Date(chapter.start).getTime() + 
                         new Date(chapter.end).getTime()) / 2),
                    highlightIndexClass = "chapter-index-"+index,
                    $labelNode = $(this.nextSibling);

                console.log("centerDate = ", centerDate);

                // since page is pre-rendered, need to remove the span that is added by calls to $().button()
                // before we can call it later to set up these buttons
                $labelNode.text($labelNode.find("span").text());
                

                $(this).data("centerDate", centerDate)
                    .data("chapterIndex", highlightIndexClass)
                    .button()     // it's already been pre-rendered as a button
                    .click(function(event) {
                        console.log("centering on date...");
                console.log("index = ", index);


                        app.centerOnDate(tl, $(this).data("centerDate"));
                        $highlightedChapter.addClass("hidden");
                        $highlightedChapter = $(".ui-state-highlight.chapter-index-"+index).removeClass("hidden");//.show();

                        $("#patientNotes p").hide();
                        $("#"+this.id+"_text").show();

                    });

                band.addDecorator(new Timeline.SpanHighlightDecorator({
                    startDate   :   chapter.start,
                    endDate     :   chapter.end,
                    cssClass    :   "ui-state-highlight hidden "+highlightIndexClass, 
                    opacity     :   30
                }));          

            })//.first().click();

            tl.paint();

            // since JSON is already preloaded, we know that this will always happen
            if (typeof disableUI !== "null" && typeof disableUI != "undefined") {
                $("body").off("click", disableUI);
            }
            
                 

            $("#patientNotesNav input:radio").first().click();
            //  don't need this if a chapter is selected by default, as the selection handler will take care of this
            //$("#patientNotes p").hide();  

            console.log("done loading chapters");
        })(chaptersJSON);

        app.doPreFetch(["/js/all-creator-beta.js", "/js/all-play-beta.js", "js/all-viewer-beta.js"]);
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
